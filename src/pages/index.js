import { Poppins } from 'next/font/google';
import Layout from '@/components/layout';
import RenderPageComponents from '@/components/content/generator';
import { useConfig } from '@/context/ConfigContext';
import { useEffect, useState } from 'react';

function Home({ siteConfig }) {
  const config = useConfig();

  const page = config?.pages?.find((page) => page.id === 'homepage');
  return (
    <div>
      {page && (
        <RenderPageComponents
          items={page?.components}
          siteConfig={siteConfig}
        />
      )}
    </div>
  );
}

export default Home;
