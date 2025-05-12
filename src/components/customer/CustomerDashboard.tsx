import React, { useState, useEffect } from 'react';
import { supabase, getOrganizationClient } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { CallHandler } from '../call-center/CallHandler';

type Organization = Database['public']['Tables']['organizations']['Row'];
type User = Database['public']['Tables']['users']['Row'];

interface CustomerDashboardProps {
  organizationId: string;
  userId: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  organizationId,
  userId
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [licenseStatus, setLicenseStatus] = useState<'active' | 'expired' | 'pending'>('pending');
  const [showLicenseWarning, setShowLicenseWarning] = useState(false);

  useEffect(() => {
    fetchOrganizationData();
    checkLicenseStatus();
  }, [organizationId]);

  const fetchOrganizationData = async () => {
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError) {
      console.error('Error fetching organization:', orgError);
      return;
    }

    setOrganization(orgData);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }

    setUser(userData);
  };

  const checkLicenseStatus = () => {
    if (!organization) return;

    const now = new Date();
    const endDate = new Date(organization.license_end_date);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      setLicenseStatus('expired');
      setShowLicenseWarning(true);
    } else if (daysUntilExpiry <= 7) {
      setLicenseStatus('pending');
      setShowLicenseWarning(true);
    } else {
      setLicenseStatus('active');
      setShowLicenseWarning(false);
    }
  };

  if (!organization || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="customer-dashboard">
      {showLicenseWarning && (
        <div className="license-warning">
          <h3>License {licenseStatus === 'expired' ? 'Expired' : 'Expiring Soon'}</h3>
          <p>
            {licenseStatus === 'expired'
              ? 'Your license has expired. Please contact your administrator to renew.'
              : 'Your license will expire soon. Please contact your administrator to renew.'}
          </p>
        </div>
      )}

      <div className="header">
        <h1>{organization.name} Dashboard</h1>
        <div className="user-info">
          <p>Welcome, {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      </div>

      <div className="content">
        <div className="license-info">
          <h2>License Information</h2>
          <p>Status: {licenseStatus}</p>
          <p>Expires: {new Date(organization.license_end_date).toLocaleDateString()}</p>
        </div>

        <div className="features">
          <h2>Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Call Center</h3>
              <CallHandler
                callerType="B2B"
                onCallEnd={(callData) => console.log('Call ended:', callData)}
              />
            </div>

            <div className="feature-card">
              <h3>Analytics</h3>
              {/* Add analytics component */}
            </div>

            <div className="feature-card">
              <h3>User Management</h3>
              {/* Add user management component */}
            </div>

            <div className="feature-card">
              <h3>Settings</h3>
              {/* Add settings component */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 