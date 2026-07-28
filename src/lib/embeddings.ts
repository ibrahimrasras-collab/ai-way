import { prisma } from './db';
import { generateSingleEmbedding } from './llm';

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

export function splitIntoChunks(text: string): string[] {
  const chunks: string[] = [];
  const words = text.split(/\s+/);

  for (let i = 0; i < words.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    chunks.push(words.slice(i, i + CHUNK_SIZE).join(' '));
  }

  return chunks.filter((c) => c.trim().length > 0);
}

export async function processDocument(
  documentId: string,
  content: string
): Promise<void> {
  await prisma.document.update({
    where: { id: documentId },
    data: { status: 'PROCESSING' },
  });

  try {
    const chunks = splitIntoChunks(content);

    for (const chunkContent of chunks) {
      const embedding = await generateSingleEmbedding(chunkContent);
      const tokenCount = Math.ceil(chunkContent.split(/\s+/).length * 1.3);

      await prisma.chunk.create({
        data: {
          content: chunkContent,
          tokens: tokenCount,
          embedding: embedding as any,
          documentId,
        },
      });
    }

    const totalTokens = chunks.reduce(
      (sum, c) => sum + Math.ceil(c.split(/\s+/).length * 1.3),
      0
    );

    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'COMPLETED', tokens: totalTokens },
    });
  } catch (error) {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'FAILED' },
    });
    throw error;
  }
}

export async function searchRelevantChunks(
  chatbotId: string,
  query: string,
  limit = 5
): Promise<{ content: string; score: number }[]> {
  const queryEmbedding = await generateSingleEmbedding(query);

  const results = await prisma.$queryRawUnsafe`
    SELECT c.content, 1 - (c.embedding <=> ${queryEmbedding}::vector) as score
    FROM "Chunk" c
    JOIN "Document" d ON c."documentId" = d.id
    WHERE d."chatbotId" = ${chatbotId}
      AND d.status = 'COMPLETED'
    ORDER BY c.embedding <=> ${queryEmbedding}::vector
    LIMIT ${limit}
  `;

  return results as { content: string; score: number }[];
}
