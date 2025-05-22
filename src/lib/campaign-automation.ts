import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import logger from './logger';
import segmentation from './segmentation';

const prisma = new PrismaClient();

interface CampaignTrigger {
  segment: string;
  condition: string;
  action: string;
  schedule?: string;
}

interface WorkflowStep {
  type: 'email' | 'sms' | 'call' | 'webhook';
  config: Record<string, any>;
  delay?: number;
}

class CampaignAutomation {
  private mauticClient: any;
  private n8nClient: any;

  constructor() {
    this.mauticClient = axios.create({
      baseURL: process.env.MAUTIC_API_URL,
      auth: {
        username: process.env.MAUTIC_API_USERNAME!,
        password: process.env.MAUTIC_API_PASSWORD!,
      },
    });

    this.n8nClient = axios.create({
      baseURL: process.env.N8N_API_URL,
      headers: {
        'X-N8N-API-KEY': process.env.N8N_API_KEY,
      },
    });
  }

  async createMauticCampaign(name: string, steps: WorkflowStep[]) {
    try {
      const response = await this.mauticClient.post('/campaigns/new', {
        name,
        description: `Automated campaign created by AI Receptionist`,
        isPublished: true,
        events: steps.map((step, index) => ({
          name: `Step ${index + 1}`,
          type: step.type,
          properties: step.config,
          triggerMode: 'immediate',
          ...(step.delay && { delay: step.delay }),
        })),
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to create Mautic campaign:', error);
      throw error;
    }
  }

  async createN8nWorkflow(name: string, steps: WorkflowStep[]) {
    try {
      const workflow = {
        name,
        nodes: steps.map((step, index) => ({
          id: `node_${index}`,
          type: this.mapStepToN8nNode(step.type),
          position: [index * 200, 0],
          parameters: step.config,
        })),
        connections: steps.map((_, index) => ({
          source: `node_${index}`,
          target: `node_${index + 1}`,
        })).slice(0, -1),
      };

      const response = await this.n8nClient.post('/workflows', workflow);
      return response.data;
    } catch (error) {
      logger.error('Failed to create n8n workflow:', error);
      throw error;
    }
  }

  private mapStepToN8nNode(type: string): string {
    const nodeMap: Record<string, string> = {
      email: 'n8n-nodes-base.emailSend',
      sms: 'n8n-nodes-base.twilio',
      call: 'n8n-nodes-base.twilio',
      webhook: 'n8n-nodes-base.webhook',
    };
    return nodeMap[type] || 'n8n-nodes-base.noOp';
  }

  async createReengagementCampaign(trigger: CampaignTrigger) {
    try {
      // 1. Get customers in the target segment
      const segments = await segmentation.performSegmentation();
      const targetCustomers = segments.filter(s => s.segmentLabel === trigger.segment);

      // 2. Create campaign steps based on trigger
      const steps = this.generateCampaignSteps(trigger, targetCustomers);

      // 3. Create campaign in Mautic
      const mauticCampaign = await this.createMauticCampaign(
        `Reengagement - ${trigger.segment}`,
        steps
      );

      // 4. Create workflow in n8n
      const n8nWorkflow = await this.createN8nWorkflow(
        `Reengagement - ${trigger.segment}`,
        steps
      );

      // 5. Save campaign in database
      const campaign = await prisma.campaign.create({
        data: {
          name: `Reengagement - ${trigger.segment}`,
          type: 'REENGAGEMENT',
          status: 'ACTIVE',
          triggerConditions: trigger,
          contentSequence: steps,
          metrics: {
            mauticCampaignId: mauticCampaign.id,
            n8nWorkflowId: n8nWorkflow.id,
            targetSegment: trigger.segment,
            customerCount: targetCustomers.length,
          },
        },
      });

      return campaign;
    } catch (error) {
      logger.error('Failed to create reengagement campaign:', error);
      throw error;
    }
  }

  private generateCampaignSteps(trigger: CampaignTrigger, customers: any[]): WorkflowStep[] {
    const steps: WorkflowStep[] = [];

    // Add initial email
    steps.push({
      type: 'email',
      config: {
        subject: this.generateEmailSubject(trigger.segment),
        body: this.generateEmailBody(trigger.segment),
        to: customers.map(c => c.email),
      },
    });

    // Add follow-up steps based on segment
    switch (trigger.segment) {
      case 'high_value_at_risk':
        steps.push(
          {
            type: 'call',
            config: {
              message: 'Personalized reengagement call',
              to: customers.map(c => c.phoneNumber),
            },
            delay: 2 * 24 * 60 * 60, // 2 days
          },
          {
            type: 'sms',
            config: {
              message: 'Special offer for returning customers',
              to: customers.map(c => c.phoneNumber),
            },
            delay: 5 * 24 * 60 * 60, // 5 days
          }
        );
        break;

      case 'dormant':
        steps.push(
          {
            type: 'email',
            config: {
              subject: 'We miss you!',
              body: 'Special reactivation offer',
              to: customers.map(c => c.email),
            },
            delay: 7 * 24 * 60 * 60, // 7 days
          },
          {
            type: 'sms',
            config: {
              message: 'Limited time reactivation offer',
              to: customers.map(c => c.phoneNumber),
            },
            delay: 14 * 24 * 60 * 60, // 14 days
          }
        );
        break;
    }

    return steps;
  }

  private generateEmailSubject(segment: string): string {
    const subjects: Record<string, string> = {
      high_value_at_risk: 'We noticed you haven\'t been around lately...',
      dormant: 'Welcome back! Special offer inside',
      low_value_active: 'New features you might like',
      high_value_active: 'Exclusive preview for our valued customers',
    };
    return subjects[segment] || 'We\'d love to hear from you';
  }

  private generateEmailBody(segment: string): string {
    const templates: Record<string, string> = {
      high_value_at_risk: `
        Dear valued customer,
        
        We noticed you haven't been using our services lately. We'd love to know if there's anything we can do to improve your experience.
        
        As a token of our appreciation, we're offering you a special discount on your next purchase.
        
        Best regards,
        The Team
      `,
      dormant: `
        Hello!
        
        We miss having you as an active customer. To welcome you back, we're offering an exclusive reactivation bonus.
        
        Click here to learn more about our latest features and how they can benefit you.
        
        Warm regards,
        The Team
      `,
    };
    return templates[segment] || 'We hope to see you again soon!';
  }
}

export default new CampaignAutomation(); 