'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Store, TrendingUp, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

export function UserDashboard() {
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
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">Explore stores and share your experiences</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ratings Given</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRatings || 0}</div>
            <p className="text-xs text-muted-foreground">Total reviews submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stores Rated</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.storesRated || 0}</div>
            <p className="text-xs text-muted-foreground">Unique stores reviewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating || '0.0'}</div>
            <p className="text-xs text-muted-foreground">Your average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/user/stores">
              <Button className="w-full justify-between">
                <span className="flex items-center">
                  <Store className="h-4 w-4 mr-2" />
                  Browse Stores
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/user/ratings">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  View My Ratings
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Ratings</CardTitle>
            <CardDescription>Your latest store reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentRatings && stats.recentRatings.length > 0 ? (
              <div className="space-y-3">
                {stats.recentRatings.map((rating) => (
                  <div key={rating.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{rating.store_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(rating.created_at)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStars(rating.rating)}
                      <span className="text-sm font-medium">{rating.rating}</span>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/user/ratings">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Ratings
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-3">No ratings yet</p>
                <Link href="/dashboard/user/stores">
                  <Button size="sm">Rate Your First Store</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}