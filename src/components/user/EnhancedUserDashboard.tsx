'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Store, TrendingUp, Eye, ArrowRight, Award, Target, Activity } from 'lucide-react';
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
  Cell
} from 'recharts';

interface UserStats {
  totalRatings: number;
  storesRated: number;
  averageRating: string;
  recentRatings: Array<{
    id: number;
    store_name: string;
    rating: number;
    created_at: string;
  }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function EnhancedUserDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/ratings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const ratings = data.ratings;
          
          const userStats: UserStats = {
            totalRatings: ratings.length,
            storesRated: ratings.length, // Each rating is for a unique store due to DB constraint
            averageRating: ratings.length > 0 
              ? (ratings.reduce((sum: number, r: {rating: number}) => sum + r.rating, 0) / ratings.length).toFixed(1)
              : '0.0',
            recentRatings: ratings.slice(0, 5) // Get 5 most recent
          };
          
          setStats(userStats);
          setError(null);
        } else {
          setError('Failed to fetch user statistics');
        }
      } catch (error) {
        setError('Network error occurred');
        console.error('Fetch user stats error:', error);
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
  const ratingDistribution = stats ? [
    { rating: '5★', count: stats.recentRatings.filter(r => r.rating === 5).length, color: '#10B981' },
    { rating: '4★', count: stats.recentRatings.filter(r => r.rating === 4).length, color: '#3B82F6' },
    { rating: '3★', count: stats.recentRatings.filter(r => r.rating === 3).length, color: '#F59E0B' },
    { rating: '2★', count: stats.recentRatings.filter(r => r.rating === 2).length, color: '#EF4444' },
    { rating: '1★', count: stats.recentRatings.filter(r => r.rating === 1).length, color: '#8B5CF6' }
  ].filter(item => item.count > 0) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-400 rounded-full" />
            <p className="text-gray-400 mt-4">Loading your dashboard...</p>
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
            <h1 className="text-2xl font-bold text-white mb-4">User Dashboard</h1>
            <p className="text-red-400">{error}</p>
          </div>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Meteors number={20} />
        
        {/* Header */}
        <div className="text-center relative overflow-hidden">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-xl text-gray-300">
            Discover amazing stores and share your experiences
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard delay={0.1} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400 text-sm font-medium">Ratings Given</CardTitle>
                <Star className="h-6 w-6 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats?.totalRatings || 0)}</div>
              <p className="text-sm text-gray-300">Total reviews submitted</p>
              <div className="mt-3 flex items-center">
                <Activity className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-xs text-green-400">Keep sharing your experiences!</span>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-400 text-sm font-medium">Stores Rated</CardTitle>
                <Store className="h-6 w-6 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats?.storesRated || 0)}</div>
              <p className="text-sm text-gray-300">Unique stores reviewed</p>
              <div className="mt-3 flex items-center">
                <Target className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-xs text-blue-400">Explore more stores!</span>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-purple-400 text-sm font-medium">Average Rating</CardTitle>
                <Award className="h-6 w-6 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stats?.averageRating || '0.0'}⭐</div>
              <p className="text-sm text-gray-300">Your average rating</p>
              <div className="mt-3 flex items-center">
                <TrendingUp className="h-4 w-4 text-purple-400 mr-1" />
                <span className="text-xs text-purple-400">Great taste in stores!</span>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Charts and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <AnimatedCard delay={0.4} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <BackgroundGradient className="rounded-[16px] p-1">
                <Link href="/dashboard/user/stores">
                  <Button className="w-full justify-between bg-black border-none text-white py-6">
                    <span className="flex items-center">
                      <Store className="h-5 w-5 mr-3" />
                      Browse Stores
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </BackgroundGradient>
              
              <Link href="/dashboard/user/ratings">
                <Button variant="outline" className="w-full justify-between border-white/20 text-white hover:bg-white/10 py-6">
                  <span className="flex items-center">
                    <Eye className="h-5 w-5 mr-3" />
                    View My Ratings
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/dashboard/user/profile">
                <Button variant="outline" className="w-full justify-between border-white/20 text-white hover:bg-white/10 py-6">
                  <span className="flex items-center">
                    <Award className="h-5 w-5 mr-3" />
                    Update Profile
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </AnimatedCard>

          {/* Rating Distribution */}
          {ratingDistribution.length > 0 && (
            <AnimatedCard delay={0.5} className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Your Rating Distribution</CardTitle>
                <CardDescription className="text-gray-400">How you rate stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
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

        {/* Recent Activity */}
        <AnimatedCard delay={0.6} className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Ratings</CardTitle>
            <CardDescription className="text-gray-400">Your latest store reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentRatings && stats.recentRatings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentRatings.map((rating, index) => (
                  <motion.div
                    key={rating.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white">{rating.store_name}</p>
                      <p className="text-sm text-gray-400">{formatDate(rating.created_at)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {renderStars(rating.rating)}
                      <span className="text-lg font-semibold text-white">{rating.rating}</span>
                    </div>
                  </motion.div>
                ))}
                <Link href="/dashboard/user/ratings">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 mt-4">
                    View All Ratings
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <Star className="h-16 w-16 text-gray-500" />
                  <div>
                    <p className="text-gray-400 text-lg mb-3">No ratings yet</p>
                    <p className="text-gray-500 text-sm mb-6">Start rating stores to see your activity here</p>
                    <Link href="/dashboard/user/stores">
                      <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-none">
                        Rate Your First Store
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
}