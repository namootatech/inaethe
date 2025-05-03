'use client';

import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { useApi } from '@/context/ApiContext';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';

export default function RefPage() {
  const router = useRouter();
  const { id } = router.query;

  const api = useApi();
  const auth = useAuth();

  const hasRunRef = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure id exists and the effect hasn't run yet
    if (!id || hasRunRef.current) return;

    hasRunRef.current = true; // Set immediately to prevent any re-entry

    const run = async () => {
      try {
        setLoading(true);
        const linkOwner = await api.getLinkOwner(id);
        console.log('Link owner:', linkOwner);
        await auth.saveParent(linkOwner.data.userId);
        await api.incrementLinkVisits(id);

        // Optional: add slight delay before routing
        setTimeout(() => {
          router.push('/register');
        }, 3000);
      } catch (err) {
        console.error('Error loading referral page:', err);
        setLoading(false);
      }
    };

    run();
  }, [id]);

  return (
    <>
      <Head>
        <title>Donatations for impact and sustainability</title>
      </Head>
      <div className='min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 flex flex-col items-center justify-center p-4'>
        <div className='max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='bg-gradient-to-r from-green-500 to-yellow-400 h-2'></div>

          <div className='p-6 sm:p-8'>
            <div className='flex justify-center mb-6'>
              {/* Logo placeholder - replace with your actual logo */}
              <div className='h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-yellow-400 flex items-center justify-center text-white font-bold text-xl'>
                I
              </div>
            </div>

            <h1 className='text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4'>
              Welcome to Inaethe Donations
            </h1>

            <p className='text-gray-600 text-center mb-6'>
              You're about to join a platform where you can make a difference
              while earning rewards.
            </p>

            <div className='bg-green-50 rounded-lg p-4 mb-6'>
              <h2 className='font-semibold text-green-700 mb-2'>
                What you can do here:
              </h2>
              <ul className='space-y-2'>
                <li className='flex items-start'>
                  <div className='flex-shrink-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5'>
                    <svg
                      className='h-3 w-3 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='3'
                        d='M5 13l4 4L19 7'
                      ></path>
                    </svg>
                  </div>
                  <span className='ml-2 text-gray-700'>
                    Make donations to causes you care about
                  </span>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5'>
                    <svg
                      className='h-3 w-3 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='3'
                        d='M5 13l4 4L19 7'
                      ></path>
                    </svg>
                  </div>
                  <span className='ml-2 text-gray-700'>
                    Refer friends and family to join the platform
                  </span>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5'>
                    <svg
                      className='h-3 w-3 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='3'
                        d='M5 13l4 4L19 7'
                      ></path>
                    </svg>
                  </div>
                  <span className='ml-2 text-gray-700'>
                    Earn income through our referral program
                  </span>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5'>
                    <svg
                      className='h-3 w-3 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='3'
                        d='M5 13l4 4L19 7'
                      ></path>
                    </svg>
                  </div>
                  <span className='ml-2 text-gray-700'>
                    Create meaningful impact in communities
                  </span>
                </li>
              </ul>
            </div>

            <div className='text-center text-gray-600 mb-4'>
              <p>You'll be redirected to registration in a moment...</p>
            </div>

            {/* Loading animation */}
            <div className='flex justify-center items-center'>
              <div className='relative'>
                <div className='h-12 w-12 rounded-full border-t-4 border-b-4 border-green-500 animate-spin'></div>
                <div
                  className='absolute top-0 left-0 h-12 w-12 rounded-full border-t-4 border-b-4 border-yellow-400 animate-spin'
                  style={{ animationDirection: 'reverse', opacity: 0.7 }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <p className='mt-6 text-sm text-gray-500 text-center'>
          By continuing, you agree to Inaethe's Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </>
  );
}
