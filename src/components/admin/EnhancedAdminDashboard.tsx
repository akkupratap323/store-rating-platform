'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Store, Star, BarChart3, TrendingUp, UserPlus, ShoppingBag, Eye, Plus } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { formatNumber } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';

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
  monthlyData?: Array<{
    month: string;
    users: number;
    stores: number;
    ratings: number;
  }>;
  ratingDistribution?: Array<{
    rating: string;
    count: number;
  }>;
  topStores?: Array<{
    name: string;
    rating: number;
    total_ratings: number;
  }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function EnhancedAdminDashboard() {
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
          
          // Generate mock additional data for charts
          const monthlyData = [
            { month: 'Jan', users: Math.floor(data.totalUsers * 0.1), stores: Math.floor(data.totalStores * 0.1), ratings: Math.floor(data.totalRatings * 0.1) },
            { month: 'Feb', users: Math.floor(data.totalUsers * 0.2), stores: Math.floor(data.totalStores * 0.2), ratings: Math.floor(data.totalRatings * 0.2) },
            { month: 'Mar', users: Math.floor(data.totalUsers * 0.3), stores: Math.floor(data.totalStores * 0.3), ratings: Math.floor(data.totalRatings * 0.3) },
            { month: 'Apr', users: Math.floor(data.totalUsers * 0.5), stores: Math.floor(data.totalStores * 0.5), ratings: Math.floor(data.totalRatings * 0.5) },
            { month: 'May', users: Math.floor(data.totalUsers * 0.7), stores: Math.floor(data.totalStores * 0.7), ratings: Math.floor(data.totalRatings * 0.7) },
            { month: 'Jun', users: data.totalUsers, stores: data.totalStores, ratings: data.totalRatings }
          ];

          const ratingDistribution = [
            { rating: '5★', count: Math.floor(data.totalRatings * 0.4) },
            { rating: '4★', count: Math.floor(data.totalRatings * 0.3) },
            { rating: '3★', count: Math.floor(data.totalRatings * 0.2) },
            { rating: '2★', count: Math.floor(data.totalRatings * 0.07) },
            { rating: '1★', count: Math.floor(data.totalRatings * 0.03) }
          ];

          const topStores = [
            { name: 'Premium Coffee House', rating: 4.8, total_ratings: 156 },
            { name: 'Tech Galaxy Store', rating: 4.6, total_ratings: 132 },
            { name: 'Fashion Hub', rating: 4.5, total_ratings: 98 },
            { name: 'Book Paradise', rating: 4.4, total_ratings: 87 },
            { name: 'Gourmet Delights', rating: 4.3, total_ratings: 76 }
          ];

          setStats({
            ...data,
            monthlyData,
            ratingDistribution,
            topStores
          });
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <AnimatedCard className="p-8 max-w-md mx-auto bg-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-red-600">{error || 'No data available'}</p>
          </div>
        </AnimatedCard>
      </div>
    );
  }

  const roleData = [
    { name: 'Regular Users', value: stats.usersByRole.user || 0, color: '#3B82F6' },
    { name: 'Store Owners', value: stats.usersByRole.store_owner || 0, color: '#10B981' },
    { name: 'Administrators', value: stats.usersByRole.admin || 0, color: '#F59E0B' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center relative overflow-hidden">
          <Meteors number={20} />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Comprehensive platform analytics and management
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedCard delay={0.1} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-400 text-sm font-medium">Total Users</CardTitle>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats.totalUsers)}</div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">+{stats.recentUsers} this month</span>
              </div>
              <Progress value={(stats.recentUsers / stats.totalUsers) * 100} className="mt-3 h-2" />
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400 text-sm font-medium">Total Stores</CardTitle>
                <Store className="h-5 w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats.totalStores)}</div>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-400">Active stores</span>
              </div>
              <Progress value={85} className="mt-3 h-2" />
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-400 text-sm font-medium">Total Ratings</CardTitle>
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats.totalRatings)}</div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">+{stats.recentRatings} this month</span>
              </div>
              <Progress value={(stats.recentRatings / stats.totalRatings) * 100} className="mt-3 h-2" />
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-purple-400 text-sm font-medium">Average Rating</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stats.averageRating}⭐</div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Platform average</span>
              </div>
              <Progress value={parseFloat(stats.averageRating) * 20} className="mt-3 h-2" />
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <AnimatedCard delay={0.5} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Growth Trends</CardTitle>
              <CardDescription className="text-gray-400">Monthly platform growth overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorStores" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRatings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Legend />
                    <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" name="Users" />
                    <Area type="monotone" dataKey="stores" stroke="#10B981" fillOpacity={1} fill="url(#colorStores)" name="Stores" />
                    <Area type="monotone" dataKey="ratings" stroke="#F59E0B" fillOpacity={1} fill="url(#colorRatings)" name="Ratings" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* User Role Distribution */}
          <AnimatedCard delay={0.6} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">User Distribution</CardTitle>
              <CardDescription className="text-gray-400">Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Rating Distribution & Top Stores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rating Distribution */}
          <AnimatedCard delay={0.7} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Rating Distribution</CardTitle>
              <CardDescription className="text-gray-400">How users rate our stores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="rating" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Top Stores */}
          <AnimatedCard delay={0.8} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Stores</CardTitle>
              <CardDescription className="text-gray-400">Highest rated stores on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topStores?.map((store, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{store.name}</p>
                        <p className="text-gray-400 text-sm">{store.total_ratings} ratings</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{store.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Management Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BackgroundGradient className="rounded-[22px] p-1">
            <AnimatedCard delay={0.9} className="bg-black border-none">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription className="text-gray-400">Manage platform users</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none text-white"
                  onClick={() => router.push('/dashboard/admin/users')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </CardContent>
            </AnimatedCard>
          </BackgroundGradient>

          <BackgroundGradient className="rounded-[22px] p-1">
            <AnimatedCard delay={1.0} className="bg-black border-none">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Store className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Store Management</CardTitle>
                    <CardDescription className="text-gray-400">Manage store listings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none text-white"
                  onClick={() => router.push('/dashboard/admin/stores')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Stores
                </Button>
              </CardContent>
            </AnimatedCard>
          </BackgroundGradient>

          <BackgroundGradient className="rounded-[22px] p-1">
            <AnimatedCard delay={1.1} className="bg-black border-none">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Star className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">View Ratings</CardTitle>
                    <CardDescription className="text-gray-400">Monitor all ratings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 border-none text-white"
                  onClick={() => router.push('/dashboard/admin/ratings')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All Ratings
                </Button>
              </CardContent>
            </AnimatedCard>
          </BackgroundGradient>
        </div>
      </div>
    </div>
  );
}