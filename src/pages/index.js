import { Poppins } from 'next/font/google';
import Layout from '@/components/layout';
import RenderPageComponents from '@/components/content/generator';

function Home({ theme }) {
  const page = theme?.pages?.find((page) => page.id === 'homepage');
  return (
    <Layout>
      {page && <RenderPageComponents items={page?.components} theme={theme} />}
    </Layout>
  );
}

export default Home;
