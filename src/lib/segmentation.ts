import { PrismaClient } from '@prisma/client';
import { KMeans } from 'ml-kmeans';
import logger from './logger';

const prisma = new PrismaClient();

interface CustomerFeatures {
  recency: number;
  frequency: number;
  totalPurchases: number;
  avgCallDuration: number;
  websiteVisits: number;
  sentimentScore: number;
}

interface CustomerSegment {
  id: string;
  features: CustomerFeatures;
  segment: number;
  segmentLabel: string;
}

class CustomerSegmentation {
  private async prepareCustomerData() {
    try {
      const customers = await prisma.user.findMany({
        include: {
          interactions: true,
          calls: true,
          purchases: true,
          websiteVisits: true,
        },
      });

      return customers.map(customer => {
        const now = new Date();
        const lastInteraction = customer.interactions[0]?.createdAt || now;
        const recency = Math.floor((now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
        
        const frequency = customer.interactions.filter(interaction => {
          const interactionDate = new Date(interaction.createdAt);
          const daysDiff = (now.getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 90;
        }).length;

        const totalPurchases = customer.purchases.length;
        const avgCallDuration = customer.calls.reduce((acc, call) => acc + (call.duration || 0), 0) / (customer.calls.length || 1);
        const websiteVisits = customer.websiteVisits.length;
        const sentimentScore = this.calculateAverageSentiment(customer.interactions);

        return {
          id: customer.id,
          features: {
            recency,
            frequency,
            totalPurchases,
            avgCallDuration,
            websiteVisits,
            sentimentScore,
          },
        };
      });
    } catch (error) {
      logger.error('Failed to prepare customer data:', error);
      throw error;
    }
  }

  private calculateAverageSentiment(interactions: any[]): number {
    if (interactions.length === 0) return 0;
    const sentiments = interactions
      .filter(i => i.metadata?.sentiment?.score)
      .map(i => i.metadata.sentiment.score);
    return sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
  }

  private normalizeFeatures(features: CustomerFeatures[]): number[][] {
    const normalizedFeatures = features.map(f => [
      f.recency,
      f.frequency,
      f.totalPurchases,
      f.avgCallDuration,
      f.websiteVisits,
      f.sentimentScore,
    ]);

    // Normalize each feature
    const numFeatures = normalizedFeatures[0].length;
    for (let i = 0; i < numFeatures; i++) {
      const values = normalizedFeatures.map(f => f[i]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;

      if (range === 0) continue;

      normalizedFeatures.forEach(f => {
        f[i] = (f[i] - min) / range;
      });
    }

    return normalizedFeatures;
  }

  private determineOptimalClusters(features: number[][]): number {
    const maxClusters = Math.min(10, features.length);
    const inertias: number[] = [];

    for (let k = 1; k <= maxClusters; k++) {
      const kmeans = new KMeans(features, k);
      inertias.push(kmeans.inertia);
    }

    // Find the elbow point
    let optimalK = 4; // Default
    for (let i = 1; i < inertias.length - 1; i++) {
      const prevDiff = inertias[i - 1] - inertias[i];
      const nextDiff = inertias[i] - inertias[i + 1];
      if (nextDiff < prevDiff * 0.5) {
        optimalK = i + 1;
        break;
      }
    }

    return optimalK;
  }

  private labelSegments(segments: CustomerSegment[]): CustomerSegment[] {
    const segmentLabels = {
      0: 'high_value_active',
      1: 'high_value_at_risk',
      2: 'low_value_active',
      3: 'dormant',
    };

    return segments.map(segment => ({
      ...segment,
      segmentLabel: segmentLabels[segment.segment as keyof typeof segmentLabels] || 'unknown',
    }));
  }

  async performSegmentation(): Promise<CustomerSegment[]> {
    try {
      // 1. Prepare customer data
      const customerData = await this.prepareCustomerData();
      const features = customerData.map(c => c.features);

      // 2. Normalize features
      const normalizedFeatures = this.normalizeFeatures(features);

      // 3. Determine optimal number of clusters
      const optimalClusters = this.determineOptimalClusters(normalizedFeatures);

      // 4. Perform clustering
      const kmeans = new KMeans(normalizedFeatures, optimalClusters);
      const segments = customerData.map((customer, index) => ({
        id: customer.id,
        features: customer.features,
        segment: kmeans.clusters[index],
      }));

      // 5. Label segments
      const labeledSegments = this.labelSegments(segments);

      // 6. Update customer segments in database
      await Promise.all(
        labeledSegments.map(segment =>
          prisma.user.update({
            where: { id: segment.id },
            data: {
              metadata: {
                ...segment.features,
                segment: segment.segmentLabel,
              },
            },
          })
        )
      );

      return labeledSegments;
    } catch (error) {
      logger.error('Failed to perform customer segmentation:', error);
      throw error;
    }
  }
}

export default new CustomerSegmentation(); 