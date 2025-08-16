'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Edit, Calendar, MapPin, TrendingUp, Award, Activity, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { formatNumber } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
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

interface UserRating {
  id: number;
  rating: number;
  created_at: string;
  updated_at: string;
  store_id: number;
  store_name: string;
  store_address: string;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export function EnhancedUserRatings() {
  const { token } = useAuth();
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch('/api/ratings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRatings(data.ratings);
          setError(null);
        } else {
          setError('Failed to fetch ratings');
        }
      } catch (error) {
        setError('Network error occurred');
        console.error('Fetch ratings error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRatings();
    }
  }, [token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current drop-shadow-lg' 
                : 'text-gray-600'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-white">{rating}</span>
      </div>
    );
  };

  const getRecentRatings = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return ratings.filter(r => new Date(r.updated_at) > thirtyDaysAgo);
  };

  const getAverageRating = () => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  };

  // Generate chart data
  const ratingDistribution = [
    { rating: '5★', count: ratings.filter(r => r.rating === 5).length, color: '#10B981' },
    { rating: '4★', count: ratings.filter(r => r.rating === 4).length, color: '#3B82F6' },
    { rating: '3★', count: ratings.filter(r => r.rating === 3).length, color: '#F59E0B' },
    { rating: '2★', count: ratings.filter(r => r.rating === 2).length, color: '#EF4444' },
    { rating: '1★', count: ratings.filter(r => r.rating === 1).length, color: '#8B5CF6' }
  ].filter(item => item.count > 0);

  // Generate monthly activity data
  const monthlyActivity = ratings.reduce((acc, rating) => {
    const month = new Date(rating.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activityData = Object.entries(monthlyActivity)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-400 rounded-full" />
            <p className="text-gray-400 mt-4">Loading your ratings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Meteors number={20} />
        
        {/* Header */}
        <div className="text-center relative overflow-hidden">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            My Store Ratings
          </h1>
          <p className="text-xl text-gray-300">
            Track your rating history and discover your preferences
          </p>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-red-500/20 border border-red-500/20 rounded-lg backdrop-blur-sm"
            >
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatedCard delay={0.1} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-400 text-sm font-medium">Total Ratings</CardTitle>
                <Star className="h-6 w-6 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(ratings.length)}</div>
              <p className="text-sm text-gray-300">Stores you&apos;ve rated</p>
              <div className="mt-3 flex items-center">
                <Activity className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-xs text-blue-400">Your impact!</span>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400 text-sm font-medium">Average Rating</CardTitle>
                <Award className="h-6 w-6 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {getAverageRating().toFixed(1)}⭐
              </div>
              <p className="text-sm text-gray-300">Your average rating</p>
              <div className="mt-3 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-xs text-green-400">Great taste!</span>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-purple-400 text-sm font-medium">Recent Activity</CardTitle>
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {getRecentRatings().length}
              </div>
              <p className="text-sm text-gray-300">Ratings in last 30 days</p>
              <div className="mt-3 flex items-center">
                <Activity className="h-4 w-4 text-purple-400 mr-1" />
                <span className="text-xs text-purple-400">Stay active!</span>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-400 text-sm font-medium">Favorite Rating</CardTitle>
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {ratings.length > 0 ? 
                  ratings.reduce((acc, r) => {
                    acc[r.rating] = (acc[r.rating] || 0) + 1;
                    return acc;
                  }, {} as Record<number, number>)[
                    Number(Object.entries(ratings.reduce((acc, r) => {
                      acc[r.rating] = (acc[r.rating] || 0) + 1;
                      return acc;
                    }, {} as Record<number, number>)).sort(([,a], [,b]) => b - a)[0]?.[0]) || 5
                  ] ? Number(Object.entries(ratings.reduce((acc, r) => {
                    acc[r.rating] = (acc[r.rating] || 0) + 1;
                    return acc;
                  }, {} as Record<number, number>)).sort(([,a], [,b]) => b - a)[0]?.[0]) : 5
                  : '5'
                }⭐
              </div>
              <p className="text-sm text-gray-300">Most used rating</p>
              <div className="mt-3 flex items-center">
                <Award className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-xs text-yellow-400">Your style!</span>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Charts Section */}
        {ratings.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            {ratingDistribution.length > 0 && (
              <AnimatedCard delay={0.5} className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Rating Distribution</CardTitle>
                  <CardDescription className="text-gray-400">Your rating patterns</CardDescription>
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

            {/* Activity Timeline */}
            {activityData.length > 0 && (
              <AnimatedCard delay={0.6} className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Rating Activity</CardTitle>
                  <CardDescription className="text-gray-400">Your rating timeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
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
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#3B82F6" 
                          fill="url(#colorGradient)" 
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </AnimatedCard>
            )}
          </div>
        )}

        {/* Ratings List */}
        <AnimatedCard delay={0.7} className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Your Store Ratings</CardTitle>
            <CardDescription className="text-gray-400">All the stores you&apos;ve rated and reviewed</CardDescription>
          </CardHeader>
          <CardContent>
            {ratings.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex flex-col items-center space-y-6">
                  <Star className="h-20 w-20 text-gray-500" />
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-3">No ratings yet</h3>
                    <p className="text-gray-400 text-lg mb-8">Start exploring stores and share your experiences!</p>
                    <BackgroundGradient className="rounded-[16px] p-1">
                      <Link href="/dashboard/user/stores">
                        <Button className="bg-black border-none text-white py-4 px-8 text-lg font-semibold">
                          <Eye className="h-5 w-5 mr-3" />
                          Browse Stores to Rate
                          <ArrowRight className="h-5 w-5 ml-3" />
                        </Button>
                      </Link>
                    </BackgroundGradient>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {ratings.map((rating, index) => (
                      <motion.div
                        key={rating.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-6 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border border-white/10 hover:bg-white/15 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                                <Star className="h-4 w-4 text-white" />
                              </div>
                              {rating.store_name}
                            </h3>
                            <div className="flex items-center text-gray-300 mb-3">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-sm">{rating.store_address}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {renderStars(rating.rating)}
                                <div className="text-sm text-gray-400">
                                  <span>Rated: {formatDate(rating.created_at)}</span>
                                  {rating.updated_at !== rating.created_at && (
                                    <span className="ml-2">• Updated: {formatDate(rating.updated_at)}</span>
                                  )}
                                </div>
                              </div>
                              <Link href="/dashboard/user/stores">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Update Rating
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Browse More Stores Button */}
                <div className="text-center pt-8">
                  <BackgroundGradient className="rounded-[16px] p-1 inline-block">
                    <Link href="/dashboard/user/stores">
                      <Button className="bg-black border-none text-white py-4 px-8 font-semibold">
                        <Eye className="h-5 w-5 mr-3" />
                        Browse More Stores
                        <ArrowRight className="h-5 w-5 ml-3" />
                      </Button>
                    </Link>
                  </BackgroundGradient>
                </div>
              </div>
            )}
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
}