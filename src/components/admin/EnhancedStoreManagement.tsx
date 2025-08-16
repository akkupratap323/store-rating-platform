'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpDown, Plus, Search, Star, Store, Mail, MapPin, User, X, TrendingUp } from 'lucide-react';
import { Z_CLASSES } from '@/lib/z-index';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

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

interface ValidationError {
  path: (string | number)[];
  message: string;
  code: string;
}

export function EnhancedStoreManagement() {
  const { token } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
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
    
    const loadingToastId = enhancedToast.loading('Creating new store...');
    
    try {
      setCreateLoading(true);
      setError(null);
      setValidationErrors([]); // Clear validation errors
      
      const response = await fetch('/api/admin/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newStore),
      });

      enhancedToast.dismiss(loadingToastId);

      if (response.ok) {
        const data = await response.json();
        enhancedToast.success(`Store "${newStore.name}" created successfully!`);
        setNewStore({ name: '', email: '', address: '', ownerEmail: '' });
        setShowCreateForm(false);
        fetchStores(); // Refresh the list
      } else {
        const data = await response.json();
        if (data.errors && Array.isArray(data.errors)) {
          // Handle detailed validation errors
          setValidationErrors(data.errors);
          const fieldErrors = data.errors.map((err: ValidationError) => `${err.path.join('.')}: ${err.message}`).join(', ');
          enhancedToast.error(`Validation errors: ${fieldErrors}`);
        } else {
          enhancedToast.error(data.message || 'Failed to create store');
          setError(data.message || 'Failed to create store');
        }
      }
    } catch (error) {
      enhancedToast.dismiss(loadingToastId);
      enhancedToast.error('Network error occurred');
      setError('Network error occurred');
      console.error('Create store error:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  // Helper function to get validation error for a specific field
  const getFieldError = (fieldName: string) => {
    return validationErrors.find(err => err.path.includes(fieldName))?.message;
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

  const clearFilters = () => {
    setSearchTerm('');
    setSearchField('name');
  };

  const storeStats = {
    total: stores.length,
    highRated: stores.filter(s => parseFloat(s.average_rating) >= 4.0).length,
    withOwners: stores.filter(s => s.owner_name).length,
    averageRating: stores.length > 0 ? (stores.reduce((sum, store) => sum + parseFloat(store.average_rating), 0) / stores.length).toFixed(1) : '0.0'
  };

  const getRatingColor = (rating: string) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return 'text-emerald-400';
    if (num >= 4.0) return 'text-blue-400';
    if (num >= 3.0) return 'text-yellow-400';
    if (num >= 2.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRatingBadge = (rating: string, totalRatings: number) => {
    const numRating = parseFloat(rating);
    let bgColor = 'bg-gray-500/20';
    let textColor = 'text-gray-400';
    
    if (numRating >= 4.5) {
      bgColor = 'bg-emerald-500/20';
      textColor = 'text-emerald-400';
    } else if (numRating >= 4.0) {
      bgColor = 'bg-blue-500/20';
      textColor = 'text-blue-400';
    } else if (numRating >= 3.0) {
      bgColor = 'bg-yellow-500/20';
      textColor = 'text-yellow-400';
    } else if (numRating >= 2.0) {
      bgColor = 'bg-orange-500/20';
      textColor = 'text-orange-400';
    } else if (numRating > 0) {
      bgColor = 'bg-red-500/20';
      textColor = 'text-red-400';
    }

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full ${bgColor}`}>
        <Star className={`h-4 w-4 ${textColor} fill-current mr-1`} />
        <span className={`text-sm font-medium ${textColor}`}>
          {rating} ({totalRatings})
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Store Management
          </h1>
          <p className="text-xl text-gray-300">Manage platform stores and their performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatedCard delay={0.1} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Total Stores</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(storeStats.total)}</p>
                </div>
                <Store className="h-8 w-8 text-green-400" />
              </div>
              <Progress value={100} className="mt-3 h-2" />
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">High Rated (4.0+)</p>
                  <p className="text-3xl font-bold text-white">{storeStats.highRated}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <Progress value={(storeStats.highRated / storeStats.total) * 100} className="mt-3 h-2" />
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">With Owners</p>
                  <p className="text-3xl font-bold text-white">{storeStats.withOwners}</p>
                </div>
                <User className="h-8 w-8 text-blue-400" />
              </div>
              <Progress value={(storeStats.withOwners / storeStats.total) * 100} className="mt-3 h-2" />
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Avg Rating</p>
                  <p className="text-3xl font-bold text-white">{storeStats.averageRating}⭐</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
              <Progress value={parseFloat(storeStats.averageRating) * 20} className="mt-3 h-2" />
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Add Store Button */}
        <div className="flex justify-center">
          <BackgroundGradient className="rounded-[22px] p-1">
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-black border-none text-white px-8 py-6 text-lg"
            >
              <Plus className="h-5 w-5 mr-3" />
              Add New Store
            </Button>
          </BackgroundGradient>
        </div>

        {/* Create Store Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`relative ${Z_CLASSES.modalContent}`}
          >
            <AnimatedCard className={`bg-black/40 border-white/10 relative ${Z_CLASSES.modalContent}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Store className="h-5 w-5 mr-2" />
                      Add New Store
                    </CardTitle>
                    <CardDescription className="text-gray-400">Create a new store listing on the platform</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {validationErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/20 rounded-lg">
                    <h4 className="text-red-400 font-medium mb-2">Please fix the following errors:</h4>
                    <ul className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-red-300 text-sm">
                          <strong>{error.path.join('.')}:</strong> {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <form onSubmit={handleCreateStore} className={`space-y-6 relative ${Z_CLASSES.modalContent} pointer-events-auto`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Store Name (3-60 characters)</Label>
                      <Input
                        id="name"
                        value={newStore.name}
                        onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                        placeholder="Enter store name"
                        required
                        minLength={3}
                        maxLength={60}
                        className={`bg-white/10 border-white/20 text-white placeholder-gray-400 relative ${Z_CLASSES.input} pointer-events-auto ${getFieldError('name') ? 'border-red-500/50' : ''}`}
                      />
                      {getFieldError('name') && (
                        <p className="text-red-400 text-sm mt-1">{getFieldError('name')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Store Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStore.email}
                        onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                        placeholder="store@example.com"
                        required
                        className={`bg-white/10 border-white/20 text-white placeholder-gray-400 relative ${Z_CLASSES.input} pointer-events-auto ${getFieldError('email') ? 'border-red-500/50' : ''}`}
                      />
                      {getFieldError('email') && (
                        <p className="text-red-400 text-sm mt-1">{getFieldError('email')}</p>
                      )}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address" className="text-white">Address (max 400 characters)</Label>
                      <Input
                        id="address"
                        value={newStore.address}
                        onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                        placeholder="Enter store address"
                        required
                        maxLength={400}
                        className={`bg-white/10 border-white/20 text-white placeholder-gray-400 relative ${Z_CLASSES.input} pointer-events-auto ${getFieldError('address') ? 'border-red-500/50' : ''}`}
                      />
                      {getFieldError('address') && (
                        <p className="text-red-400 text-sm mt-1">{getFieldError('address')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerEmail" className="text-white">Owner Email (optional)</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={newStore.ownerEmail}
                        onChange={(e) => setNewStore({...newStore, ownerEmail: e.target.value})}
                        placeholder="owner@example.com"
                        className={`bg-white/10 border-white/20 text-white placeholder-gray-400 relative ${Z_CLASSES.input} pointer-events-auto ${getFieldError('ownerEmail') ? 'border-red-500/50' : ''}`}
                      />
                      {getFieldError('ownerEmail') && (
                        <p className="text-red-400 text-sm mt-1">{getFieldError('ownerEmail')}</p>
                      )}
                      <p className="text-xs text-gray-400">Email of existing store owner user</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      type="submit" 
                      disabled={createLoading}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none"
                    >
                      {createLoading ? 'Creating...' : 'Create Store'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </AnimatedCard>
          </motion.div>
        )}

        {/* Filters */}
        <AnimatedCard className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-white">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search stores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 relative ${Z_CLASSES.input}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchField" className="text-white">Search Field</Label>
                <Select value={searchField} onValueChange={setSearchField}>
                  <SelectTrigger className={`bg-white/10 border-white/20 text-white relative ${Z_CLASSES.select}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`bg-gray-900 border-gray-700 ${Z_CLASSES.dropdown}`}>
                    <SelectItem value="name" className="text-white hover:bg-gray-800">Name</SelectItem>
                    <SelectItem value="email" className="text-white hover:bg-gray-800">Email</SelectItem>
                    <SelectItem value="address" className="text-white hover:bg-gray-800">Address</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Stores Table */}
        <AnimatedCard className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Stores ({stores.length})</CardTitle>
            <CardDescription className="text-gray-400">All registered stores on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/20 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-green-400 rounded-full" />
                <p className="text-gray-400 mt-4">Loading stores...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('name')} 
                          className="h-auto p-0 font-semibold text-white hover:text-green-400"
                        >
                          Name <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('email')} 
                          className="h-auto p-0 font-semibold text-white hover:text-green-400"
                        >
                          Email <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('address')} 
                          className="h-auto p-0 font-semibold text-white hover:text-green-400"
                        >
                          Address <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('average_rating')} 
                          className="h-auto p-0 font-semibold text-white hover:text-green-400"
                        >
                          Rating <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-white font-semibold">Owner</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('created_at')} 
                          className="h-auto p-0 font-semibold text-white hover:text-green-400"
                        >
                          Created <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.map((store) => (
                      <TableRow key={store.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-bold">
                              {store.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{store.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{store.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-xs truncate">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{store.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRatingBadge(store.average_rating, store.total_ratings)}
                        </TableCell>
                        <TableCell>
                          {store.owner_name ? (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-blue-400" />
                              <span className="text-blue-400">{store.owner_name}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic text-sm">No owner assigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-300">{formatDate(store.created_at)}</TableCell>
                      </TableRow>
                    ))}
                    {stores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <Store className="h-12 w-12 text-gray-500" />
                            <p className="text-gray-500 text-lg">No stores found</p>
                            <p className="text-gray-600 text-sm">Try adjusting your search filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
}