import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Organization = Database['public']['Tables']['organizations']['Row'];
type License = Database['public']['Tables']['licenses']['Row'];

export class LicenseService {
  static async checkLicenseStatus(organizationId: string): Promise<{
    status: 'active' | 'expired' | 'pending';
    daysUntilExpiry: number;
  }> {
    const { data: org, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (error) throw error;

    const now = new Date();
    const endDate = new Date(org.license_end_date);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'active' | 'expired' | 'pending' = 'active';
    if (daysUntilExpiry <= 0) {
      status = 'expired';
    } else if (daysUntilExpiry <= 7) {
      status = 'pending';
    }

    return { status, daysUntilExpiry };
  }

  static async sendLicenseNotification(organizationId: string): Promise<void> {
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError) throw orgError;

    const { data: admin, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('role', 'admin')
      .single();

    if (adminError) throw adminError;

    const { status, daysUntilExpiry } = await this.checkLicenseStatus(organizationId);

    // Send email notification
    const subject = status === 'expired'
      ? 'License Expired'
      : 'License Expiring Soon';

    const message = status === 'expired'
      ? `Your license for ${org.name} has expired. Please renew to continue using the service.`
      : `Your license for ${org.name} will expire in ${daysUntilExpiry} days. Please renew to avoid service interruption.`;

    // TODO: Implement email sending service
    console.log('Sending email to:', admin.email, 'Subject:', subject, 'Message:', message);
  }

  static async createPOCLicense(organizationId: string): Promise<void> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90); // 90-day POC

    const { error } = await supabase
      .from('organizations')
      .update({
        license_start_date: startDate.toISOString(),
        license_end_date: endDate.toISOString(),
        is_active: true
      })
      .eq('id', organizationId);

    if (error) throw error;

    // Create license record
    const { error: licenseError } = await supabase
      .from('licenses')
      .insert({
        organization_id: organizationId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
        payment_status: 'pending'
      });

    if (licenseError) throw licenseError;
  }

  static async deactivateExpiredLicenses(): Promise<void> {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('organizations')
      .update({ is_active: false })
      .lt('license_end_date', now)
      .eq('is_active', true);

    if (error) throw error;
  }

  static async scheduleLicenseChecks(): Promise<void> {
    // Run daily license checks
    setInterval(async () => {
      try {
        await this.deactivateExpiredLicenses();

        // Get all active organizations
        const { data: orgs, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        // Check each organization's license
        for (const org of orgs) {
          const { status, daysUntilExpiry } = await this.checkLicenseStatus(org.id);
          
          if (status === 'expired' || status === 'pending') {
            await this.sendLicenseNotification(org.id);
          }
        }
      } catch (error) {
        console.error('Error in license check:', error);
      }
    }, 24 * 60 * 60 * 1000); // Run every 24 hours
  }
} 