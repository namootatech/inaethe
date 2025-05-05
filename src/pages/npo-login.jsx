'use client';

import Head from 'next/head';
import NpoLoginForm from '@/components/NpoLoginForm';
import { useAuth } from '@/context/AuthContext';

export default function NpoLoginPage() {
  const { user, logoutUser } = useAuth();

  if (user) {
    logoutUser();
  }

  return (
    <>
      <Head>
        <title>NPO Login | MyNPO Platform</title>
        <meta
          name='description'
          content='Login to your NPO account to manage your organization profile, services, and more.'
        />
      </Head>
      <main className='min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-gray-800 rounded-xl p-8 shadow-lg'>
          <div>
            <h2 className='mt-2 text-center text-3xl font-bold text-white'>
              NPO Login
            </h2>
            <p className='mt-2 text-center text-sm text-gray-400'>
              Access your organization's dashboard
            </p>
          </div>
          <NpoLoginForm />
        </div>
      </main>
    </>
  );
}
