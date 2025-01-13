import { useConfig } from '@/context/ConfigContext';
import NextNProgress from 'nextjs-progressbar';
export default function App() {
  const config = useConfig();
  return <NextNProgress color={config?.progressColor} />;
}
