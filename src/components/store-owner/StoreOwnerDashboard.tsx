'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Store, Users, TrendingUp } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  average_rating: string;
  total_ratings: number;
  created_at: string;
}

interface Rating {
  id: number;
  rating: number;
  created_at: string;
  user_name: string;
  user_email: string;
  store_name: string;
  store_id: number;
}

interface Statistics {
  totalStores: number;
  totalRatings: number;
  overallAverageRating: string;
}

interface StoreOwnerData {
  stores: Store[];
  ratings: Rating[];
  statistics: Statistics;
}

export function StoreOwnerDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<StoreOwnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/store-owner/stores', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);
          setError(null);
        } else {
          setError('Failed to fetch store data');
        }
      } catch (error) {
        setError('Network error occurred');
        console.error('Fetch store owner data error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStarRating = (rating: number) => {
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
        <span className="ml-2 text-sm">{rating}</span>
      </div>
    );
  };

  const renderOverallRating = (averageRating: string, totalRatings: number) => {
    const numRating = parseFloat(averageRating);
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= numRating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium">{averageRating}</span>
        </div>
        <span className="text-xs text-gray-500">({totalRatings} reviews)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
          <p className="text-gray-600">Manage your stores and view analytics</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
        <p className="text-gray-600">Manage your stores and view analytics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.statistics.totalStores}</div>
            <p className="text-xs text-muted-foreground">Total stores owned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.statistics.totalRatings}</div>
            <p className="text-xs text-muted-foreground">Across all stores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.statistics.overallAverageRating}</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* My Stores */}
      <Card>
        <CardHeader>
          <CardTitle>My Stores</CardTitle>
          <CardDescription>Your registered stores and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          {data.stores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No stores registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{store.address}</TableCell>
                      <TableCell>
                        {renderOverallRating(store.average_rating, store.total_ratings)}
                      </TableCell>
                      <TableCell>{formatDate(store.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Ratings</CardTitle>
          <CardDescription>Users who have submitted ratings for your stores</CardDescription>
        </CardHeader>
        <CardContent>
          {data.ratings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No ratings received yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.ratings.slice(0, 10).map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell className="font-medium">{rating.user_name}</TableCell>
                      <TableCell>{rating.user_email}</TableCell>
                      <TableCell>{rating.store_name}</TableCell>
                      <TableCell>
                        {renderStarRating(rating.rating)}
                      </TableCell>
                      <TableCell>{formatDate(rating.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data.ratings.length > 10 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    Showing 10 of {data.ratings.length} total ratings
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}