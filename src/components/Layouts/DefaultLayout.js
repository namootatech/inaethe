import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/SideBar';
import Header from '@/components/header/dashboard';

import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

function DefaultLayout({ children }) {
  const { setUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = {}; //Cookies.get('user');
      if (!user) {
        router.push('/login');
      } else if (user) {
        const userObj = JSON.parse(user);
        console.log('User data', userObj);
        const API_URL = process.env.NEXT_PUBLIC_API_URL + '/login';
        console.log(API_URL);
        fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: user,
        })
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            if (response.error) {
            } else {
              console.log('You have successfully loggedin.');
              setUser(response.data);

              console.log('User data', response.data);
            }
          })
          .catch((error) => {
            alert('Error:', error);
          });
      }
    }
  }, []);

  return (
    <div>
      <div className='flex h-screen overflow-hidden'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
