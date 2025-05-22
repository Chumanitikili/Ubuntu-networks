import { QdrantClient } from '@qdrant/js-client-rest';
import { PrismaClient } from '@prisma/client';
import chatbot from '@/lib/chatbot';
import logger from '@/lib/logger';

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
});

const prisma = new PrismaClient();

async function initializeQdrant() {
  try {
    // Create collection if it doesn't exist
    const collections = await qdrant.getCollections();
    const collectionExists = collections.collections.some(
      (c) => c.name === 'knowledge_articles'
    );

    if (!collectionExists) {
      await qdrant.createCollection('knowledge_articles', {
        vectors: {
          size: 1536, // OpenAI ada-002 embedding size
          distance: 'Cosine',
        },
      });
      logger.info('Created knowledge_articles collection');
    }

    // Get all knowledge articles
    const articles = await prisma.knowledgeArticle.findMany();

    // Index each article
    for (const article of articles) {
      await chatbot.indexArticle(article);
    }

    logger.info(`Indexed ${articles.length} articles`);
  } catch (error) {
    logger.error('Failed to initialize Qdrant:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
initializeQdrant().catch((error) => {
  console.error('Initialization failed:', error);
  process.exit(1);
}); 