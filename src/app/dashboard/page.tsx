'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Z_CLASSES } from '@/lib/z-index';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { 
  Users, 
  Store, 
  Star, 
  BarChart3, 
  Shield, 
  User,
  ArrowRight,
  TrendingUp,
  Award,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    } else {
      // Show welcome toast and redirect to appropriate dashboard
      setTimeout(() => {
        enhancedToast.info(`Welcome back, ${user.name}! 🎉`);
      }, 500);
      
      // Redirect all users to their enhanced dashboards
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
        return;
      }
      if (user.role === 'store_owner') {
        router.push('/dashboard/store-owner');
        return;
      }
      if (user.role === 'user') {
        router.push('/dashboard/user');
        return;
      }
      fetchStats();
    }
  }, [user, router]);

  const fetchStats = async () => {
    if (!token) return;

    try {
      let endpoint = '/api/admin/dashboard';
      if (user?.role === 'store_owner') {
        endpoint = '/api/store-owner/analytics';
      } else if (user?.role === 'user') {
        // For regular users, we can create a simple endpoint or just skip stats
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const handleLogout = () => {
    logout();
    enhancedToast.success('Successfully logged out. See you next time!');
    router.push('/auth/login');
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'admin': return <Shield className="h-8 w-8 text-red-400" />;
      case 'store_owner': return <Store className="h-8 w-8 text-blue-400" />;
      case 'user': return <User className="h-8 w-8 text-green-400" />;
      default: return <User className="h-8 w-8 text-gray-400" />;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'admin': return 'from-red-500/20 to-red-600/20 border-red-500/20';
      case 'store_owner': return 'from-blue-500/20 to-blue-600/20 border-blue-500/20';
      case 'user': return 'from-green-500/20 to-green-600/20 border-green-500/20';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Store Rating Platform
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user.name}</span>
              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full capitalize">
                {user.role.replace('_', ' ')}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="border-white/20 text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Meteors number={20} />
          
          {/* Welcome Section */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                {user.role === 'admin' ? 'System Administrator Dashboard' : 
                 user.role === 'store_owner' ? 'Store Owner Dashboard' : 
                 'User Dashboard'}
              </h2>
              <p className="text-xl text-gray-300">
                {user.role === 'admin' ? 'Manage users, stores, and platform statistics' :
                 user.role === 'store_owner' ? 'View your store analytics and customer ratings' :
                 'Browse stores and submit ratings'}
              </p>
            </motion.div>
          </div>

          {/* Role Card */}
          <div className="flex justify-center">
            <AnimatedCard delay={0.2} className={`bg-gradient-to-br ${getRoleColor()} max-w-md`}>
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  {getRoleIcon()}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{user.name}</h3>
                <p className="text-gray-300 capitalize text-lg">{user.role.replace('_', ' ')}</p>
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 text-sm">Active Session</span>
                </div>
              </CardContent>
            </AnimatedCard>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.role === 'admin' && (
              <>
                <AnimatedCard delay={0.3} className="bg-black/40 border-white/10 hover:bg-black/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Users className="h-6 w-6 text-blue-400" />
                      <CardTitle className="text-white">Manage Users</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">Add, view, and manage platform users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">
                      Add new users with different roles and view user listings with filters.
                    </p>
                    <BackgroundGradient className="rounded-[12px] p-1">
                      <Button 
                        className="w-full bg-black border-none text-white" 
                        onClick={() => router.push('/dashboard/admin/users')}
                      >
                        Go to User Management
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </BackgroundGradient>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.4} className="bg-black/40 border-white/10 hover:bg-black/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Store className="h-6 w-6 text-green-400" />
                      <CardTitle className="text-white">Manage Stores</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">Add, view, and manage store listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">
                      Add new stores and view store details with ratings information.
                    </p>
                    <BackgroundGradient className="rounded-[12px] p-1">
                      <Button 
                        className="w-full bg-black border-none text-white"
                        onClick={() => router.push('/dashboard/admin/stores')}
                      >
                        Go to Store Management
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </BackgroundGradient>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.5} className="bg-black/40 border-white/10 hover:bg-black/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-6 w-6 text-purple-400" />
                      <CardTitle className="text-white">Platform Statistics</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">View platform metrics and analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Total Users:</span>
                        <span className="text-sm font-semibold text-white">
                          {loading ? 'Loading...' : ((stats?.totalUsers as number) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Total Stores:</span>
                        <span className="text-sm font-semibold text-white">
                          {loading ? 'Loading...' : ((stats?.totalStores as number) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Total Ratings:</span>
                        <span className="text-sm font-semibold text-white">
                          {loading ? 'Loading...' : ((stats?.totalRatings as number) || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </>
            )}

            {user.role === 'user' && (
              <>
                <AnimatedCard delay={0.3} className="bg-black/40 border-white/10 hover:bg-black/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Store className="h-6 w-6 text-green-400" />
                      <CardTitle className="text-white">Browse Stores</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">Find and rate stores in your area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">
                      Search for stores by name and address, view details and submit ratings.
                    </p>
                    <BackgroundGradient className="rounded-[12px] p-1">
                      <Button 
                        className="w-full bg-black border-none text-white"
                        onClick={() => router.push('/dashboard/user/stores')}
                      >
                        Browse Stores
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </BackgroundGradient>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.4} className="bg-black/40 border-white/10 hover:bg-black/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Star className="h-6 w-6 text-yellow-400" />
                      <CardTitle className="text-white">My Ratings</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">View and manage your submitted ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">
                      See all your submitted ratings and modify them if needed.
                    </p>
                    <BackgroundGradient className="rounded-[12px] p-1">
                      <Button 
                        className="w-full bg-black border-none text-white"
                        onClick={() => router.push('/dashboard/user/ratings')}
                      >
                        View My Ratings
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </BackgroundGradient>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.5} className="bg-black/40 border-white/10 hover:bg-black/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <User className="h-6 w-6 text-blue-400" />
                      <CardTitle className="text-white">Update Profile</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">
                      Update your password and account information.
                    </p>
                    <BackgroundGradient className="rounded-[12px] p-1">
                      <Button 
                        className="w-full bg-black border-none text-white"
                        onClick={() => router.push('/dashboard/user/profile')}
                      >
                        Manage Profile
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </BackgroundGradient>
                  </CardContent>
                </AnimatedCard>
              </>
            )}

            {user.role === 'store_owner' && (
              <>
                <AnimatedCard delay={0.3} className="bg-black/40 border-white/10 hover:bg-black/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Store className="h-6 w-6 text-blue-400" />
                      <CardTitle className="text-white">My Stores</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">View your owned stores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">
                      View all stores you own and their performance metrics.
                    </p>
                    <BackgroundGradient className="rounded-[12px] p-1">
                      <Button 
                        className="w-full bg-black border-none text-white"
                        onClick={() => router.push('/dashboard/store-owner/stores')}
                      >
                        View My Stores
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </BackgroundGradient>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.4} className="bg-black/40 border-white/10 hover:bg-black/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Star className="h-6 w-6 text-yellow-400" />
                      <CardTitle className="text-white">Customer Ratings</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">View customer feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">
                      See all ratings and feedback from customers for your stores.
                    </p>
                    <BackgroundGradient className="rounded-[12px] p-1">
                      <Button 
                        className="w-full bg-black border-none text-white"
                        onClick={() => router.push('/dashboard/store-owner/analytics')}
                      >
                        View Ratings
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </BackgroundGradient>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.5} className="bg-black/40 border-white/10 hover:bg-black/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-6 w-6 text-purple-400" />
                      <CardTitle className="text-white">Store Analytics</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">View store performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Average Rating:</span>
                        <span className="text-sm font-semibold text-white">
                          {loading ? 'Loading...' : `${(stats?.average_rating as number) || 0}/5`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Total Ratings:</span>
                        <span className="text-sm font-semibold text-white">
                          {loading ? 'Loading...' : ((stats?.total_ratings as number) || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}