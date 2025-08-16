'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpDown, Plus, Search, Users, UserPlus, Filter, X, Eye, Mail, MapPin, Shield, Edit, Trash2, Save } from 'lucide-react';
import { Z_CLASSES } from '@/lib/z-index';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: 'admin' | 'user' | 'store_owner';
  created_at: string;
}

interface NewUser {
  name: string;
  email: string;
  password: string;
  address: string;
  role: 'admin' | 'user' | 'store_owner';
}

interface ValidationError {
  path: (string | number)[];
  message: string;
  code: string;
}

interface EditUser {
  id: number;
  name: string;
  email: string;
  address: string;
  role: 'admin' | 'user' | 'store_owner';
  password?: string;
}

export function EnhancedUserManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [editingUser, setEditingUser] = useState<EditUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Form state
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
        params.append('field', searchField);
      }
      if (roleFilter && roleFilter !== 'all') {
        params.append('role', roleFilter);
      }
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setError(null);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, searchTerm, searchField, roleFilter, sortBy, sortOrder]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loadingToastId = enhancedToast.loading('Creating new user...');
    
    try {
      setCreateLoading(true);
      setError(null); // Clear any previous errors
      setValidationErrors([]); // Clear validation errors
      
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      
      enhancedToast.dismiss(loadingToastId);
      
      if (response.ok) {
        const data = await response.json();
        enhancedToast.success(`User "${newUser.name}" created successfully!`);
        setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
        setShowCreateForm(false);
        fetchUsers(); // Refresh the list
      } else {
        const data = await response.json();
        if (data.errors && Array.isArray(data.errors)) {
          // Handle detailed validation errors
          setValidationErrors(data.errors);
          const fieldErrors = data.errors.map((err: ValidationError) => `${err.path.join('.')}: ${err.message}`).join(', ');
          enhancedToast.error(`Validation errors: ${fieldErrors}`);
        } else {
          enhancedToast.error(data.message || 'Failed to create user');
          setError(data.message || 'Failed to create user');
        }
      }
    } catch (error) {
      enhancedToast.dismiss(loadingToastId);
      enhancedToast.error('Network error occurred');
      setError('Network error occurred');
    } finally {
      setCreateLoading(false);
    }
  };

  // Helper function to get validation error for a specific field
  const getFieldError = (fieldName: string) => {
    return validationErrors.find(err => err.path.includes(fieldName))?.message;
  };

  const handleEditUser = (user: User) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      password: ''
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    const loadingToastId = enhancedToast.loading('Updating user...');
    
    try {
      setEditLoading(true);
      setError(null);
      
      const updateData: {name: string; email: string; address: string; role: string; password?: string} = {
        name: editingUser.name,
        email: editingUser.email,
        address: editingUser.address,
        role: editingUser.role
      };
      
      // Only include password if it's provided
      if (editingUser.password && editingUser.password.trim()) {
        updateData.password = editingUser.password;
      }
      
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      enhancedToast.dismiss(loadingToastId);

      if (response.ok) {
        const data = await response.json();
        enhancedToast.success(`User "${editingUser.name}" updated successfully!`);
        setEditingUser(null);
        setShowEditModal(false);
        fetchUsers(); // Refresh the list
      } else {
        const data = await response.json();
        enhancedToast.error(data.message || 'Failed to update user');
        setError(data.message || 'Failed to update user');
      }
    } catch (error) {
      enhancedToast.dismiss(loadingToastId);
      enhancedToast.error('Network error occurred');
      setError('Network error occurred');
      console.error('Update user error:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const loadingToastId = enhancedToast.loading('Deleting user...');
    
    try {
      setDeleteLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      enhancedToast.dismiss(loadingToastId);

      if (response.ok) {
        enhancedToast.success(`User "${user.name}" deleted successfully!`);
        setShowDeleteConfirm(null);
        fetchUsers(); // Refresh the list
      } else {
        const data = await response.json();
        enhancedToast.error(data.message || 'Failed to delete user');
        setError(data.message || 'Failed to delete user');
      }
    } catch (error) {
      enhancedToast.dismiss(loadingToastId);
      enhancedToast.error('Network error occurred');
      setError('Network error occurred');
      console.error('Delete user error:', error);
    } finally {
      setDeleteLoading(false);
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

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
      store_owner: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      user: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    };
    return badges[role as keyof typeof badges] || badges.user;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'store_owner': return <Users className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setSearchField('name');
  };

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    storeOwners: users.filter(u => u.role === 'store_owner').length,
    regularUsers: users.filter(u => u.role === 'user').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-4">
            User Management
          </h1>
          <p className="text-xl text-gray-300">Manage platform users and their roles</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatedCard delay={0.1} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(userStats.total)}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 text-sm font-medium">Administrators</p>
                  <p className="text-3xl font-bold text-white">{userStats.admins}</p>
                </div>
                <Shield className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Store Owners</p>
                  <p className="text-3xl font-bold text-white">{userStats.storeOwners}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Regular Users</p>
                  <p className="text-3xl font-bold text-white">{userStats.regularUsers}</p>
                </div>
                <Eye className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Add User Button */}
        <div className="flex justify-center">
          <BackgroundGradient className="rounded-[22px] p-1">
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-black border-none text-white px-8 py-6 text-lg"
            >
              <Plus className="h-5 w-5 mr-3" />
              Add New User
            </Button>
          </BackgroundGradient>
        </div>

        {/* Create User Form */}
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
                      <UserPlus className="h-5 w-5 mr-2" />
                      Add New User
                    </CardTitle>
                    <CardDescription className="text-gray-400">Create a new user account with specified role</CardDescription>
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
                <form onSubmit={handleCreateUser} className={`space-y-6 relative ${Z_CLASSES.modalContent} pointer-events-auto`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Name (3-60 characters)</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        placeholder="Enter full name"
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
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="user@example.com"
                        required
                        className={`bg-white/10 border-white/20 text-white placeholder-gray-400 relative ${Z_CLASSES.input} pointer-events-auto ${getFieldError('email') ? 'border-red-500/50' : ''}`}
                      />
                      {getFieldError('email') && (
                        <p className="text-red-400 text-sm mt-1">{getFieldError('email')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password (8-16 chars, uppercase + special)</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="Password123!"
                        required
                        minLength={8}
                        maxLength={16}
                        className={`bg-white/10 border-white/20 text-white placeholder-gray-400 relative ${Z_CLASSES.input} pointer-events-auto ${getFieldError('password') ? 'border-red-500/50' : ''}`}
                      />
                      {getFieldError('password') && (
                        <p className="text-red-400 text-sm mt-1">{getFieldError('password')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-white">Role</Label>
                      <Select value={newUser.role} onValueChange={(value: 'admin' | 'user' | 'store_owner') => setNewUser({...newUser, role: value})}>
                        <SelectTrigger className={`bg-white/10 border-white/20 text-white relative ${Z_CLASSES.select} pointer-events-auto`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={`bg-gray-900 border-gray-700 ${Z_CLASSES.dropdown}`}>
                          <SelectItem value="user" className="text-white hover:bg-gray-800">Regular User</SelectItem>
                          <SelectItem value="store_owner" className="text-white hover:bg-gray-800">Store Owner</SelectItem>
                          <SelectItem value="admin" className="text-white hover:bg-gray-800">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">Address (max 400 characters)</Label>
                    <Input
                      id="address"
                      value={newUser.address}
                      onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                      placeholder="Enter full address"
                      required
                      maxLength={400}
                      className={`bg-white/10 border-white/20 text-white placeholder-gray-400 relative ${Z_CLASSES.input} ${getFieldError('address') ? 'border-red-500/50' : ''}`}
                    />
                    {getFieldError('address') && (
                      <p className="text-red-400 text-sm mt-1">{getFieldError('address')}</p>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      type="submit" 
                      disabled={createLoading}
                      className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none relative ${Z_CLASSES.button}`}
                    >
                      {createLoading ? 'Creating...' : 'Create User'}
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
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-white">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search users..."
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
              <div className="space-y-2">
                <Label htmlFor="roleFilter" className="text-white">Filter by Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className={`bg-white/10 border-white/20 text-white relative ${Z_CLASSES.select}`}>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent className={`bg-gray-900 border-gray-700 ${Z_CLASSES.dropdown}`}>
                    <SelectItem value="all" className="text-white hover:bg-gray-800">All Roles</SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-gray-800">Administrator</SelectItem>
                    <SelectItem value="user" className="text-white hover:bg-gray-800">Regular User</SelectItem>
                    <SelectItem value="store_owner" className="text-white hover:bg-gray-800">Store Owner</SelectItem>
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

        {/* Users Table */}
        <AnimatedCard className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Users ({users.length})</CardTitle>
            <CardDescription className="text-gray-400">All registered users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/20 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-400 rounded-full" />
                <p className="text-gray-400 mt-4">Loading users...</p>
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
                          className="h-auto p-0 font-semibold text-white hover:text-blue-400"
                        >
                          Name <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('email')} 
                          className="h-auto p-0 font-semibold text-white hover:text-blue-400"
                        >
                          Email <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('address')} 
                          className="h-auto p-0 font-semibold text-white hover:text-blue-400"
                        >
                          Address <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('role')} 
                          className="h-auto p-0 font-semibold text-white hover:text-blue-400"
                        >
                          Role <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('created_at')} 
                          className="h-auto p-0 font-semibold text-white hover:text-blue-400"
                        >
                          Created <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-white font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-xs truncate">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{user.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1">{user.role.replace('_', ' ')}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(user)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <Users className="h-12 w-12 text-gray-500" />
                            <p className="text-gray-500 text-lg">No users found</p>
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

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center ${Z_CLASSES.modal} p-4`}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Edit className="h-5 w-5 mr-2" />
                    Edit User
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-white">Name</Label>
                    <Input
                      id="edit-name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      placeholder="Enter full name"
                      required
                      minLength={3}
                      maxLength={60}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email" className="text-white">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      placeholder="user@example.com"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-address" className="text-white">Address</Label>
                    <Input
                      id="edit-address"
                      value={editingUser.address}
                      onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                      placeholder="Enter address"
                      required
                      maxLength={400}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role" className="text-white">Role</Label>
                    <Select value={editingUser.role} onValueChange={(value: 'admin' | 'user' | 'store_owner') => setEditingUser({...editingUser, role: value})}>
                      <SelectTrigger className={`bg-white/10 border-white/20 text-white relative ${Z_CLASSES.select}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={`bg-gray-900 border-gray-700 ${Z_CLASSES.dropdown}`}>
                        <SelectItem value="admin" className="text-white hover:bg-gray-800">Admin</SelectItem>
                        <SelectItem value="user" className="text-white hover:bg-gray-800">User</SelectItem>
                        <SelectItem value="store_owner" className="text-white hover:bg-gray-800">Store Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-password" className="text-white">New Password (optional)</Label>
                    <Input
                      id="edit-password"
                      type="password"
                      value={editingUser.password || ''}
                      onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                      placeholder="Leave empty to keep current password"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-400">Leave empty to keep current password</p>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="submit" 
                      disabled={editLoading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editLoading ? 'Updating...' : 'Update User'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowEditModal(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center ${Z_CLASSES.modal} p-4`}
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/80 backdrop-blur-sm border border-red-500/20 rounded-xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-red-400 flex items-center">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete User
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteConfirm(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 mb-4">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {showDeleteConfirm.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{showDeleteConfirm.name}</p>
                        <p className="text-sm text-gray-400">{showDeleteConfirm.email}</p>
                        <p className="text-sm text-gray-400 capitalize">{showDeleteConfirm.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={() => handleDeleteUser(showDeleteConfirm)}
                    disabled={deleteLoading}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteLoading ? 'Deleting...' : 'Delete User'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(null)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}