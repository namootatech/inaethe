import Link from 'next/link';
import { useState } from 'react';
import React from 'react';
import { useConfig } from '@/context/ConfigContext';
import { useAuth } from '@/context/AuthContext';

const Navigation = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const config = useConfig();
  return (
    <nav className='bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <Link
          href='/'
          className='flex items-center space-x-3 rtl:space-x-reverse'
        >
          <img src={config?.brand?.logo} className='h-8' alt='Flowbite Logo' />
          <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
            {config?.partnerName}
          </span>
        </Link>
        <div className='flex md:order-2'>
          {user && (
            <>
              <Link
                href='/app'
                className='hidden md:block text-white bg-black hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  text-xl px-4 py-2 text-center ml-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Dashboard
              </Link>
              <Link
                href='/logout'
                className='hidden md:block text-white bg-black hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  text-xl px-4 py-2 text-center ml-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Logout
              </Link>
            </>
          )}
          {!user && (
            <>
              <Link
                type='button'
                href='/register'
                className={`text-white bg-${config.colors.primaryColorCode} hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg  text-xl px-4 py-2 text-center mr-3 md:mr-0 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800`}
              >
                Get started
              </Link>
              <Link
                type='button'
                href='/signin'
                className='text-white bg-black hover:bg-red-800 hidden md:block focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  text-xl px-4 py-2 text-center ml-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Login
              </Link>
            </>
          )}
          <button
            data-collapse-toggle='navbar-sticky'
            type='button'
            className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-sticky'
            aria-expanded='false'
            onClick={toggleIsOpen}
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 1h15M1 7h15M1 13h15'
              />
            </svg>
          </button>
        </div>
        <div
          className={` ${
            isOpen ? '' : 'hidden'
          } items-center justify-between  w-full md:flex md:w-auto md:order-1`}
          id='navbar-sticky'
        >
          {config && (
            <ul className='md:bg-transparent sm:bg-transparent  flex p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 flex-col'>
              {config.pages.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/p/${p.id}`}
                    className={config?.nav.burgerMenu?.link?.inactiveClass}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href='/blog'
                  className={config?.nav.burgerMenu?.link?.inactiveClass}
                >
                  Blog
                </Link>
              </li>
              <Link
                type='button'
                href='/signin'
                className='md:hidden block text-white bg-black hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  text-xl px-4 py-2 text-center ml-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Login
              </Link>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
