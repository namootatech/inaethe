import '@/styles/globals.css';
import { ConfigProvider } from '@/context/ConfigContext';
import { EventHandlersProvider } from '@/context/EventHandlers';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext';
import { hotjar } from 'react-hotjar';
import { useEffect } from 'react';
import * as gtag from '@/lib/gtag';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import Layout from '@/components/layout';
import AppLayout from '@/components/app/layout';
import { usePathname } from 'next/navigation';
import { ApiProvider } from '@/context/ApiContext';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
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

  const pathname = usePathname();
  const RouteLayout = pathname.includes('app') ? AppLayout : Layout;

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <ApiProvider>
        <AuthProvider>
          <ConfigProvider>
            <EventHandlersProvider>
              <RouteLayout>
                <ToastContainer />
                <Component {...pageProps} />
                <Toaster position='top-right' />
              </RouteLayout>
            </EventHandlersProvider>
          </ConfigProvider>
        </AuthProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}
