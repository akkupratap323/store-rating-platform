'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Store, TrendingUp, Users, Award, Target, ArrowRight, Activity, BarChart3, Eye } from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
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
  Bar
} from 'recharts';

interface StoreOwnerStats {
  totalStores: number;
  totalRatings: number;
  overallAverageRating: string;
  monthlyRatings: number;
  stores: Array<{
    id: number;
    name: string;
    average_rating: string;
    total_ratings: number;
  }>;
  ratings: Array<{
    id: number;
    user_name: string;
    user_email: string;
    store_name: string;
    rating: number;
    created_at: string;
  }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function EnhancedStoreOwnerDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<StoreOwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/store-owner/stores', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
          setError(null);
        } else {
          setError('Failed to fetch store owner statistics');
        }
      } catch (error) {
        setError('Network error occurred');
        console.error('Fetch store owner stats error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Generate chart data
  const storePerformanceData = stats?.stores.map((store, index) => ({
    name: store.name.slice(0, 15) + (store.name.length > 15 ? '...' : ''),
    rating: parseFloat(store.average_rating),
    reviews: store.total_ratings,
    color: COLORS[index % COLORS.length]
  })) || [];

  const ratingDistribution = stats ? [
    { rating: '5★', count: stats.ratings.filter(r => r.rating === 5).length, color: '#10B981' },
    { rating: '4★', count: stats.ratings.filter(r => r.rating === 4).length, color: '#3B82F6' },
    { rating: '3★', count: stats.ratings.filter(r => r.rating === 3).length, color: '#F59E0B' },
    { rating: '2★', count: stats.ratings.filter(r => r.rating === 2).length, color: '#EF4444' },
    { rating: '1★', count: stats.ratings.filter(r => r.rating === 1).length, color: '#8B5CF6' }
  ].filter(item => item.count > 0) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-400 rounded-full" />
            <p className="text-gray-400 mt-4">Loading your store analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <AnimatedCard className="p-8 max-w-md mx-auto bg-black/40 border-white/10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Store Owner Dashboard</h1>
            <p className="text-red-400">{error}</p>
          </div>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 store-owner-dashboard">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="meteors"><Meteors number={20} /></div>
        
        {/* Header */}
        <div className="text-center relative overflow-hidden">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
            Store Analytics
          </h1>
          <p className="text-xl text-gray-300">
            Monitor your store performance and customer feedback
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatedCard delay={0.1} className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-400 text-sm font-medium">Total Stores</CardTitle>
                <Store className="h-6 w-6 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats?.totalStores || 0)}</div>
              <p className="text-sm text-gray-300">Stores you own</p>
              <div className="mt-3 flex items-center">
                <Target className="h-4 w-4 text-orange-400 mr-1" />
                <span className="text-xs text-orange-400">Growing strong!</span>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-400 text-sm font-medium">Total Ratings</CardTitle>
                <Star className="h-6 w-6 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats?.totalRatings || 0)}</div>
              <p className="text-sm text-gray-300">Customer reviews</p>
              <div className="mt-3 flex items-center">
                <Activity className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-xs text-blue-400">+{stats?.monthlyRatings || 0} this month</span>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400 text-sm font-medium">Average Rating</CardTitle>
                <Award className="h-6 w-6 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stats?.overallAverageRating || '0.0'}⭐</div>
              <p className="text-sm text-gray-300">Overall performance</p>
              <div className="mt-3 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-xs text-green-400">Excellent service!</span>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-purple-400 text-sm font-medium">Happy Customers</CardTitle>
                <Users className="h-6 w-6 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {stats?.ratings.filter(r => r.rating >= 4).length || 0}
              </div>
              <p className="text-sm text-gray-300">4+ star reviews</p>
              <div className="mt-3 flex items-center">
                <Award className="h-4 w-4 text-purple-400 mr-1" />
                <span className="text-xs text-purple-400">Great feedback!</span>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Performance */}
          <AnimatedCard delay={0.5} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Store Performance</CardTitle>
              <CardDescription className="text-gray-400">Average ratings by store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={storePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" domain={[0, 5]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Bar dataKey="rating" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Rating Distribution */}
          {ratingDistribution.length > 0 && (
            <AnimatedCard delay={0.6} className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Rating Distribution</CardTitle>
                <CardDescription className="text-gray-400">How customers rate your stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ratingDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ rating, count }) => `${rating}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {ratingDistribution.map((entry, index) => (
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
          )}
        </div>

        {/* Quick Actions and Recent Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <AnimatedCard delay={0.7} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">Manage your store presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-[500]" style={{zIndex: 500}}>
              <BackgroundGradient className="rounded-[16px] p-1 relative z-[600]" style={{zIndex: 600}}>
                <Link href="/dashboard/store-owner/stores" className="block relative z-[700]" style={{zIndex: 700}}>
                  <Button className="w-full justify-between bg-black border-none text-white py-6 relative z-[800] pointer-events-auto" style={{zIndex: 800, position: 'relative'}}>
                    <span className="flex items-center">
                      <Store className="h-5 w-5 mr-3" />
                      View My Stores
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </BackgroundGradient>
              
              <div className="relative z-[600]" style={{zIndex: 600}}>
                <Link href="/dashboard/store-owner/analytics" className="block relative z-[700]" style={{zIndex: 700}}>
                  <Button variant="outline" className="w-full justify-between border-white/20 text-white hover:bg-white/10 py-6 relative z-[800] pointer-events-auto" style={{zIndex: 800, position: 'relative'}}>
                    <span className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-3" />
                      Detailed Analytics
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="relative z-[600]" style={{zIndex: 600}}>
                <Link href="/dashboard/store-owner/profile" className="block relative z-[700]" style={{zIndex: 700}}>
                  <Button variant="outline" className="w-full justify-between border-white/20 text-white hover:bg-white/10 py-6 relative z-[800] pointer-events-auto" style={{zIndex: 800, position: 'relative'}}>
                    <span className="flex items-center">
                      <Users className="h-5 w-5 mr-3" />
                      Update Profile
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Recent Reviews */}
          <AnimatedCard delay={0.8} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Customer Reviews</CardTitle>
              <CardDescription className="text-gray-400">Latest feedback from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.ratings && stats.ratings.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {stats.ratings.slice(0, 5).map((rating, index) => (
                    <motion.div
                      key={rating.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors relative z-[300]"
                      style={{zIndex: 300}}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-white">{rating.user_name}</p>
                          <div className="flex items-center space-x-2">
                            {renderStars(rating.rating)}
                            <span className="text-sm font-semibold text-white">{rating.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-blue-400">{rating.store_name}</p>
                        <p className="text-xs text-gray-400">{formatDate(rating.created_at)}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div className="relative z-[400]" style={{zIndex: 400}}>
                    <Link href="/dashboard/store-owner/analytics" className="block relative z-[500]" style={{zIndex: 500}}>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 mt-4 relative z-[600] pointer-events-auto" style={{zIndex: 600, position: 'relative'}}>
                        View All Reviews
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <Star className="h-16 w-16 text-gray-500" />
                    <div>
                      <p className="text-gray-400 text-lg mb-3">No reviews yet</p>
                      <p className="text-gray-500 text-sm mb-6">Customer reviews will appear here</p>
                      <div className="relative z-[400]" style={{zIndex: 400}}>
                        <Link href="/dashboard/store-owner/stores" className="block relative z-[500]" style={{zIndex: 500}}>
                          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-none relative z-[600] pointer-events-auto" style={{zIndex: 600, position: 'relative'}}>
                            View Store Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}