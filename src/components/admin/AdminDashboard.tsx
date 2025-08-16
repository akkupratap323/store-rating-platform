'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Store, Star, BarChart3 } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  averageRating: string;
  recentUsers: number;
  recentRatings: number;
  usersByRole: {
    admin: number;
    user: number;
    store_owner: number;
  };
}

export function AdminDashboard() {
  const { token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('Failed to fetch dashboard stats');
        }
      } catch (error) {
        setError('Network error occurred');
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform statistics and recent activity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">...</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform statistics and recent activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
            <p className="text-xs text-muted-foreground">Registered stores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRatings}</div>
            <p className="text-xs text-muted-foreground">All submitted ratings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">Platform average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution by Role</CardTitle>
            <CardDescription>Breakdown of users by their assigned roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Administrators</span>
                <span className="font-semibold">{stats.usersByRole.admin || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Regular Users</span>
                <span className="font-semibold">{stats.usersByRole.user || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Store Owners</span>
                <span className="font-semibold">{stats.usersByRole.store_owner || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Activity in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">New Users</span>
                <span className="font-semibold">{stats.recentUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">New Ratings</span>
                <span className="font-semibold">{stats.recentRatings}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Options */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Management Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle>Manage Users</CardTitle>
              </div>
              <CardDescription>Add, view, and manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Add new users with different roles and view user listings with filters.
              </p>
              <Button 
                className="w-full" 
                onClick={() => router.push('/dashboard/admin/users')}
              >
                Go to User Management
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-green-600" />
                <CardTitle>Manage Stores</CardTitle>
              </div>
              <CardDescription>Add, view, and manage store listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Add new stores and view store details with ratings information.
              </p>
              <Button 
                className="w-full"
                onClick={() => router.push('/dashboard/admin/stores')}
              >
                Go to Store Management
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <CardTitle>All Ratings</CardTitle>
              </div>
              <CardDescription>View all platform ratings and reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Monitor all ratings submitted across the platform.
              </p>
              <Button 
                className="w-full"
                onClick={() => router.push('/dashboard/admin/ratings')}
              >
                View All Ratings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Add New User</CardTitle>
              <CardDescription className="text-blue-700">
                Quickly create a new user account with any role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push('/dashboard/admin/users')}
              >
                Create User Account
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Add New Store</CardTitle>
              <CardDescription className="text-green-700">
                Register a new store on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => router.push('/dashboard/admin/stores')}
              >
                Register Store
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}