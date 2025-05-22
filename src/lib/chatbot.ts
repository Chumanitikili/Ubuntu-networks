import { OpenAI } from 'openai';
import { QdrantClient } from '@qdrant/js-client-rest';
import { PrismaClient } from '@prisma/client';
import logger from './logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
});

const prisma = new PrismaClient();

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class ChatbotService {
  private async getRelevantArticles(query: string): Promise<any[]> {
    // Get embedding for the query
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });

    // Search for relevant articles in Qdrant
    const searchResult = await qdrant.search('knowledge_articles', {
      vector: embedding.data[0].embedding,
      limit: 3,
    });

    // Get full article content from database
    const articleIds = searchResult.map((result) => result.id);
    const articles = await prisma.knowledgeArticle.findMany({
      where: {
        id: {
          in: articleIds,
        },
      },
    });

    return articles;
  }

  private async generateResponse(
    query: string,
    context: any[],
    chatHistory: ChatMessage[]
  ): Promise<string> {
    const systemPrompt = `You are a helpful customer service chatbot. Use the following context to answer the user's question. If you cannot find the answer in the context, say so politely.

Context:
${context.map((article) => `- ${article.title}: ${article.content}`).join('\n')}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: query },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content || 'I apologize, but I could not generate a response.';
  }

  async processQuery(query: string, chatHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Get relevant articles
      const relevantArticles = await this.getRelevantArticles(query);

      // Generate response
      const response = await this.generateResponse(query, relevantArticles, chatHistory);

      // Log interaction
      await prisma.interaction.create({
        data: {
          type: 'CHAT',
          direction: 'INBOUND',
          content: query,
          response: response,
          metadata: {
            relevantArticles: relevantArticles.map((article) => article.id),
          },
        },
      });

      return response;
    } catch (error) {
      logger.error('Error processing chatbot query:', error);
      throw error;
    }
  }

  async indexArticle(article: any): Promise<void> {
    try {
      // Generate embedding for the article
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: `${article.title} ${article.content}`,
      });

      // Store in Qdrant
      await qdrant.upsert('knowledge_articles', {
        points: [
          {
            id: article.id,
            vector: embedding.data[0].embedding,
            payload: {
              title: article.title,
              content: article.content,
            },
          },
        ],
      });

      logger.info(`Indexed article: ${article.title}`);
    } catch (error) {
      logger.error('Error indexing article:', error);
      throw error;
    }
  }
}

export default new ChatbotService(); 