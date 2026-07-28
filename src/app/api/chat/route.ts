import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { searchRelevantChunks } from '@/lib/embeddings';
import { generateResponse } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const { message, chatbotId, conversationId } = await req.json();

    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    let convId = conversationId;
    if (!convId) {
      const conv = await prisma.conversation.create({
        data: { chatbotId },
      });
      convId = conv.id;
    }

    await prisma.message.create({
      data: { role: 'USER', content: message, conversationId: convId },
    });

    const relevantChunks = await searchRelevantChunks(chatbotId, message, 5);
    const context = relevantChunks.map((c) => c.content).join('\n\n');

    const history = await prisma.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const messages = [
      {
        role: 'system' as const,
        content: `${chatbot.systemPrompt}\n\nContext from knowledge base:\n${context}`,
      },
      ...history.map((m) => ({
        role: m.role.toLowerCase() as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const response = await generateResponse(messages, {
      model: chatbot.model,
      temperature: chatbot.temperature,
      maxTokens: chatbot.maxTokens,
    });

    await prisma.message.create({
      data: {
        role: 'ASSISTANT',
        content: response.content,
        tokens: response.tokens,
        conversationId: convId,
      },
    });

    await prisma.usage.upsert({
      where: {
        userId_month: {
          userId: chatbot.userId,
          month: new Date().toISOString().slice(0, 7),
        },
      },
      update: { queries: { increment: 1 }, tokens: { increment: response.tokens } },
      create: {
        userId: chatbot.userId,
        month: new Date().toISOString().slice(0, 7),
        queries: 1,
        tokens: response.tokens,
      },
    });

    return NextResponse.json({
      message: response.content,
      conversationId: convId,
      tokens: response.tokens,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
