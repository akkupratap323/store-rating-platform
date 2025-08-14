'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Store Rating Platform</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                {user.role.replace('_', ' ')}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {user.role === 'admin' ? 'System Administrator Dashboard' : 
               user.role === 'store_owner' ? 'Store Owner Dashboard' : 
               'User Dashboard'}
            </h2>
            <p className="text-gray-600">
              {user.role === 'admin' ? 'Manage users, stores, and platform statistics' :
               user.role === 'store_owner' ? 'View your store analytics and customer ratings' :
               'Browse stores and submit ratings'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.role === 'admin' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Manage Stores</CardTitle>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Statistics</CardTitle>
                    <CardDescription>View platform metrics and analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Users:</span>
                        <span className="text-sm font-semibold">Loading...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Stores:</span>
                        <span className="text-sm font-semibold">Loading...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Ratings:</span>
                        <span className="text-sm font-semibold">Loading...</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {user.role === 'user' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Browse Stores</CardTitle>
                    <CardDescription>Find and rate stores in your area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Search for stores by name and address, view details and submit ratings.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => router.push('/dashboard/user/stores')}
                    >
                      Browse Stores
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>My Ratings</CardTitle>
                    <CardDescription>View and manage your submitted ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      See all your submitted ratings and modify them if needed.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => router.push('/dashboard/user/ratings')}
                    >
                      View My Ratings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Update Password</CardTitle>
                    <CardDescription>Change your account password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Update your password for security purposes.
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => router.push('/dashboard/user/profile')}
                    >
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {user.role === 'store_owner' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>My Stores</CardTitle>
                    <CardDescription>View your owned stores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      View all stores you own and their performance metrics.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => router.push('/dashboard/store-owner/stores')}
                    >
                      View My Stores
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Ratings</CardTitle>
                    <CardDescription>View customer feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      See all ratings and feedback from customers for your stores.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => router.push('/dashboard/store-owner/analytics')}
                    >
                      View Ratings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Store Analytics</CardTitle>
                    <CardDescription>View store performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Rating:</span>
                        <span className="text-sm font-semibold">Loading...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Ratings:</span>
                        <span className="text-sm font-semibold">Loading...</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}