import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { crawlWebsite } from '@/lib/crawler';
import { processDocument } from '@/lib/embeddings';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { chatbotId, url } = await req.json();

  const chatbot = await prisma.chatbot.findFirst({
    where: { id: chatbotId, userId: (session.user as any).id },
  });

  if (!chatbot) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const source = await prisma.dataSource.create({
    data: {
      type: 'WEBSITE',
      url,
      name: url,
      chatbotId,
      status: 'CRAWLING',
    },
  });

  crawlWebsite(url, 30).then(async (pages) => {
    for (const page of pages) {
      const doc = await prisma.document.create({
        data: {
          name: page.title || page.url,
          content: page.content,
          mimeType: 'text/html',
          chatbotId,
          dataSourceId: source.id,
          tokens: Math.ceil(page.content.split(/\s+/).length * 1.3),
        },
      });
      await processDocument(doc.id, page.content);
    }

    await prisma.dataSource.update({
      where: { id: source.id },
      data: { status: 'COMPLETED', pageCount: pages.length },
    });
  }).catch(async () => {
    await prisma.dataSource.update({
      where: { id: source.id },
      data: { status: 'FAILED' },
    });
  });

  return NextResponse.json(source, { status: 201 });
}
