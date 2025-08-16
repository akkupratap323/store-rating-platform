'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, Store, Shield, BarChart3, ArrowRight, CheckCircle, Sparkles, Globe, Zap, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Z_CLASSES } from '@/lib/z-index';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Meteors number={30} />
      {/* Header */}
      <header className={`bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 ${Z_CLASSES.header}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Star className="h-8 w-8 text-blue-400" />
                <div className="absolute inset-0 h-8 w-8 text-blue-400 animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Store Rating Platform
              </span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex space-x-4"
            >
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:bg-white/10 border-white/20">
                  Sign In
                </Button>
              </Link>
              <BackgroundGradient className="rounded-[8px] p-[1px]">
                <Link href="/auth/register">
                  <Button className="bg-black text-white border-none hover:bg-gray-900">
                    Sign Up
                  </Button>
                </Link>
              </BackgroundGradient>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center">
          {/* Live Demo Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-8"
          >
            <Globe className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 font-medium">🚀 Live Demo Available</span>
            <Link href="https://store-rating-platform-three.vercel.app/" target="_blank" className="text-blue-300 hover:text-blue-200 underline">
              View Live App
            </Link>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6"
          >
            Rate and Discover
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Amazing Stores
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join our comprehensive platform to rate stores, discover new businesses, and help others make informed decisions. 
            Experience the power of community-driven reviews with beautiful analytics and real-time insights.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
          >
            <BackgroundGradient className="rounded-[12px] p-1">
              <Link href="/auth/register">
                <Button size="lg" className="bg-black text-white border-none px-8 py-4 text-lg font-semibold hover:bg-gray-900">
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Rating Stores
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </BackgroundGradient>
            
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-white/20 text-white hover:bg-white/10">
                <Zap className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center items-center space-x-8 text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Secure & Fast</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Role-based Access</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Platform Features
          </h2>
          <p className="text-lg text-gray-400">Everything you need to manage store ratings and reviews</p>
          <div className="flex justify-center mt-6">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedCard delay={0.8} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300">
            <CardHeader>
              <div className="relative mb-4">
                <Star className="h-8 w-8 text-blue-400" />
                <div className="absolute inset-0 h-8 w-8 text-blue-400 animate-ping opacity-75" />
              </div>
              <CardTitle className="text-white">Rate & Review Stores</CardTitle>
              <CardDescription className="text-gray-300">
                Submit ratings from 1-5 stars and help other customers make informed decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Easy-to-use rating system</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Search stores by name or address</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />View average ratings and reviews</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Update your ratings anytime</li>
              </ul>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.9} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20 hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300">
            <CardHeader>
              <div className="relative mb-4">
                <Store className="h-8 w-8 text-green-400" />
                <div className="absolute inset-0 h-8 w-8 text-green-400 animate-pulse" />
              </div>
              <CardTitle className="text-white">Store Management</CardTitle>
              <CardDescription className="text-gray-300">
                Store owners can manage their listings and view customer feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />View customer ratings and feedback</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Track store performance metrics</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Analyze rating trends</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Manage store information</li>
              </ul>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={1.0} className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20 hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300">
            <CardHeader>
              <div className="relative mb-4">
                <Shield className="h-8 w-8 text-purple-400" />
                <div className="absolute inset-0 h-8 w-8 text-purple-400 animate-bounce" />
              </div>
              <CardTitle className="text-white">Admin Dashboard</CardTitle>
              <CardDescription className="text-gray-300">
                Comprehensive administration tools for platform management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Manage users and roles</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Add and manage stores</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Platform statistics and analytics</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />User activity monitoring</li>
              </ul>
            </CardContent>
          </AnimatedCard>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="bg-gradient-to-r from-black/20 to-gray-900/40 py-16 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Three User Roles
            </h2>
            <p className="text-lg text-gray-400">Choose the role that fits your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCard delay={1.2} className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/20 text-center hover:from-blue-500/20 hover:to-blue-600/30">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <Users className="h-16 w-16 text-blue-400 mx-auto" />
                  <div className="absolute inset-0 h-16 w-16 text-blue-400 mx-auto animate-pulse opacity-50" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Regular User</h3>
                <p className="text-gray-300 mb-6">Rate stores, write reviews, and discover new places</p>
                <BackgroundGradient className="rounded-[8px] p-1">
                  <Button className="w-full bg-black text-white border-none hover:bg-gray-900">
                    Learn More
                  </Button>
                </BackgroundGradient>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={1.3} className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/20 text-center hover:from-green-500/20 hover:to-green-600/30">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <Store className="h-16 w-16 text-green-400 mx-auto" />
                  <div className="absolute inset-0 h-16 w-16 text-green-400 mx-auto animate-pulse opacity-50" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Store Owner</h3>
                <p className="text-gray-300 mb-6">Manage your store listings and view customer feedback</p>
                <BackgroundGradient className="rounded-[8px] p-1">
                  <Button className="w-full bg-black text-white border-none hover:bg-gray-900">
                    Learn More
                  </Button>
                </BackgroundGradient>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={1.4} className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/20 text-center hover:from-purple-500/20 hover:to-purple-600/30">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <BarChart3 className="h-16 w-16 text-purple-400 mx-auto" />
                  <div className="absolute inset-0 h-16 w-16 text-purple-400 mx-auto animate-pulse opacity-50" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Administrator</h3>
                <p className="text-gray-300 mb-6">Full platform management and analytics</p>
                <BackgroundGradient className="rounded-[8px] p-1">
                  <Button className="w-full bg-black text-white border-none hover:bg-gray-900">
                    Learn More
                  </Button>
                </BackgroundGradient>
              </CardContent>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already using our platform to discover and rate amazing stores.
          </p>
          
          {/* Live Demo Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
            className="mb-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-2xl backdrop-blur-sm"
          >
            <Globe className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">🚀 Live Demo Available</h3>
            <p className="text-gray-300 mb-4">Experience the full platform with all features deployed on Vercel</p>
            <Link href="https://store-rating-platform-three.vercel.app/" target="_blank">
              <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                <Rocket className="h-4 w-4 mr-2" />
                View Live Application
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <BackgroundGradient className="rounded-[12px] p-1">
              <Link href="/auth/register">
                <Button size="lg" className="bg-black text-white border-none px-10 py-4 text-lg font-semibold hover:bg-gray-900">
                  <Users className="h-5 w-5 mr-2" />
                  Create Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </BackgroundGradient>
            
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-white/20 text-white hover:bg-white/10">
                <Star className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="text-center"
          >
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="relative">
                <Star className="h-6 w-6 text-blue-400" />
                <div className="absolute inset-0 h-6 w-6 text-blue-400 animate-pulse" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Store Rating Platform
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              A comprehensive platform for store ratings and reviews with modern UI/UX
            </p>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <span className="text-sm text-gray-500">Built with</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Next.js</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">PostgreSQL</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">TypeScript</span>
              </div>
            </div>
            <Link href="https://store-rating-platform-three.vercel.app/" target="_blank" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300">
              <Globe className="h-4 w-4 mr-1" />
              Live Demo on Vercel
            </Link>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
