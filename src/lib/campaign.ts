import { PrismaClient, User, Campaign, CampaignExecution, ExecutionStatus } from '@prisma/client';
import { queue } from './redis';
import logger from './logger';

const prisma = new PrismaClient();

interface EngagementScore {
  lastInteraction: number;
  purchaseFrequency: number;
  supportTickets: number;
  emailEngagement: number;
  total: number;
}

class CampaignEngine {
  async calculateEngagementScore(customerId: string): Promise<EngagementScore> {
    try {
      const customer = await prisma.user.findUnique({
        where: { id: customerId },
        include: {
          interactions: true,
          calls: true,
          sms: true,
        },
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Calculate last interaction score (0-25 points)
      const lastInteraction = this.calculateLastInteractionScore(customer);

      // Calculate purchase frequency score (0-25 points)
      const purchaseFrequency = this.calculatePurchaseFrequencyScore(customer);

      // Calculate support ticket score (0-25 points)
      const supportTickets = this.calculateSupportTicketScore(customer);

      // Calculate email engagement score (0-25 points)
      const emailEngagement = this.calculateEmailEngagementScore(customer);

      const total = lastInteraction + purchaseFrequency + supportTickets + emailEngagement;

      return {
        lastInteraction,
        purchaseFrequency,
        supportTickets,
        emailEngagement,
        total,
      };
    } catch (error) {
      logger.error('Failed to calculate engagement score:', error);
      throw error;
    }
  }

  private calculateLastInteractionScore(customer: User & { interactions: any[] }): number {
    const lastInteraction = Math.max(
      ...customer.interactions.map((i) => i.createdAt.getTime())
    );
    const daysSinceLastInteraction = (Date.now() - lastInteraction) / (1000 * 60 * 60 * 24);
    return Math.max(0, 25 - Math.floor(daysSinceLastInteraction));
  }

  private calculatePurchaseFrequencyScore(customer: User): number {
    // Implement purchase frequency calculation
    return 0;
  }

  private calculateSupportTicketScore(customer: User): number {
    // Implement support ticket calculation
    return 0;
  }

  private calculateEmailEngagementScore(customer: User): number {
    // Implement email engagement calculation
    return 0;
  }

  async evaluateTriggers(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const customers = await prisma.user.findMany({
        where: {
          interactions: {
            none: {
              createdAt: {
                gt: thirtyDaysAgo,
              },
            },
          },
        },
      });

      for (const customer of customers) {
        await this.triggerCampaign(customer);
      }
    } catch (error) {
      logger.error('Failed to evaluate triggers:', error);
      throw error;
    }
  }

  async triggerCampaign(customer: User): Promise<void> {
    try {
      const engagementScore = await this.calculateEngagementScore(customer.id);

      // Find appropriate campaign based on engagement score
      const campaign = await this.findMatchingCampaign(engagementScore.total);

      if (campaign) {
        await this.createCampaignExecution(campaign, customer);
      }
    } catch (error) {
      logger.error('Failed to trigger campaign:', error);
      throw error;
    }
  }

  private async findMatchingCampaign(score: number): Promise<Campaign | null> {
    return prisma.campaign.findFirst({
      where: {
        status: 'ACTIVE',
        triggerConditions: {
          path: ['minScore'],
          lte: score,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async createCampaignExecution(
    campaign: Campaign,
    customer: User
  ): Promise<CampaignExecution> {
    const execution = await prisma.campaignExecution.create({
      data: {
        campaignId: campaign.id,
        customerId: customer.id,
        status: 'ACTIVE',
        nextActionAt: new Date(),
      },
    });

    // Add to processing queue
    await queue.add('process-campaign-step', {
      executionId: execution.id,
    });

    return execution;
  }

  async processCampaignStep(executionId: string): Promise<void> {
    try {
      const execution = await prisma.campaignExecution.findUnique({
        where: { id: executionId },
        include: { campaign: true },
      });

      if (!execution || execution.status !== 'ACTIVE') {
        return;
      }

      const contentSequence = execution.campaign.contentSequence as any[];
      const currentStep = contentSequence[execution.currentStep];

      if (!currentStep) {
        await this.completeCampaignExecution(execution);
        return;
      }

      await this.executeCampaignStep(execution, currentStep);

      // Schedule next step
      if (execution.currentStep < contentSequence.length - 1) {
        await this.scheduleNextStep(execution);
      } else {
        await this.completeCampaignExecution(execution);
      }
    } catch (error) {
      logger.error('Failed to process campaign step:', error);
      throw error;
    }
  }

  private async executeCampaignStep(
    execution: CampaignExecution,
    step: any
  ): Promise<void> {
    switch (step.type) {
      case 'EMAIL':
        await this.sendEmail(execution, step);
        break;
      case 'SMS':
        await this.sendSMS(execution, step);
        break;
      case 'CALL':
        await this.scheduleCall(execution, step);
        break;
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private async sendEmail(execution: CampaignExecution, step: any): Promise<void> {
    // Implement email sending
  }

  private async sendSMS(execution: CampaignExecution, step: any): Promise<void> {
    // Implement SMS sending
  }

  private async scheduleCall(execution: CampaignExecution, step: any): Promise<void> {
    // Implement call scheduling
  }

  private async scheduleNextStep(execution: CampaignExecution): Promise<void> {
    const nextStepDelay = 24 * 60 * 60 * 1000; // 24 hours
    const nextActionAt = new Date(Date.now() + nextStepDelay);

    await prisma.campaignExecution.update({
      where: { id: execution.id },
      data: {
        currentStep: execution.currentStep + 1,
        nextActionAt,
      },
    });

    await queue.add(
      'process-campaign-step',
      { executionId: execution.id },
      { delay: nextStepDelay }
    );
  }

  private async completeCampaignExecution(
    execution: CampaignExecution
  ): Promise<void> {
    await prisma.campaignExecution.update({
      where: { id: execution.id },
      data: {
        status: 'COMPLETED',
      },
    });
  }
}

export default new CampaignEngine(); 