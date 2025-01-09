import { Inter } from 'next/font/google';
import Layout from '@/components/layout';
import Artifacts from '@/components/content/generator';

function Home({ theme }) {
  const page = theme?.pages?.find((page) => page.id === 'homepage');
  return (
    <Layout>
      {page && <Artifacts items={page?.artifacts} theme={theme} />}
    </Layout>
  );
}

export default Home;
