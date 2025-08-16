'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Z_CLASSES } from '@/lib/z-index';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { motion } from 'framer-motion';
import { Star, Mail, Lock, MapPin, User, UserPlus, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export function EnhancedRegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const loadingToastId = enhancedToast.loading('Creating your account...');
    setLoading(true);

    try {
      const result = await register(formData);

      enhancedToast.dismiss(loadingToastId);

      if (result.success) {
        enhancedToast.success('Account created successfully! Welcome aboard!');
        router.push('/dashboard');
      } else {
        enhancedToast.error(result.message || 'Registration failed');
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      enhancedToast.dismiss(loadingToastId);
      enhancedToast.error('Network error occurred');
      setError('Network error occurred');
    }

    setLoading(false);
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (password.length < 8) return { strength: 'weak', color: 'text-red-400' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { strength: 'strong', color: 'text-green-400' };
    }
    return { strength: 'medium', color: 'text-yellow-400' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="meteors"><Meteors number={25} /></div>
      
      {/* Floating Sparkles */}
      <div className="absolute inset-0 overflow-hidden sparkles">
        {[...Array(15)].map((_, i) => (
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
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          >
            <Sparkles className="h-3 w-3 text-purple-400" />
          </motion.div>
        ))}
      </div>

      {/* Main Registration Card */}
      <div className={`w-full max-w-lg relative ${Z_CLASSES.content} z-[2000]`} style={{zIndex: 2000}}>
        <BackgroundGradient className="rounded-[22px] p-1">
          <AnimatedCard className="bg-black/80 backdrop-blur-xl border-white/10 relative z-[2100]">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Join Store Rating
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg mt-2">
                  Create your account to start rating stores
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6"
              >
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
                    <p className="text-blue-400 font-medium">Regular User Account</p>
                  </div>
                  <p className="text-gray-300 text-sm">
                    You&apos;ll be able to browse stores, submit ratings, and manage your reviews.
                  </p>
                </div>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onSubmit={handleSubmit}
                className="space-y-6 signup-form relative z-[2200]"
                style={{zIndex: 2200}}
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm flex items-center"
                  >
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      minLength={3}
                      maxLength={60}
                      className={`pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20 relative z-[2300] ${
                        fieldErrors.name ? 'border-red-400' : ''
                      }`}
                      style={{zIndex: 2300, position: 'relative'}}
                    />
                  </div>
                  {fieldErrors.name ? (
                    <p className="text-xs text-red-400 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {fieldErrors.name}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Must be between 3-60 characters ({formData.name.length}/60)
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                      className={`pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20 relative z-[2300] ${
                        fieldErrors.email ? 'border-red-400' : ''
                      }`}
                      style={{zIndex: 2300, position: 'relative'}}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs text-red-400 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a strong password"
                      minLength={8}
                      maxLength={16}
                      className={`pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20 relative z-[2300] ${
                        fieldErrors.password ? 'border-red-400' : ''
                      }`}
                      style={{zIndex: 2300, position: 'relative'}}
                    />
                  </div>
                  {fieldErrors.password ? (
                    <p className="text-xs text-red-400 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {fieldErrors.password}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">
                        8-16 characters, must include uppercase letter and special character
                      </p>
                      {formData.password && (
                        <p className={`text-xs ${passwordStrength.color} flex items-center`}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Password strength: {passwordStrength.strength}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white font-medium">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full address"
                      maxLength={400}
                      className={`pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400/20 relative z-[2300] ${
                        fieldErrors.address ? 'border-red-400' : ''
                      }`}
                      style={{zIndex: 2300, position: 'relative'}}
                    />
                  </div>
                  {fieldErrors.address ? (
                    <p className="text-xs text-red-400 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {fieldErrors.address}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Maximum 400 characters ({formData.address.length}/400)
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-none text-white font-semibold py-3 text-lg relative z-[2400]" 
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
                    <UserPlus className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-400">Already have an account? </span>
                  <Link 
                    href="/auth/login" 
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </motion.form>
            </CardContent>
          </AnimatedCard>
        </BackgroundGradient>
      </div>
    </div>
  );
}