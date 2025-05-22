import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import logger from './logger';

const prisma = new PrismaClient();

interface CampaignMetrics {
  campaignId: string;
  segment: string;
  totalCustomers: number;
  engagedCustomers: number;
  conversionRate: number;
  revenue: number;
  roi: number;
}

class Analytics {
  private metabaseClient: any;

  constructor() {
    this.metabaseClient = axios.create({
      baseURL: process.env.METABASE_API_URL,
      headers: {
        'X-Metabase-Session': process.env.METABASE_API_KEY,
      },
    });
  }

  async createDashboard(name: string, metrics: CampaignMetrics[]) {
    try {
      const dashboard = {
        name,
        description: 'Campaign Performance Dashboard',
        cards: this.generateDashboardCards(metrics),
      };

      const response = await this.metabaseClient.post('/api/dashboard', dashboard);
      return response.data;
    } catch (error) {
      logger.error('Failed to create Metabase dashboard:', error);
      throw error;
    }
  }

  private generateDashboardCards(metrics: CampaignMetrics[]) {
    return [
      {
        name: 'Campaign Overview',
        type: 'table',
        query: {
          type: 'native',
          native: {
            query: `
              SELECT 
                campaign_id,
                segment,
                total_customers,
                engaged_customers,
                conversion_rate,
                revenue,
                roi
              FROM campaign_metrics
              WHERE campaign_id IN (${metrics.map(m => `'${m.campaignId}'`).join(',')})
            `,
          },
        },
      },
      {
        name: 'Conversion Rate by Segment',
        type: 'bar',
        query: {
          type: 'native',
          native: {
            query: `
              SELECT 
                segment,
                AVG(conversion_rate) as avg_conversion_rate
              FROM campaign_metrics
              GROUP BY segment
            `,
          },
        },
      },
      {
        name: 'ROI Trend',
        type: 'line',
        query: {
          type: 'native',
          native: {
            query: `
              SELECT 
                DATE_TRUNC('day', created_at) as date,
                AVG(roi) as avg_roi
              FROM campaign_metrics
              GROUP BY DATE_TRUNC('day', created_at)
              ORDER BY date
            `,
          },
        },
      },
    ];
  }

  async trackCampaignMetrics(campaignId: string) {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          executions: {
            include: {
              customer: true,
            },
          },
        },
      });

      if (!campaign) {
        throw new Error(`Campaign ${campaignId} not found`);
      }

      const metrics = await this.calculateCampaignMetrics(campaign);
      await this.saveMetricsToMetabase(metrics);
      await this.updateCampaignMetrics(campaignId, metrics);

      return metrics;
    } catch (error) {
      logger.error('Failed to track campaign metrics:', error);
      throw error;
    }
  }

  private async calculateCampaignMetrics(campaign: any): Promise<CampaignMetrics> {
    const totalCustomers = campaign.executions.length;
    const engagedCustomers = campaign.executions.filter(
      (e: any) => e.status === 'COMPLETED'
    ).length;
    const conversionRate = (engagedCustomers / totalCustomers) * 100;

    const revenue = campaign.executions.reduce((acc: number, exec: any) => {
      return acc + (exec.metadata?.revenue || 0);
    }, 0);

    const cost = campaign.executions.reduce((acc: number, exec: any) => {
      return acc + (exec.metadata?.cost || 0);
    }, 0);

    const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;

    return {
      campaignId: campaign.id,
      segment: campaign.metrics?.targetSegment || 'unknown',
      totalCustomers,
      engagedCustomers,
      conversionRate,
      revenue,
      roi,
    };
  }

  private async saveMetricsToMetabase(metrics: CampaignMetrics) {
    try {
      await this.metabaseClient.post('/api/dataset/campaign_metrics', {
        data: metrics,
      });
    } catch (error) {
      logger.error('Failed to save metrics to Metabase:', error);
      throw error;
    }
  }

  private async updateCampaignMetrics(campaignId: string, metrics: CampaignMetrics) {
    try {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          metrics: {
            ...metrics,
            lastUpdated: new Date(),
          },
        },
      });
    } catch (error) {
      logger.error('Failed to update campaign metrics:', error);
      throw error;
    }
  }

  async generateReport(campaignId: string) {
    try {
      const metrics = await this.trackCampaignMetrics(campaignId);
      const dashboard = await this.createDashboard(
        `Campaign Report - ${campaignId}`,
        [metrics]
      );

      return {
        metrics,
        dashboardUrl: `${process.env.METABASE_URL}/dashboard/${dashboard.id}`,
      };
    } catch (error) {
      logger.error('Failed to generate campaign report:', error);
      throw error;
    }
  }
}

export default new Analytics(); 