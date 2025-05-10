import { useState } from 'react';
import { useContacts, type Contact } from '../hooks/useContacts';
import { Icons } from '../components/icons';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';
import { Skeleton } from '../components/ui/skeleton';

// Using Contact type from useContacts hook

// Example data for development - will be replaced by real data from Supabase
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Corp',
    email: 'john.smith@techcorp.com',
    phone: '+1 234 567 8901',
    position: 'CEO',
    accountType: 'B2B',
    status: 'active',
    tags: [],
    notes: [],
    lastContact: new Date('2023-12-01T00:00:00.000Z'),
    createdAt: new Date('2022-01-01T00:00:00.000Z'),
    updatedAt: new Date('2022-01-01T00:00:00.000Z'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Marketing Inc',
    email: 'sarah.j@marketing.com',
    phone: '+1 345 678 9012',
    position: 'Marketing Manager',
    accountType: 'B2C',
    status: 'lead',
    tags: [],
    notes: [],
    lastContact: new Date('2023-11-15T00:00:00.000Z'),
    createdAt: new Date('2022-01-01T00:00:00.000Z'),
    updatedAt: new Date('2022-01-01T00:00:00.000Z'),
  },
  {
    id: '3',
    name: 'Jane Doe',
    company: 'Finance Ltd',
    email: 'jane.doe@financeltd.com',
    phone: '+1 456 789 0123',
    position: 'CFO',
    accountType: 'B2B',
    status: 'inactive',
    tags: [],
    notes: [],
    lastContact: new Date('2023-10-01T00:00:00.000Z'),
    createdAt: new Date('2022-01-01T00:00:00.000Z'),
    updatedAt: new Date('2022-01-01T00:00:00.000Z'),
  },
];

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const { contacts, isLoading, error, addContact, updateContact, deleteContact } = useContacts();
  const [newContact, setNewContact] = useState<Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'lastContact'>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    accountType: 'B2B',
    status: 'lead',
    tags: [],
    notes: [],
  });

  const handleAddContact = async () => {
    try {
      await addContact(newContact);
      setIsAddingContact(false);
      toast.success('Contact added successfully');
    } catch (error) {
      toast.error('Failed to add contact');
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteContact(id);
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const filteredContacts = filterContacts({ status: selectedStatus as Contact['status'], accountType: selectedType as Contact['accountType'] })
    .filter(contact => searchContacts(searchQuery).includes(contact));

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              {error.message || 'An error occurred while loading contacts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <Icons.reset className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 flex flex-col gap-4 border-b border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Icons.import className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Icons.export className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setIsAddingContact(true)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search contacts by name, email, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icons.search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="B2B">B2B</SelectItem>
              <SelectItem value="B2C">B2C</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Icons.filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Contacts</p>
                    <p className="text-2xl font-semibold mt-1">{contacts.length}</p>
                  </div>
                  <div className="rounded-full bg-blue-50 p-3">
                    <Icons.users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Contacts</p>
                    <p className="text-2xl font-semibold mt-1">
                      {contacts.filter((c) => c.status === 'active').length}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-50 p-3">
                    <Icons.userCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">New Leads</p>
                    <p className="text-2xl font-semibold mt-1">
                      {contacts.filter((c) => c.status === 'lead').length}
                    </p>
                  </div>
                  <div className="rounded-full bg-yellow-50 p-3">
                    <Icons.target className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Inactive</p>
                    <p className="text-2xl font-semibold mt-1">
                      {contacts.filter((c) => c.status === 'inactive').length}
                    </p>
                  </div>
                  <div className="rounded-full bg-red-50 p-3">
                    <Icons.userX className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-[140px]" />
                <Skeleton className="h-9 w-[140px]" />
              </div>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{filteredContacts.length} contacts</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Icons.columns className="mr-2 h-4 w-4" />
                  Columns
                </Button>
                <Select>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Bulk actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tag">Add tags</SelectItem>
                    <SelectItem value="status">Update status</SelectItem>
                    <SelectItem value="delete">Delete selected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] pr-0">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          onChange={() => {}}
                        />
                      </div>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className="group hover:bg-gray-50"
                    >
                      <TableCell className="pr-0">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            onChange={() => {}}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0">
                            <img
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`}
                              alt={contact.name}
                              className="rounded-full ring-2 ring-white"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-medium text-gray-900">{contact.name}</div>
                            <div className="truncate text-sm text-gray-500">{contact.position || 'No position'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>
                        <Badge
                          variant={contact.accountType === 'B2B' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {contact.accountType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={{
                            active: 'success',
                            inactive: 'destructive',
                            lead: 'warning',
                          }[contact.status] as any}
                          className="capitalize"
                        >
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {contact.lastContact
                          ? new Date(contact.lastContact).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Icons.more className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                // TODO: Implement edit contact
                                toast.info('Edit contact coming soon');
                              }}
                            >
                              <Icons.edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Icons.trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
