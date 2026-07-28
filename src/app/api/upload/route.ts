import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { processDocument } from '@/lib/embeddings';
import { splitIntoChunks } from '@/lib/embeddings';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const chatbotId = formData.get('chatbotId') as string;
  const file = formData.get('file') as File;

  if (!chatbotId || !file) {
    return NextResponse.json(
      { error: 'chatbotId and file required' },
      { status: 400 }
    );
  }

  const chatbot = await prisma.chatbot.findFirst({
    where: { id: chatbotId, userId: (session.user as any).id },
  });

  if (!chatbot) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const content = await file.text();
  const document = await prisma.document.create({
    data: {
      name: file.name,
      content,
      mimeType: file.type || 'text/plain',
      chatbotId,
      tokens: Math.ceil(content.split(/\s+/).length * 1.3),
    },
  });

  processDocument(document.id, content).catch(console.error);

  return NextResponse.json(document, { status: 201 });
}
