'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Z_CLASSES } from '@/lib/z-index';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { motion } from 'framer-motion';
import { Star, Mail, Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';

export function EnhancedLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const loadingToastId = enhancedToast.loading('Signing you in...');
    setLoading(true);

    try {
      const result = await login(email, password);

      enhancedToast.dismiss(loadingToastId);

      if (result.success) {
        enhancedToast.success('Welcome back! Successfully signed in.');
        router.push('/dashboard');
      } else {
        enhancedToast.error(result.message || 'Login failed');
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      enhancedToast.dismiss(loadingToastId);
      enhancedToast.error('Network error occurred');
      setError('Network error occurred');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="meteors"><Meteors number={30} /></div>
      
      {/* Floating Sparkles */}
      <div className="absolute inset-0 overflow-hidden sparkles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0.3
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
          </motion.div>
        ))}
      </div>

      {/* Main Login Card */}
      <div className={`w-full max-w-md relative ${Z_CLASSES.modalContent} z-[2000]`} style={{zIndex: 2000}}>
        <BackgroundGradient className="rounded-[22px] p-1">
          <AnimatedCard className="bg-black/80 backdrop-blur-xl border-white/10 relative z-[2100]" style={{zIndex: 2100}}>
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg mt-2">
                  Sign in to your Store Rating account
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                onSubmit={handleSubmit}
                className={`space-y-6 relative ${Z_CLASSES.modalContent} z-[2200] login-form`}
                style={{zIndex: 2200}}
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-white font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 relative z-[2300]"
                      style={{zIndex: 2300, position: 'relative'}}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-white font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 relative z-[2300]"
                      style={{zIndex: 2300, position: 'relative'}}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none text-white font-semibold py-3 text-lg relative z-[2400]" 
                  style={{zIndex: 2400, position: 'relative'}}
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <LogIn className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-400">Don't have an account? </span>
                  <Link 
                    href="/auth/register" 
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors inline-flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Sign up as a user
                  </Link>
                </div>

                {/* Demo Accounts */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <h4 className="text-white font-medium mb-3 text-center">Demo Accounts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Admin:</span>
                      <span className="text-blue-400">admin@storerating.com / Admin123!</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Store Owner:</span>
                      <span className="text-green-400">storeowner@demo.com / StoreOwner123!</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>User:</span>
                      <span className="text-purple-400">user@demo.com / NormalUser123!</span>
                    </div>
                  </div>
                </motion.div>
              </motion.form>
            </CardContent>
          </AnimatedCard>
        </BackgroundGradient>
      </div>
    </div>
  );
}