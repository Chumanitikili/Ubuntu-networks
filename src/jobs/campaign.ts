import Bull from 'bull';
import campaignEngine from '@/lib/campaign';
import logger from '@/lib/logger';

const campaignQueue = new Bull('campaign', process.env.REDIS_URL || 'redis://localhost:6379');

// Process campaign step
campaignQueue.process('process-campaign-step', async (job) => {
  try {
    const { executionId } = job.data;
    await campaignEngine.processCampaignStep(executionId);
  } catch (error) {
    logger.error('Failed to process campaign step:', error);
    throw error;
  }
});

// Evaluate triggers
campaignQueue.process('evaluate-triggers', async () => {
  try {
    await campaignEngine.evaluateTriggers();
  } catch (error) {
    logger.error('Failed to evaluate triggers:', error);
    throw error;
  }
});

// Schedule trigger evaluation every hour
campaignQueue.add(
  'evaluate-triggers',
  {},
  {
    repeat: {
      cron: '0 * * * *', // Every hour
    },
  }
);

// Error handling
campaignQueue.on('error', (error) => {
  logger.error('Campaign queue error:', error);
});

campaignQueue.on('failed', (job, error) => {
  logger.error(`Campaign job ${job.id} failed:`, error);
});

export default campaignQueue; 