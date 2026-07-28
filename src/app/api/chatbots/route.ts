import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createChatbotSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chatbots = await prisma.chatbot.findMany({
    where: { userId: (session.user as any).id },
    include: {
      _count: { select: { documents: true, conversations: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(chatbots);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const data = createChatbotSchema.parse(body);

  const chatbot = await prisma.chatbot.create({
    data: {
      ...data,
      userId: (session.user as any).id,
    },
  });

  return NextResponse.json(chatbot, { status: 201 });
}
