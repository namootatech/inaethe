'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useConfig } from '@/context/ConfigContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Lock,
  Mail,
  Shield,
  Users,
} from 'lucide-react';

export default function SignIn() {
  const auth = useAuth();
  const siteConfig = useConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await auth.loginUser({ email, password });
      toast.success("Welcome back! You've successfully signed in.");
      router.push('/app');
    } catch (error) {
      toast.error(
        `Sign in failed. ${
          error.message || 'Please check your credentials and try again.'
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen relative h-full dark:from-gray-900 dark:to-gray-800'
      style={{
        backgroundImage: "url('/bgloginblur.jpg')",
        backgroundSize: 'cover',
      }}
    >
      <div className='absolute inset-0 z-0 bg-gray-900/50 h-full'></div>
      <div className='z-10 relative container mx-auto px-4 py-8 md:py-12'>
        {/* Header */}
        <header className='mb-8 text-center'>
          <div className='mx-auto mb-4 h-12 w-12 rounded-full bg-pink-100 p-2 dark:bg-pink-900/20'>
            <div className='h-full w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-600'></div>
          </div>
          <h1 className='mb-2   text-3xl font-bold tracking-tight text-gray-100 dark:text-white md:text-4xl'>
            Welcome to Inaethe
          </h1>
          <p className='mx-auto max-w-2xl text-gray-100 dark:text-gray-300 '>
            Sign in to access your account and continue making a difference in
            your community
          </p>
        </header>

        <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-5 lg:gap-12'>
          {/* Left Column - Sign In Form */}
          <div className='md:col-span-2'>
            <Card className='border-0 bg-white shadow-xl dark:bg-gray-800'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Sign In
                </CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-300'>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                    <label
                      htmlFor='email'
                      className='text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Email Address
                    </label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400' />
                      <Input
                        id='email'
                        type='email'
                        placeholder='you@example.com'
                        required
                        className='pl-10'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <label
                        htmlFor='password'
                        className='text-sm font-medium text-gray-700 dark:text-gray-300'
                      >
                        Password
                      </label>
                      <Link
                        href='/forgot-password'
                        className='text-xs text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300'
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400' />
                      <Input
                        id='password'
                        type='password'
                        placeholder='••••••••'
                        required
                        className='pl-10'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type='submit'
                    className='w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-90'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className='flex items-center justify-center'>
                        <svg
                          className='mr-2 h-4 w-4 animate-spin'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                            fill='none'
                          />
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className='flex items-center justify-center'>
                        Sign In <ArrowRight className='ml-2 h-4 w-4' />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Information */}
          <div className='md:col-span-3'>
            <div className='space-y-8'>
              {/* Hero Section */}
              <div className='rounded-xl bg-white shadow-4xl p-6'>
                <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>
                  Making a Difference Together
                </h2>
                <p className='mb-4 text-gray-900 dark:text-gray-900'>
                  Inaethe connects generous donors with organizations fighting
                  hunger in communities across South Africa. By signing in,
                  you'll gain access to your personalized dashboard where you
                  can track your impact, manage your donations, and connect with
                  the causes you care about.
                </p>
                <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                  <div className='flex items-start space-x-3 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800'>
                    <Users className='h-5 w-5 text-pink-500' />
                    <div>
                      <h3 className='font-medium text-gray-900 dark:text-white'>
                        Community Impact
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Join thousands of donors making a difference in
                        communities across South Africa.
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800'>
                    <Shield className='h-5 w-5 text-pink-500' />
                    <div>
                      <h3 className='font-medium text-gray-900 dark:text-white'>
                        Secure Platform
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Your information is protected with enterprise-grade
                        security and encryption.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div>
                <h2 className='mb-4 text-xl font-bold text-gray-200 dark:text-white'>
                  Why Join Inaethe?
                </h2>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                    <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/20'>
                      <CheckCircle className='h-5 w-5 text-pink-500' />
                    </div>
                    <h3 className='mb-1 font-medium text-gray-900 dark:text-white'>
                      Track Your Impact
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      See exactly how your donations are making a difference
                      with detailed impact reports and updates.
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                    <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/20'>
                      <CheckCircle className='h-5 w-5 text-pink-500' />
                    </div>
                    <h3 className='mb-1 font-medium text-gray-900 dark:text-white'>
                      Connect with Organizations
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Build relationships with the organizations you support and
                      see their work firsthand.
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                    <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/20'>
                      <CheckCircle className='h-5 w-5 text-pink-500' />
                    </div>
                    <h3 className='mb-1 font-medium text-gray-900 dark:text-white'>
                      Manage Donations
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Easily manage your recurring donations, update payment
                      methods, and access tax receipts.
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
                    <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/20'>
                      <CheckCircle className='h-5 w-5 text-pink-500' />
                    </div>
                    <h3 className='mb-1 font-medium text-gray-900 dark:text-white'>
                      Community Events
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Get invited to exclusive volunteer opportunities and
                      community events near you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50'>
                <div className='flex items-center space-x-3'>
                  <HelpCircle className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    Need Help?
                  </h3>
                </div>
                <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                  If you're having trouble signing in or have questions about
                  your account, our support team is here to help. Contact us at{' '}
                  <a
                    href='mailto:support@skhumbafooddrive.org'
                    className='text-pink-600 hover:underline dark:text-pink-400'
                  >
                    support@inaethe.co.za
                  </a>{' '}
                  or call us at{' '}
                  <a
                    href='tel:+27123456789'
                    className='text-pink-600 hover:underline dark:text-pink-400'
                  >
                    +27 60 311 6777
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
