import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type ContactRow = Database['public']['Tables']['contacts']['Row'];
export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status: 'active' | 'inactive' | 'lead';
  accountType: 'B2B' | 'B2C';
  lastContact?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes: string[];
};

type ContactResponse<T> = {
  data: T | null;
  error: Error | null;
};

type DatabaseContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status: 'active' | 'inactive' | 'lead';
  accountType: 'B2B' | 'B2C';
  lastContact?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string[];
};

interface UseContactsReturn {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastContact'>) => Promise<ContactResponse<Contact>>;
  updateContact: (id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>) => Promise<ContactResponse<Contact>>;
  deleteContact: (id: string) => Promise<ContactResponse<void>>;
  searchContacts: (query: string) => Contact[];
  filterContacts: (filters: { status?: Contact['status']; accountType?: Contact['accountType'] }) => Contact[];
  isLoading: boolean;
  error: Error | null;
}

export function useContacts(): UseContactsReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const convertDatabaseContactToContact = (dbContact: DatabaseContact): Contact => ({
    ...dbContact,
    lastContact: dbContact.lastContact ? new Date(dbContact.lastContact) : undefined,
    createdAt: new Date(dbContact.createdAt),
    updatedAt: new Date(dbContact.updatedAt),
  });

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      setContacts(
        (data || []).map((contact: DatabaseContact) => convertDatabaseContactToContact(contact))
      );
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const addContact = async (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastContact'>
  ): Promise<ContactResponse<Contact>> => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase.from('contacts').insert([
        {
          ...contact,
          createdAt: now,
          updatedAt: now,
        },
      ]);

      if (error) throw error;

      if (data && data[0]) {
        const newContact = convertDatabaseContactToContact(data[0] as DatabaseContact);
        setContacts((prev) => [newContact, ...prev]);
        return { data: newContact, error: null };
      }

      return { data: null, error: new Error('No data returned from insert') };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const updateContact = async (
    id: string,
    updates: Partial<Omit<Contact, 'id' | 'createdAt'>>
  ): Promise<ContactResponse<Contact>> => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('contacts')
        .update({
          ...updates,
          updatedAt: now,
        })
        .eq('id', id);

      if (error) throw error;

      if (data && data[0]) {
        const updatedContact = convertDatabaseContactToContact(data[0] as DatabaseContact);
        setContacts((prev) =>
          prev.map((contact) => (contact.id === id ? updatedContact : contact))
        );
        return { data: updatedContact, error: null };
      }

      return { data: null, error: new Error('No data returned from update') };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const deleteContact = async (id: string): Promise<ContactResponse<void>> => {
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);

      if (error) throw error;

      setContacts((prev) => prev.filter((contact) => contact.id !== id));
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const filterContacts = ({
    status,
    accountType,
  }: {
    status?: Contact['status'];
    accountType?: Contact['accountType'];
  }) => {
    return contacts.filter((contact) => {
      if (status && contact.status !== status) return false;
      if (accountType && contact.accountType !== accountType) return false;
      return true;
    });
  };

  const searchContacts = (query: string) => {
    if (!query) return contacts;
    const lowerCaseQuery = query.toLowerCase();
    return contacts.filter((contact) => {
      return (
        contact.name.toLowerCase().includes(lowerCaseQuery) ||
        contact.email.toLowerCase().includes(lowerCaseQuery) ||
        contact.phone.toLowerCase().includes(lowerCaseQuery) ||
        contact.company?.toLowerCase().includes(lowerCaseQuery) ||
        contact.position?.toLowerCase().includes(lowerCaseQuery)
      );
    });
  };

  return {
    contacts,
    isLoading,
    error,
    addContact,
    updateContact,
    deleteContact,
    filterContacts,
    searchContacts,
  };
}
