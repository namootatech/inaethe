'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useConfig } from '@/context/ConfigContext';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  BookOpen,
  Shield,
  FileText,
  Users,
  Send,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const siteConfig = useConfig();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
    // Add your subscription logic here
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-${
        siteConfig?.colors?.primaryColor || 'primary'
      }-700 text-white dark:bg-gray-900 -mt-2`}
    >
      {/* <div className='w-full overflow-hidden'>
        <svg
          className='w-full h-12 text-background dark:text-gray-800 translate-y-1'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
          fill='currentColor'
        >
          <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'></path>
        </svg>
      </div> */}

      <div className='mx-auto w-full max-w-screen-xl px-4 py-12 lg:py-16'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4 md:grid-cols-2'>
          <div className='mb-6 md:mb-0'>
            <Link href='/' className='flex items-center mb-6'>
              {siteConfig?.logo ? (
                <img
                  src={siteConfig.logo || '/placeholder.svg'}
                  alt={`${siteConfig?.partnerName} logo`}
                  className='h-10 mr-3'
                />
              ) : (
                <Heart className='h-8 w-8 mr-2 text-white' />
              )}
              <span className='self-center text-2xl font-semibold whitespace-nowrap text-white'>
                {siteConfig?.partnerName}
              </span>
            </Link>
            <p className='text-gray-300 mb-4 max-w-xs'>
              {siteConfig?.description ||
                'Empowering communities through innovative solutions and dedicated service.'}
            </p>

            <div className='space-y-3 mt-6'>
              <div className='flex items-center'>
                <Mail className='h-5 w-5 mr-2 text-gray-300' />
                <a
                  href={`mailto:${
                    siteConfig?.contactEmail || 'info@example.com'
                  }`}
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  {siteConfig?.contactEmail || 'info@example.com'}
                </a>
              </div>
              <div className='flex items-center'>
                <Phone className='h-5 w-5 mr-2 text-gray-300' />
                <a
                  href={`tel:${siteConfig?.contactPhone || '+27123456789'}`}
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  {siteConfig?.contactPhone || '+27 12 345 6789'}
                </a>
              </div>
              <div className='flex items-start'>
                <MapPin className='h-5 w-5 mr-2 text-gray-300 mt-1 flex-shrink-0' />
                <span className='text-gray-300'>
                  {siteConfig?.address ||
                    '123 Main Street, Pretoria, South Africa'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className='mb-6 text-sm font-semibold uppercase text-white flex items-center'>
              <BookOpen className='h-5 w-5 mr-2' />
              Resources
            </h2>
            <ul className='text-gray-300 space-y-4'>
              <li>
                <Link
                  href='/'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <ArrowRight className='h-4 w-4 mr-2' />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='/about'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <ArrowRight className='h-4 w-4 mr-2' />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/artifacts'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <ArrowRight className='h-4 w-4 mr-2' />
                  Components
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <ArrowRight className='h-4 w-4 mr-2' />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='/npo-login'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <ArrowRight className='h-4 w-4 mr-2' />
                  NPO Login
                </Link>
              </li>
              <li>
                <Link
                  href='/faq'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <ArrowRight className='h-4 w-4 mr-2' />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='mb-6 text-sm font-semibold uppercase text-white flex items-center'>
              <Shield className='h-5 w-5 mr-2' />
              Legal
            </h2>
            <ul className='text-gray-300 space-y-4'>
              <li>
                <Link
                  href='/privacy-policy'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <FileText className='h-4 w-4 mr-2' />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <FileText className='h-4 w-4 mr-2' />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href='/cookies'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <FileText className='h-4 w-4 mr-2' />
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/accessibility'
                  className='hover:text-white transition-colors flex items-center'
                >
                  <Users className='h-4 w-4 mr-2' />
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='mb-6 text-sm font-semibold uppercase text-white flex items-center'>
              <Mail className='h-5 w-5 mr-2' />
              Subscribe to our newsletter
            </h2>
            <p className='text-gray-300 mb-4'>
              Stay updated with our latest news and announcements
            </p>
            <form
              onSubmit={handleSubscribe}
              className='flex flex-col space-y-2'
            >
              <div className='flex'>
                <Input
                  type='email'
                  placeholder='Your email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='rounded-r-none bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-white/30'
                />
                <Button
                  type='submit'
                  className='rounded-l-none bg-white text-primary-700 hover:bg-gray-200'
                >
                  <Send className='h-4 w-4' />
                </Button>
              </div>
              <p className='text-xs text-gray-400'>
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>

            <h2 className='mt-8 mb-4 text-sm font-semibold uppercase text-white'>
              Follow us
            </h2>
            <div className='flex space-x-4'>
              <a
                href={
                  siteConfig?.socialMedia?.facebook ||
                  'https://www.facebook.com/inaetheza'
                }
                className='text-gray-300 hover:text-white transition-colors'
                aria-label='Facebook'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Facebook className='h-6 w-6' />
              </a>
              <a
                href={siteConfig?.socialMedia?.twitter || '#'}
                className='text-gray-300 hover:text-white transition-colors'
                aria-label='Twitter'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Twitter className='h-6 w-6' />
              </a>
              <a
                href={siteConfig?.socialMedia?.instagram || '#'}
                className='text-gray-300 hover:text-white transition-colors'
                aria-label='Instagram'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Instagram className='h-6 w-6' />
              </a>
              <a
                href={siteConfig?.socialMedia?.linkedin || '#'}
                className='text-gray-300 hover:text-white transition-colors'
                aria-label='LinkedIn'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Linkedin className='h-6 w-6' />
              </a>
              <a
                href={siteConfig?.socialMedia?.youtube || '#'}
                className='text-gray-300 hover:text-white transition-colors'
                aria-label='YouTube'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Youtube className='h-6 w-6' />
              </a>
            </div>
          </div>
        </div>

        <hr className='my-8 border-gray-600' />

        <div className='sm:flex sm:items-center sm:justify-between'>
          <span className='text-sm text-gray-300'>
            © {currentYear}{' '}
            <Link
              href='https://inaethe.co.za'
              className='hover:text-white transition-colors'
              target='_blank'
              rel='noopener noreferrer'
            >
              Inaethe™
            </Link>
            . All Rights Reserved.
          </span>
          <div className='flex mt-4 items-center space-x-2 sm:mt-0 text-sm text-gray-300'>
            <span>Proudly South African</span>
            <img
              src='/vibrant-south-african-flag.png'
              alt='South African Flag'
              className='h-6 w-6'
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
