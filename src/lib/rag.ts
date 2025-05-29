import { OpenAI } from 'openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { RetrievalQAChain } from 'langchain/chains';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import logger from './logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RAGResponse {
  answer: string;
  sources: {
    content: string;
    metadata: Record<string, any>;
  }[];
  confidence: number;
}

class RAGService {
  private vectorStore: Chroma | null = null;
  private qaChain: RetrievalQAChain | null = null;

  async initialize(knowledgeDir: string, persistDir: string) {
    try {
      // 1. Load documents
      const loader = new DirectoryLoader(knowledgeDir, {
        '.md': (path) => new TextLoader(path),
      });
      const documents = await loader.load();

      // 2. Split text into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const texts = await textSplitter.splitDocuments(documents);

      // 3. Create embeddings
      const embeddings = new HuggingFaceInferenceEmbeddings({
        modelName: 'sentence-transformers/all-MiniLM-L6-v2',
      });

      // 4. Initialize vector store
      this.vectorStore = await Chroma.fromDocuments(texts, embeddings, {
        persistDirectory: persistDir,
      });

      // 5. Create QA chain
      this.qaChain = new RetrievalQAChain({
        combineDocumentsChain: {
          type: 'stuff',
          llm: openai,
          prompt: this.createPrompt(),
        },
        retriever: this.vectorStore.asRetriever({
          searchKwargs: { k: 3 },
        }),
        returnSourceDocuments: true,
      });

      logger.info('RAG system initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize RAG system:', error);
      throw error;
    }
  }

  private createPrompt() {
    return `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Use three sentences maximum and keep the answer concise.

    Context: {context}

    Question: {question}

    Answer:`;
  }

  async query(question: string): Promise<RAGResponse> {
    try {
      if (!this.qaChain) {
        throw new Error('RAG system not initialized');
      }

      const response = await this.qaChain.call({
        query: question,
      });

      // Calculate confidence based on source relevance
      const confidence = this.calculateConfidence(response.sourceDocuments);

      return {
        answer: response.text,
        sources: response.sourceDocuments.map((doc: any) => ({
          content: doc.pageContent,
          metadata: doc.metadata,
        })),
        confidence,
      };
    } catch (error) {
      logger.error('Failed to process query:', error);
      throw error;
    }
  }

  private calculateConfidence(sources: any[]): number {
    if (!sources.length) return 0;

    // Calculate confidence based on source relevance scores
    const relevanceScores = sources.map((source: any) => source.metadata?.relevance || 0);
    const avgRelevance = relevanceScores.reduce((a, b) => a + b, 0) / relevanceScores.length;

    // Normalize confidence to 0-1 range
    return Math.min(Math.max(avgRelevance, 0), 1);
  }

  async addDocument(content: string, metadata: Record<string, any>) {
    try {
      if (!this.vectorStore) {
        throw new Error('Vector store not initialized');
      }

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const texts = await textSplitter.splitText(content);
      const documents = texts.map((text) => ({
        pageContent: text,
        metadata,
      }));

      await this.vectorStore.addDocuments(documents);
      logger.info('Document added successfully');
    } catch (error) {
      logger.error('Failed to add document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string) {
    try {
      if (!this.vectorStore) {
        throw new Error('Vector store not initialized');
      }

      await this.vectorStore.delete({ ids: [id] });
      logger.info('Document deleted successfully');
    } catch (error) {
      logger.error('Failed to delete document:', error);
      throw error;
    }
  }
}

export default new RAGService(); 