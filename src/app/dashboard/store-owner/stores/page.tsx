'use client';

import { DashboardLayout } from '@/components/common/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  average_rating: number;
  rating_count: number;
}

export default function StoreOwnerStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/store-owner/stores', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStores(data.stores || []);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['store_owner']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center relative overflow-hidden">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent mb-4">My Stores</h2>
            <p className="text-xl text-gray-300">Manage your owned stores and view their performance</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-400 rounded-full" />
              <p className="text-gray-400 mt-4">Loading your stores...</p>
            </div>
          ) : stores.length === 0 ? (
            <Card className="bg-black/40 border-white/10">
              <CardContent className="text-center py-8">
                <p className="text-gray-300">No stores found. Contact an administrator to assign stores to your account.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <Card key={store.id} className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/20 hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{store.name}</CardTitle>
                    <CardDescription className="text-gray-300">{store.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Email:</span>
                        <span className="text-sm text-white">{store.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Average Rating:</span>
                        <div className="flex items-center">
                          {'★'.repeat(Math.floor(store.average_rating || 0))}
                          {'☆'.repeat(5 - Math.floor(store.average_rating || 0))}
                          <span className="ml-2 text-sm text-white">
                            ({(store.average_rating || 0).toFixed(1)}/5)
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Ratings:</span>
                        <span className="text-sm text-white">{store.rating_count || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}