import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

export default function Logout() {
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    removeCookie('user');
    if(typeof window !== 'undefined') {
        window.location.href = '/';
    }
    return <Layout>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Head>
        <title>Logout</title>
        <meta name="description" content="Payment successful" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full flex items-center justify-center flex-col">
        <svg
          className="text-green-500 w-20 h-20 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
    </Layout>
}