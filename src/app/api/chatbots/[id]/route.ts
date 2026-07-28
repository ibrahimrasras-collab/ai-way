import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chatbot = await prisma.chatbot.findFirst({
    where: { id: params.id, userId: (session.user as any).id },
    include: {
      documents: { orderBy: { createdAt: 'desc' } },
      sources: { orderBy: { createdAt: 'desc' } },
      _count: { select: { conversations: true } },
    },
  });

  if (!chatbot) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(chatbot);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const chatbot = await prisma.chatbot.updateMany({
    where: { id: params.id, userId: (session.user as any).id },
    data: body,
  });

  return NextResponse.json(chatbot);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.chatbot.deleteMany({
    where: { id: params.id, userId: (session.user as any).id },
  });

  return NextResponse.json({ ok: true });
}
