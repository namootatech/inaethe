import '@/styles/globals.css';

import { ConfigProvider } from '@/context/ConfigContext';
import { EventHandlersProvider } from '@/context/EventHandlers';
import { ToastContainer, toast } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext';
import { Suspense } from 'react';
import Script from 'next/script';
import { hotjar } from 'react-hotjar';
import { useEffect } from 'react';
import * as gtag from '@/lib/gtag';
import { useRouter } from 'next/router';
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    hotjar.initialize(3906314, 6);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <AuthProvider>
      <ConfigProvider>
        <EventHandlersProvider>
          <ToastContainer />
          <Component {...pageProps} />
        </EventHandlersProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}
export default (props) => {
  <Suspense fallback={<>Loading...</>}>
    <MyApp {...props} />
  </Suspense>;
};
