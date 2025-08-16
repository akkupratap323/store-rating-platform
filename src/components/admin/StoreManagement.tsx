'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpDown, Plus, Search, Star } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  average_rating: string;
  total_ratings: number;
  owner_name?: string;
  created_at: string;
}

interface NewStore {
  name: string;
  email: string;
  address: string;
  ownerEmail?: string;
}

export function StoreManagement() {
  const { token } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Form state
  const [newStore, setNewStore] = useState<NewStore>({
    name: '',
    email: '',
    address: '',
    ownerEmail: ''
  });

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
        params.append('field', searchField);
      }
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/admin/stores?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStores(data.stores);
        setError(null);
      } else {
        setError('Failed to fetch stores');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Fetch stores error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStores();
    }
  }, [token, searchTerm, searchField, sortBy, sortOrder]);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const response = await fetch('/api/admin/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newStore),
      });

      if (response.ok) {
        setNewStore({ name: '', email: '', address: '', ownerEmail: '' });
        setShowCreateForm(false);
        fetchStores(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create store');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Create store error:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderRating = (rating: string, totalRatings: number) => {
    const numRating = parseFloat(rating);
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Star className={`h-4 w-4 ${numRating > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          <span className="ml-1 text-sm font-medium">{rating}</span>
        </div>
        <span className="text-xs text-gray-500">({totalRatings} reviews)</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600">Manage platform stores and their details</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Store
        </Button>
      </div>

      {/* Create Store Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Store</CardTitle>
            <CardDescription>Create a new store listing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Store Name (20-60 characters)</Label>
                  <Input
                    id="name"
                    value={newStore.name}
                    onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                    placeholder="Enter store name"
                    required
                    minLength={20}
                    maxLength={60}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Store Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStore.email}
                    onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                    placeholder="store@example.com"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address (max 400 characters)</Label>
                  <Input
                    id="address"
                    value={newStore.address}
                    onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                    placeholder="Enter store address"
                    required
                    maxLength={400}
                  />
                </div>
                <div>
                  <Label htmlFor="ownerEmail">Owner Email (optional)</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={newStore.ownerEmail}
                    onChange={(e) => setNewStore({...newStore, ownerEmail: e.target.value})}
                    placeholder="owner@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email of existing store owner user</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create Store'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="searchField">Search Field</Label>
              <Select value={searchField} onValueChange={setSearchField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="address">Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSearchField('name');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stores ({stores.length})</CardTitle>
          <CardDescription>All registered stores on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <p>Loading stores...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('name')} className="h-auto p-0 font-semibold">
                        Name <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('email')} className="h-auto p-0 font-semibold">
                        Email <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('address')} className="h-auto p-0 font-semibold">
                        Address <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('average_rating')} className="h-auto p-0 font-semibold">
                        Rating <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('created_at')} className="h-auto p-0 font-semibold">
                        Created <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{store.address}</TableCell>
                      <TableCell>
                        {renderRating(store.average_rating, store.total_ratings)}
                      </TableCell>
                      <TableCell>
                        {store.owner_name ? (
                          <span className="text-sm">{store.owner_name}</span>
                        ) : (
                          <span className="text-sm text-gray-500 italic">No owner</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(store.created_at)}</TableCell>
                    </TableRow>
                  ))}
                  {stores.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No stores found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}