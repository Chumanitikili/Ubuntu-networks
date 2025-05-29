import { Metadata } from 'next';
import CallCenter from '@/components/call-center/CallCenter';

export const metadata: Metadata = {
  title: 'Call Center | AI Assistant',
  description: 'Manage and handle incoming calls with AI assistance',
};

export default function CallCenterPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Call Center</h1>
      <CallCenter />
    </main>
  );
} 