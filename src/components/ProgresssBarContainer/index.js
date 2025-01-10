import { useConfig } from '@/context/ConfigContext';
import NextNProgress from 'nextjs-progressbar';
export default function App({ Component, pageProps }) {
  const config = useConfig();
  return <NextNProgress color={config?.progressColor} />;
}
