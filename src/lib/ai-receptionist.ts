import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';
import logger from './logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

interface IntentAnalysis {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
}

interface SentimentAnalysis {
  score: number; // -1 to 1
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

interface RoutingDecision {
  priority: 'high' | 'medium' | 'low';
  department: string;
  agentType: 'specialist' | 'general';
  estimatedWaitTime: number;
}

interface AgentSuggestion {
  action: string;
  context: string;
  confidence: number;
}

class AIReceptionist {
  private async analyzeIntent(transcript: string): Promise<IntentAnalysis> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Analyze the following customer transcript and extract:
            1. Main intent (e.g., billing, technical support, sales)
            2. Confidence score (0-1)
            3. Key entities (e.g., product names, account numbers)
            Format the response as JSON.`,
          },
          { role: 'user', content: transcript },
        ],
        temperature: 0.3,
      });

      const analysis = JSON.parse(completion.choices[0].message.content || '{}');
      return {
        intent: analysis.intent,
        confidence: analysis.confidence,
        entities: analysis.entities,
      };
    } catch (error) {
      logger.error('Failed to analyze intent:', error);
      throw error;
    }
  }

  private async analyzeSentiment(transcript: string): Promise<SentimentAnalysis> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Analyze the sentiment of the following customer transcript.
            Return a JSON object with:
            1. score (-1 to 1, where -1 is very negative and 1 is very positive)
            2. label (positive, negative, or neutral)
            3. confidence (0-1)`,
          },
          { role: 'user', content: transcript },
        ],
        temperature: 0.3,
      });

      const analysis = JSON.parse(completion.choices[0].message.content || '{}');
      return {
        score: analysis.score,
        label: analysis.label,
        confidence: analysis.confidence,
      };
    } catch (error) {
      logger.error('Failed to analyze sentiment:', error);
      throw error;
    }
  }

  private async fetchCustomerHistory(callerId: string) {
    try {
      const customer = await prisma.user.findFirst({
        where: { phoneNumber: callerId },
        include: {
          interactions: true,
          calls: true,
        },
      });

      return {
        totalInteractions: customer?.interactions.length || 0,
        lastInteraction: customer?.interactions[0]?.createdAt,
        averageSentiment: this.calculateAverageSentiment(customer?.interactions || []),
        previousIssues: this.extractPreviousIssues(customer?.interactions || []),
      };
    } catch (error) {
      logger.error('Failed to fetch customer history:', error);
      throw error;
    }
  }

  private calculateAverageSentiment(interactions: any[]): number {
    if (interactions.length === 0) return 0;
    const sentiments = interactions
      .filter((i) => i.metadata?.sentiment)
      .map((i) => i.metadata.sentiment.score);
    return sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
  }

  private extractPreviousIssues(interactions: any[]): string[] {
    return interactions
      .filter((i) => i.metadata?.intent)
      .map((i) => i.metadata.intent)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private async getAgentAvailability() {
    try {
      const agents = await prisma.user.findMany({
        where: { role: 'AGENT' },
        include: {
          calls: {
            where: {
              status: 'IN_PROGRESS',
            },
          },
        },
      });

      return agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        available: agent.calls.length === 0,
        specialization: agent.metadata?.specialization || 'general',
      }));
    } catch (error) {
      logger.error('Failed to get agent availability:', error);
      throw error;
    }
  }

  private determineRouting(params: {
    intent: string;
    confidence: number;
    sentiment: SentimentAnalysis;
    customerHistory: any;
    agentAvailability: any[];
  }): RoutingDecision {
    const { intent, confidence, sentiment, customerHistory, agentAvailability } = params;

    // Determine priority based on sentiment and history
    const priority = this.calculatePriority(sentiment, customerHistory);

    // Find appropriate department
    const department = this.mapIntentToDepartment(intent);

    // Find available agents
    const availableAgents = agentAvailability.filter((a) => a.available);
    const specialists = availableAgents.filter(
      (a) => a.specialization === department
    );

    return {
      priority,
      department,
      agentType: specialists.length > 0 ? 'specialist' : 'general',
      estimatedWaitTime: this.calculateWaitTime(priority, availableAgents.length),
    };
  }

  private calculatePriority(
    sentiment: SentimentAnalysis,
    history: any
  ): 'high' | 'medium' | 'low' {
    if (sentiment.score < -0.5 || history.totalInteractions > 5) return 'high';
    if (sentiment.score < 0 || history.totalInteractions > 2) return 'medium';
    return 'low';
  }

  private mapIntentToDepartment(intent: string): string {
    const departmentMap: Record<string, string> = {
      billing: 'finance',
      technical: 'support',
      sales: 'sales',
      complaint: 'support',
      general: 'general',
    };
    return departmentMap[intent.toLowerCase()] || 'general';
  }

  private calculateWaitTime(priority: string, availableAgents: number): number {
    const baseWaitTime = 5; // minutes
    const priorityMultiplier = {
      high: 1,
      medium: 2,
      low: 3,
    };
    const agentMultiplier = Math.max(1, 5 - availableAgents);
    return baseWaitTime * priorityMultiplier[priority] * agentMultiplier;
  }

  private async generateSuggestions(params: {
    intent: string;
    sentiment: SentimentAnalysis;
    customerHistory: any;
  }): Promise<AgentSuggestion[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Based on the following information, generate 3 suggestions for the agent:
            1. Customer intent: ${params.intent}
            2. Sentiment: ${params.sentiment.label} (${params.sentiment.score})
            3. Customer history: ${JSON.stringify(params.customerHistory)}
            
            Return a JSON array of suggestions, each with:
            - action: What the agent should do
            - context: Why this action is suggested
            - confidence: How confident we are in this suggestion (0-1)`,
          },
        ],
        temperature: 0.7,
      });

      return JSON.parse(completion.choices[0].message.content || '[]');
    } catch (error) {
      logger.error('Failed to generate suggestions:', error);
      throw error;
    }
  }

  async enhancedCallRouter(callData: any, transcript: string) {
    try {
      // 1. Analyze intent
      const intentAnalysis = await this.analyzeIntent(transcript);

      // 2. Analyze sentiment
      const sentimentAnalysis = await this.analyzeSentiment(transcript);

      // 3. Get customer history
      const customerHistory = await this.fetchCustomerHistory(callData.callerId);

      // 4. Get agent availability
      const agentAvailability = await this.getAgentAvailability();

      // 5. Determine routing
      const routingDecision = this.determineRouting({
        intent: intentAnalysis.intent,
        confidence: intentAnalysis.confidence,
        sentiment: sentimentAnalysis,
        customerHistory,
        agentAvailability,
      });

      // 6. Generate suggestions
      const suggestions = await this.generateSuggestions({
        intent: intentAnalysis.intent,
        sentiment: sentimentAnalysis,
        customerHistory,
      });

      // 7. Log the analysis
      await prisma.interaction.create({
        data: {
          type: 'CALL',
          direction: 'INBOUND',
          content: transcript,
          metadata: {
            intent: intentAnalysis,
            sentiment: sentimentAnalysis,
            routing: routingDecision,
            suggestions,
          },
        },
      });

      return {
        routingDecision,
        suggestions,
        intent: intentAnalysis,
        sentiment: sentimentAnalysis,
      };
    } catch (error) {
      logger.error('Failed to process call:', error);
      throw error;
    }
  }
}

export default new AIReceptionist(); 