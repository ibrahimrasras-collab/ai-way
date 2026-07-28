import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateResponse } from '@/lib/llm';
import { searchRelevantChunks } from '@/lib/embeddings';

export async function POST(req: NextRequest) {
  try {
    const { message, chatbotId } = await req.json();

    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId, isActive: true },
    });

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    const relevantChunks = await searchRelevantChunks(chatbotId, message, 5);
    const context = relevantChunks.map((c) => c.content).join('\n\n');

    const response = await generateResponse(
      [
        {
          role: 'system',
          content: `${chatbot.systemPrompt}\n\nContext:\n${context}`,
        },
        { role: 'user', content: message },
      ],
      {
        model: chatbot.model,
        temperature: chatbot.temperature,
        maxTokens: chatbot.maxTokens,
      }
    );

    return NextResponse.json({ message: response.content });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
