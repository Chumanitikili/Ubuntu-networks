import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { AdminDashboard } from './AdminDashboard';
import { CustomerDashboard } from '../customer/CustomerDashboard';

type Organization = Database['public']['Tables']['organizations']['Row'];
type User = Database['public']['Tables']['users']['Row'];

export const SuperuserSwitch: React.FC = () => {
  const [view, setView] = useState<'admin' | 'customer'>('admin');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching organizations:', error);
      return;
    }

    setOrganizations(data || []);
  };

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrg(org);
    setView('customer');
  };

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="superuser-switch">
      <div className="header">
        <h1>Superuser Dashboard</h1>
        <div className="view-controls">
          <button
            className={view === 'admin' ? 'active' : ''}
            onClick={() => setView('admin')}
          >
            Admin View
          </button>
          <button
            className={view === 'customer' ? 'active' : ''}
            onClick={() => setView('customer')}
            disabled={!selectedOrg}
          >
            Customer View
          </button>
        </div>
      </div>

      {view === 'admin' ? (
        <div className="admin-section">
          <div className="org-search">
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="org-list">
            {filteredOrgs.map(org => (
              <div
                key={org.id}
                className={`org-item ${selectedOrg?.id === org.id ? 'selected' : ''}`}
                onClick={() => handleOrgSelect(org)}
              >
                <h3>{org.name}</h3>
                <p>License ends: {new Date(org.license_end_date).toLocaleDateString()}</p>
                <p>Status: {org.is_active ? 'Active' : 'Inactive'}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        selectedOrg && (
          <div className="customer-section">
            <div className="customer-header">
              <h2>Viewing as: {selectedOrg.name}</h2>
              <button onClick={() => setView('admin')}>Back to Admin View</button>
            </div>
            <CustomerDashboard
              organizationId={selectedOrg.id}
              userId="superuser" // This would be the superuser's ID
            />
          </div>
        )
      )}
    </div>
  );
}; 