'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Star, MapPin, Mail, Filter, X, Store as StoreIcon, Award, Heart } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { formatNumber } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  average_rating: string;
  total_ratings: number;
  user_rating?: number | null;
}

export function EnhancedStoreBrowsing() {
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
  const [hoveredRating, setHoveredRating] = useState<{[key: number]: number}>({});

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
            initialRatings[store.id] = 5; // Default to 5 stars for better UX
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
      const store = stores.find(s => s.id === storeId);
      const isUpdate = store?.user_rating !== null;
      
      const loadingToastId = enhancedToast.loading(
        isUpdate ? 'Updating your rating...' : 'Submitting your rating...'
      );
      
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId, rating }),
      });

      enhancedToast.dismiss(loadingToastId);

      if (response.ok) {
        enhancedToast.success(
          isUpdate 
            ? `Rating updated to ${rating} stars for ${store?.name || 'store'}!`
            : `Rating submitted! You gave ${rating} stars to ${store?.name || 'store'}.`
        );
        // Refresh stores to get updated ratings
        fetchStores();
      } else {
        const data = await response.json();
        enhancedToast.error(data.message || 'Failed to submit rating');
        setError(data.message || 'Failed to submit rating');
      }
    } catch (error) {
      enhancedToast.error('Network error occurred');
      setError('Network error occurred');
      console.error('Submit rating error:', error);
    } finally {
      setSubmitLoading(null);
    }
  };

  const renderInteractiveStarRating = (storeId: number, rating: number) => {
    const currentRating = hoveredRating[storeId] || rating;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star
              className={`h-6 w-6 cursor-pointer transition-all duration-200 ${
                star <= currentRating 
                  ? 'text-yellow-400 fill-current drop-shadow-lg' 
                  : 'text-gray-600 hover:text-yellow-300'
              }`}
              onMouseEnter={() => setHoveredRating({...hoveredRating, [storeId]: star})}
              onMouseLeave={() => setHoveredRating({...hoveredRating, [storeId]: 0})}
              onClick={() => setRatingValues({...ratingValues, [storeId]: star})}
            />
          </motion.div>
        ))}
        <span className="ml-2 text-sm font-medium text-white">
          {currentRating} star{currentRating !== 1 ? 's' : ''}
        </span>
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
                  : 'text-gray-500'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-bold text-white">{averageRating}</span>
        </div>
        <span className="text-xs text-gray-400">({totalRatings} reviews)</span>
      </div>
    );
  };

  const getRatingColor = (rating: string) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/20';
    if (num >= 4.0) return 'from-blue-500/20 to-blue-600/20 border-blue-500/20';
    if (num >= 3.0) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/20';
    if (num >= 2.0) return 'from-orange-500/20 to-orange-600/20 border-orange-500/20';
    return 'from-red-500/20 to-red-600/20 border-red-500/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-400 rounded-full" />
            <p className="text-gray-400 mt-4">Loading amazing stores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Meteors number={15} />
        
        {/* Header */}
        <div className="text-center relative overflow-hidden">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Discover Stores
          </h1>
          <p className="text-xl text-gray-300">
            Find amazing stores and share your experiences
          </p>
        </div>

        {/* Search Section */}
        <AnimatedCard delay={0.2} className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Stores
            </CardTitle>
            <CardDescription className="text-gray-400">Find stores by name or address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-white">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search stores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchField" className="text-white">Search By</Label>
                <Select value={searchField} onValueChange={setSearchField}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="name" className="text-white hover:bg-gray-800">Store Name</SelectItem>
                    <SelectItem value="address" className="text-white hover:bg-gray-800">Address</SelectItem>
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
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </Button>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

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

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <AnimatedCard 
                  delay={0.3 + index * 0.1} 
                  className={`bg-gradient-to-br ${getRatingColor(store.average_rating)} hover:scale-105 transition-all duration-300`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2 flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                            <StoreIcon className="h-5 w-5 text-white" />
                          </div>
                          {store.name}
                        </CardTitle>
                        <CardDescription className="flex items-start space-x-2 text-gray-300">
                          <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm">{store.address}</span>
                        </CardDescription>
                      </div>
                      {store.user_rating && (
                        <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full">
                          <Heart className="h-3 w-3 text-green-400 fill-current" />
                          <span className="text-xs text-green-400">Rated</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Store Details */}
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{store.email}</span>
                    </div>

                    {/* Overall Rating */}
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Label className="text-sm font-medium text-white flex items-center mb-2">
                        <Award className="h-4 w-4 mr-1" />
                        Overall Rating
                      </Label>
                      {renderOverallRating(store.average_rating, store.total_ratings)}
                    </div>

                    {/* User's Rating */}
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Label className="text-sm font-medium text-white mb-3 block">
                        {store.user_rating ? 'Update Your Rating' : 'Rate this Store'}
                      </Label>
                      {renderInteractiveStarRating(store.id, ratingValues[store.id] || 5)}
                    </div>

                    {/* Submit Rating Button */}
                    <BackgroundGradient className="rounded-[12px] p-1">
                      <Button 
                        className="w-full bg-black border-none text-white py-3 font-semibold"
                        onClick={() => handleRatingSubmit(store.id)}
                        disabled={submitLoading === store.id}
                      >
                        {submitLoading === store.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                        ) : (
                          <Star className="h-4 w-4 mr-2" />
                        )}
                        {submitLoading === store.id ? 'Submitting...' : 
                         store.user_rating ? 'Update Rating' : 'Submit Rating'}
                      </Button>
                    </BackgroundGradient>

                    {/* Current User Rating Display */}
                    {store.user_rating && (
                      <div className="text-xs text-center bg-blue-500/20 p-2 rounded-lg">
                        <span className="text-blue-400">
                          Previously rated: {store.user_rating} star{store.user_rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {stores.length === 0 && !loading && (
          <AnimatedCard delay={0.5} className="bg-black/40 border-white/10">
            <CardContent className="text-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <StoreIcon className="h-16 w-16 text-gray-500" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {searchTerm ? 'No stores found' : 'No stores available'}
                  </h3>
                  <p className="text-gray-400">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Stores will appear here when they become available.'}
                  </p>
                </div>
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm('')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </CardContent>
          </AnimatedCard>
        )}

        {/* Stats Footer */}
        {stores.length > 0 && (
          <AnimatedCard delay={0.8} className="bg-black/40 border-white/10">
            <CardContent className="text-center py-6">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{formatNumber(stores.length)}</p>
                  <p className="text-sm text-gray-400">Stores Found</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {stores.reduce((sum, store) => sum + store.total_ratings, 0)}
                  </p>
                  <p className="text-sm text-gray-400">Total Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {stores.filter(s => s.user_rating).length}
                  </p>
                  <p className="text-sm text-gray-400">Your Ratings</p>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
}