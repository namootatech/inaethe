import '@/styles/globals.css';

import { Provider } from 'react-redux';
import store from '@/store';
import Script from 'next/script';
import { hotjar } from 'react-hotjar';
import { useEffect } from 'react';
import * as gtag from '@/lib/gtag';
import { useRouter } from 'next/router';
import { CookiesProvider } from 'react-cookie';
import { ConfigProvider } from '@/context/ConfigContext';
import ProgressBarContainer from '@/components/ProgresssBarContainer';
import { EventHandlersProvider } from '@/context/EventHandlers';
import { ToastContainer, toast } from 'react-toastify';
export default function MyApp({ Component, pageProps }) {
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
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
   window.dataLayer = window.dataLayer || [];
   function gtag(){dataLayer.push(arguments);}
   gtag('js', new Date());
   gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');`,
        }}
      ></script>
      <Provider store={store}>
        <ConfigProvider>
          <EventHandlersProvider>
            <CookiesProvider defaultSetOptions={{ path: '/' }}>
              <ProgressBarContainer />
              <ToastContainer />
              <Component {...pageProps} />
            </CookiesProvider>
          </EventHandlersProvider>
        </ConfigProvider>
      </Provider>
    </>
  );
}
