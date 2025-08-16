'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Star, MapPin, Mail } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  average_rating: string;
  total_ratings: number;
  user_rating?: number | null;
}

export function StoreBrowsing() {
  const { token } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<number | null>(null);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');

  // Rating states
  const [ratingValues, setRatingValues] = useState<{[key: number]: number}>({});

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('query', searchTerm);
        params.append('field', searchField);
      }

      const response = await fetch(`/api/stores?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStores(data.stores);
        setError(null);
        
        // Initialize rating values for stores that user hasn't rated
        const initialRatings: {[key: number]: number} = {};
        data.stores.forEach((store: Store) => {
          if (store.user_rating) {
            initialRatings[store.id] = store.user_rating;
          } else {
            initialRatings[store.id] = 1; // Default to 1 star
          }
        });
        setRatingValues(initialRatings);
      } else {
        setError('Failed to fetch stores');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Fetch stores error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStores();
    }
  }, [token, searchTerm, searchField]);

  const handleRatingSubmit = async (storeId: number) => {
    try {
      setSubmitLoading(storeId);
      const rating = ratingValues[storeId];
      
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId, rating }),
      });

      if (response.ok) {
        // Refresh stores to get updated ratings
        fetchStores();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit rating');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Submit rating error:', error);
    } finally {
      setSubmitLoading(null);
    }
  };

  const renderStarRating = (rating: number, onRatingChange?: (rating: number) => void, interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
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
          <h1 className="text-3xl font-bold text-gray-900">Browse Stores</h1>
          <p className="text-gray-600">Discover stores and share your experiences</p>
        </div>
        <div className="text-center py-8">
          <p>Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Stores</h1>
        <p className="text-gray-600">Discover stores and share your experiences</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Stores</CardTitle>
          <CardDescription>Find stores by name or address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="searchField">Search By</Label>
              <Select value={searchField} onValueChange={setSearchField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Store Name</SelectItem>
                  <SelectItem value="address">Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSearchField('name');
                }}
              >
                Clear Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{store.name}</CardTitle>
              <CardDescription className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                <span className="text-sm">{store.address}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Store Details */}
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{store.email}</span>
              </div>

              {/* Overall Rating */}
              <div>
                <Label className="text-sm font-medium">Overall Rating</Label>
                {renderOverallRating(store.average_rating, store.total_ratings)}
              </div>

              {/* User's Rating */}
              <div>
                <Label className="text-sm font-medium">
                  {store.user_rating ? 'Your Rating' : 'Rate this Store'}
                </Label>
                <div className="flex items-center space-x-3 mt-2">
                  {renderStarRating(
                    ratingValues[store.id] || 1,
                    (rating) => setRatingValues({...ratingValues, [store.id]: rating}),
                    true
                  )}
                  <span className="text-sm text-gray-600">
                    {ratingValues[store.id]} star{ratingValues[store.id] !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Submit Rating Button */}
              <Button 
                className="w-full" 
                onClick={() => handleRatingSubmit(store.id)}
                disabled={submitLoading === store.id}
              >
                {submitLoading === store.id ? 'Submitting...' : 
                 store.user_rating ? 'Update Rating' : 'Submit Rating'}
              </Button>

              {/* Current User Rating Display */}
              {store.user_rating && (
                <div className="text-xs text-gray-500 text-center">
                  You previously rated this store {store.user_rating} star{store.user_rating !== 1 ? 's' : ''}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {stores.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No stores found matching your search.' : 'No stores available.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}