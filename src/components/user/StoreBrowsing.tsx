'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function StoreBrowsing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Stores</h1>
        <p className="text-gray-600">Discover stores and share your experiences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Stores</CardTitle>
          <CardDescription>Find stores to rate and review</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Store browsing functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}