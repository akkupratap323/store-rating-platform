'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, Store, Shield, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Z_CLASSES } from '@/lib/z-index';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className={`bg-white/80 backdrop-blur-sm border-b sticky top-0 ${Z_CLASSES.header}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Store Rating Platform</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Rate and Discover Amazing Stores
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our comprehensive platform to rate stores, discover new businesses, and help others make informed decisions. 
            Sign up as a regular user to start rating stores, or contact an administrator for store owner/admin access.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="px-8 py-3">
                Sign Up as User
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p className="text-lg text-gray-600">Everything you need to manage store ratings and reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Star className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Rate & Review Stores</CardTitle>
              <CardDescription>
                Submit ratings from 1-5 stars and help other customers make informed decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Easy-to-use rating system</li>
                <li>• Search stores by name or address</li>
                <li>• View average ratings and reviews</li>
                <li>• Update your ratings anytime</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Store className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Store Management</CardTitle>
              <CardDescription>
                Store owners can manage their listings and view customer feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• View customer ratings and feedback</li>
                <li>• Track store performance metrics</li>
                <li>• Analyze rating trends</li>
                <li>• Manage store information</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Comprehensive administration tools for platform management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Manage users and roles</li>
                <li>• Add and manage stores</li>
                <li>• Platform statistics and analytics</li>
                <li>• User activity monitoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Three User Roles</h2>
            <p className="text-lg text-gray-600">Choose the role that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Regular User</h3>
              <p className="text-gray-600 mb-4">Rate stores, write reviews, and discover new places</p>
              <Button variant="outline" className="w-full">Learn More</Button>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <Store className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Store Owner</h3>
              <p className="text-gray-600 mb-4">Manage your store listings and view customer feedback</p>
              <Button variant="outline" className="w-full">Learn More</Button>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Administrator</h3>
              <p className="text-gray-600 mb-4">Full platform management and analytics</p>
              <Button variant="outline" className="w-full">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of users who are already using our platform to discover and rate amazing stores.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/auth/register">
            <Button size="lg" className="px-8 py-3">
              Create Account
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="px-8 py-3">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-semibold">Store Rating Platform</span>
            </div>
            <p className="text-gray-400 mb-4">
              A comprehensive platform for store ratings and reviews
            </p>
            <p className="text-sm text-gray-500">
              Built with Next.js, PostgreSQL, and modern web technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
