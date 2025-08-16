'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Edit, Trash2 } from 'lucide-react';

interface UserRating {
  id: number;
  rating: number;
  created_at: string;
  updated_at: string;
  store_id: number;
  store_name: string;
  store_address: string;
}

export function UserRatings() {
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
    return new Date(dateString).toLocaleDateString();
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
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
          <p className="text-gray-600">View and manage your store ratings</p>
        </div>
        <div className="text-center py-8">
          <p>Loading your ratings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
        <p className="text-gray-600">View and manage your store ratings</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ratings.length}</div>
            <p className="text-xs text-muted-foreground">Stores you've rated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ratings.length > 0 
                ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
                : '0.0'
              }
            </div>
            <p className="text-xs text-muted-foreground">Your average rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ratings.filter(r => {
                const ratingDate = new Date(r.updated_at);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return ratingDate > thirtyDaysAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Ratings in last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Ratings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Store Ratings</CardTitle>
          <CardDescription>All the stores you've rated and reviewed</CardDescription>
        </CardHeader>
        <CardContent>
          {ratings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't rated any stores yet.</p>
              <Button asChild>
                <a href="/dashboard/user/stores">Browse Stores to Rate</a>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Your Rating</TableHead>
                    <TableHead>Rated On</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratings.map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell className="font-medium">{rating.store_name}</TableCell>
                      <TableCell className="max-w-xs truncate">{rating.store_address}</TableCell>
                      <TableCell>
                        {renderStars(rating.rating)}
                      </TableCell>
                      <TableCell>{formatDate(rating.created_at)}</TableCell>
                      <TableCell>{formatDate(rating.updated_at)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = '/dashboard/user/stores'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}