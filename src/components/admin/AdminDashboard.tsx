import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type Organization = Database['public']['Tables']['organizations']['Row'];
type User = Database['public']['Tables']['users']['Row'];

export const AdminDashboard: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [users, setUsers] = useState<User[]>([]);
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

  const fetchOrganizationUsers = async (orgId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', orgId);

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
  };

  const handleOrgSelect = async (org: Organization) => {
    setSelectedOrg(org);
    await fetchOrganizationUsers(org.id);
  };

  const handleLicenseUpdate = async (orgId: string, newEndDate: string) => {
    const { error } = await supabase
      .from('organizations')
      .update({ license_end_date: newEndDate })
      .eq('id', orgId);

    if (error) {
      console.error('Error updating license:', error);
      return;
    }

    fetchOrganizations();
  };

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="content">
        <div className="organizations-list">
          <h2>Organizations</h2>
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

        {selectedOrg && (
          <div className="org-details">
            <h2>Organization Details</h2>
            <div className="details-content">
              <h3>{selectedOrg.name}</h3>
              <p>Created: {new Date(selectedOrg.created_at).toLocaleDateString()}</p>
              <p>License ends: {new Date(selectedOrg.license_end_date).toLocaleDateString()}</p>
              <p>Max users: {selectedOrg.max_users}</p>
              
              <div className="license-management">
                <h4>License Management</h4>
                <input
                  type="date"
                  onChange={(e) => handleLicenseUpdate(selectedOrg.id, e.target.value)}
                />
              </div>

              <div className="users-list">
                <h4>Users</h4>
                {users.map(user => (
                  <div key={user.id} className="user-item">
                    <p>{user.email}</p>
                    <p>Role: {user.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 