import { PrismaClient } from '@prisma/client';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

const sampleArticles = [
  {
    title: 'How to Reset Your Password',
    content: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your email. The password reset link will expire in 24 hours.',
    category: 'Account',
    tags: ['password', 'security', 'account'],
  },
  {
    title: 'Payment Methods',
    content: 'We accept various payment methods including credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment gateway.',
    category: 'Billing',
    tags: ['payment', 'billing', 'credit card', 'paypal'],
  },
  {
    title: 'Refund Policy',
    content: 'Our refund policy allows for full refunds within 30 days of purchase. To request a refund, contact our support team with your order number and reason for the refund. Refunds are typically processed within 5-7 business days.',
    category: 'Billing',
    tags: ['refund', 'billing', 'policy'],
  },
  {
    title: 'System Requirements',
    content: 'Our application requires Windows 10 or later, macOS 10.15 or later, or Ubuntu 20.04 or later. Minimum 4GB RAM and 2GB free disk space are required. A stable internet connection is necessary for full functionality.',
    category: 'Technical',
    tags: ['system', 'requirements', 'technical'],
  },
  {
    title: 'Contact Support',
    content: 'You can contact our support team through the chat widget on our website, by email at support@example.com, or by phone at +1-555-0123. Our support hours are Monday to Friday, 9 AM to 6 PM EST.',
    category: 'Support',
    tags: ['support', 'contact', 'help'],
  },
];

async function seedArticles() {
  try {
    // Delete existing articles
    await prisma.knowledgeArticle.deleteMany();

    // Create new articles
    const createdArticles = await Promise.all(
      sampleArticles.map((article) =>
        prisma.knowledgeArticle.create({
          data: article,
        })
      )
    );

    logger.info(`Created ${createdArticles.length} sample articles`);
  } catch (error) {
    logger.error('Failed to seed articles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedArticles().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
}); 