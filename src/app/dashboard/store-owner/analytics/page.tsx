'use client';

import { DashboardLayout } from '@/components/common/DashboardLayout';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedCard } from '@/components/ui/animated-card';
// import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { motion } from 'framer-motion';
import { formatNumber } from '@/lib/utils';
import {
  Star,
  Store,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Activity,
  Award,
  Target,
  // User,
  Clock,
  Sparkles
} from 'lucide-react';
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
  // BarChart,
  // Bar,
  // LineChart,
  // Line
} from 'recharts';

interface Analytics {
  total_stores: number;
  total_ratings: number;
  average_rating: number;
  ratings_this_month: number;
  recent_ratings: Array<{
    id: number;
    user_name: string;
    store_name: string;
    rating: number;
    created_at: string;
  }>;
}

// const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function EnhancedStoreOwnerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/store-owner/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate chart data
  const ratingDistribution = analytics ? [
    { rating: '5★', count: analytics.recent_ratings.filter(r => r.rating === 5).length, color: '#10B981' },
    { rating: '4★', count: analytics.recent_ratings.filter(r => r.rating === 4).length, color: '#3B82F6' },
    { rating: '3★', count: analytics.recent_ratings.filter(r => r.rating === 3).length, color: '#F59E0B' },
    { rating: '2★', count: analytics.recent_ratings.filter(r => r.rating === 2).length, color: '#EF4444' },
    { rating: '1★', count: analytics.recent_ratings.filter(r => r.rating === 1).length, color: '#8B5CF6' }
  ].filter(item => item.count > 0) : [];

  // Generate monthly trend data (mock data for demo)
  const monthlyTrend = [
    { month: 'Jan', ratings: 12, average: 4.2 },
    { month: 'Feb', ratings: 18, average: 4.3 },
    { month: 'Mar', ratings: 15, average: 4.1 },
    { month: 'Apr', ratings: 22, average: 4.4 },
    { month: 'May', ratings: 25, average: 4.5 },
    { month: 'Jun', ratings: analytics?.ratings_this_month || 28, average: analytics?.average_rating || 4.6 }
  ];

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['store_owner']}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
          <AnimatedCard className="p-8 bg-black/40 border-white/10">
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-400 rounded-full mb-4" />
              <p className="text-gray-300">Loading your analytics data...</p>
            </div>
          </AnimatedCard>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['store_owner']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Meteors number={15} />
          
          {/* Enhanced Header */}
          <div className="text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-4">
                Advanced Analytics
              </h1>
              <p className="text-xl text-gray-300">Deep insights into your store performance and customer satisfaction</p>
            </motion.div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedCard delay={0.1} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-400 text-sm font-medium">Total Stores</CardTitle>
                  <Store className="h-6 w-6 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{formatNumber(analytics?.total_stores || 0)}</div>
                <div className="flex items-center text-xs text-blue-400">
                  <Target className="h-3 w-3 mr-1" />
                  Your business empire
                </div>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.2} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-400 text-sm font-medium">Total Ratings</CardTitle>
                  <Star className="h-6 w-6 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{formatNumber(analytics?.total_ratings || 0)}</div>
                <div className="flex items-center text-xs text-green-400">
                  <Activity className="h-3 w-3 mr-1" />
                  Customer feedback
                </div>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.3} className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-yellow-400 text-sm font-medium">Average Rating</CardTitle>
                  <Award className="h-6 w-6 text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {(analytics?.average_rating || 0).toFixed(1)}⭐
                </div>
                <div className="flex items-center">
                  {renderStars(Math.floor(analytics?.average_rating || 0))}
                </div>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.4} className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-purple-400 text-sm font-medium">This Month</CardTitle>
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{analytics?.ratings_this_month || 0}</div>
                <div className="flex items-center text-xs text-purple-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  New ratings
                </div>
              </CardContent>
            </AnimatedCard>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            {ratingDistribution.length > 0 && (
              <AnimatedCard delay={0.5} className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Rating Distribution
                  </CardTitle>
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
                          outerRadius={90}
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

            {/* Monthly Trends */}
            <AnimatedCard delay={0.6} className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Monthly Performance
                </CardTitle>
                <CardDescription className="text-gray-400">Rating trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="colorRatings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
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
                      <Area
                        type="monotone"
                        dataKey="ratings"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorRatings)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </AnimatedCard>
          </div>

          {/* Enhanced Recent Ratings */}
          <AnimatedCard delay={0.7} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Recent Customer Reviews
              </CardTitle>
              <CardDescription className="text-gray-400">Latest feedback from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              {!analytics?.recent_ratings || analytics.recent_ratings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-lg mb-2">No recent ratings found</p>
                      <p className="text-gray-500 text-sm">Customer reviews will appear here when they rate your stores</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.recent_ratings.map((rating, index) => (
                    <motion.div
                      key={rating.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {rating.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{rating.user_name}</p>
                          <p className="text-sm text-blue-400 flex items-center">
                            <Store className="h-3 w-3 mr-1" />
                            {rating.store_name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          {renderStars(rating.rating)}
                          <span className="text-sm font-semibold text-white mt-1">{rating.rating}/5</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(rating.created_at)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </AnimatedCard>

          {/* Performance Insights */}
          <AnimatedCard delay={0.8} className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Performance Insights
              </CardTitle>
              <CardDescription className="text-gray-400">Key metrics and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {analytics?.recent_ratings.filter(r => r.rating >= 4).length || 0}
                </div>
                <p className="text-sm text-gray-300">Happy Customers</p>
                <p className="text-xs text-green-400 mt-1">4+ star reviews</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {analytics?.average_rating ? ((analytics.average_rating / 5) * 100).toFixed(0) : 0}%
                </div>
                <p className="text-sm text-gray-300">Satisfaction Rate</p>
                <p className="text-xs text-blue-400 mt-1">Overall performance</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  {analytics?.total_stores ? Math.round(analytics.total_ratings / analytics.total_stores) : 0}
                </div>
                <p className="text-sm text-gray-300">Avg Reviews/Store</p>
                <p className="text-xs text-purple-400 mt-1">Engagement level</p>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    </DashboardLayout>
  );
}