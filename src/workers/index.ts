import { prisma } from '../lib/db';
import { crawlWebsite } from '../lib/crawler';
import { processDocument } from '../lib/embeddings';

async function processPendingDataSources() {
  const pending = await prisma.dataSource.findMany({
    where: { status: { in: ['PENDING', 'CRAWLING'] } },
    take: 5,
  });

  for (const source of pending) {
    if (source.type === 'WEBSITE' && source.url) {
      try {
        await prisma.dataSource.update({
          where: { id: source.id },
          data: { status: 'CRAWLING' },
        });

        const pages = await crawlWebsite(source.url, 50);

        for (const page of pages) {
          const doc = await prisma.document.create({
            data: {
              name: page.title || page.url,
              content: page.content,
              mimeType: 'text/html',
              chatbotId: source.chatbotId,
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

        console.log(`Crawled ${pages.length} pages from ${source.url}`);
      } catch (error) {
        await prisma.dataSource.update({
          where: { id: source.id },
          data: { status: 'FAILED' },
        });
        console.error(`Failed to crawl ${source.url}:`, error);
      }
    }
  }
}

async function processPendingDocuments() {
  const pending = await prisma.document.findMany({
    where: { status: 'PENDING' },
    take: 10,
  });

  for (const doc of pending) {
    try {
      await processDocument(doc.id, doc.content);
      console.log(`Processed document: ${doc.name}`);
    } catch (error) {
      console.error(`Failed to process document ${doc.name}:`, error);
    }
  }
}

async function run() {
  console.log('Worker started, processing queue...');
  while (true) {
    try {
      await processPendingDataSources();
      await processPendingDocuments();
    } catch (error) {
      console.error('Worker error:', error);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
}

run();
