import Navigation from '../navigation';
import Footer from '@/components/footer';
import { use } from 'marked';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

const Layout = ({ children }) => {
  const config = useConfig();
  return (
    <div>
      {config && (
        <>
          <Head>
            <title>{config?.partnerName}</title>
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1'
            />
            <meta name='description' content={config?.about} />
            <meta
              name='keywords'
              content='Non profit organisation, donation platform, platform for impact, platform to donate, website donations'
            />
            <meta name='author' content={config?.partnerName} />
            <meta name='og:image' content='https://inaethe.co.za/ogimage.png' />
            <meta name='og:url' content='https://inaethe.co.za/' />
            <meta name='og:title' content={config?.partnerName} />
            <meta name='og:description' content={config?.about} />
            <meta name='og:type' content='website' />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:site' content='@inaethe' />
            <meta name='twitter:title' content={config?.partnerName} />
            <meta name='twitter:description' content={config?.about} />
            <meta
              name='twitter:image'
              content='https://inaethe.co.za/ogimage.png'
            />
            <meta name='twitter:creator' content='@inaethe' />
            <meta name='twitter:site' content='@inaethe' />
            <meta name='twitter:domain' content='inaethe.co.za' />
            <link rel='canonical' href='https://inaethe.co.za/' />
            <link rel='icon' href={config?.favicon?.ico} sizes='any' />
            <link rel='icon' href={config?.favicon?.appleTouch} sizes='any' />
            <link rel='icon' href={config?.favicon?.size32} sizes='any' />
            <link rel='icon' href={config?.favicon?.size16} sizes='any' />
            <link rel='icon' href={config?.favicon?.size512} sizes='any' />
            <link rel='icon' href={config?.favicon?.size192} sizes='any' />
          </Head>
          <Navigation />
          <main className='w-screen md:w-full mt-20'>{children}</main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;
