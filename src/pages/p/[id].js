import Layout from '@/components/layout';
import RenderPageComponents from '@/components/content/generator';
import { useConfig } from '@/context/ConfigContext';
import { useEffect, useState } from 'react';

const fetchConfig = async () => {
  try {
    console.log(
      '** [FETCH CONFIG] config path',
      process.env.NEXT_PUBLIC_CONFIG_NAME
    );

    let configPath = process.env.NEXT_PUBLIC_CONFIG_NAME;

    // If configPath is a relative path, prepend the base URL
    if (!configPath.startsWith('http')) {
      const baseUrl =
        process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';
      configPath = `${baseUrl}${
        configPath.startsWith('/') ? '' : '/'
      }${configPath}`;
    }
    console.log('pulling from', configPath);
    // Attempt to fetch the config file
    const response = await fetch(configPath);
    if (!response.ok) throw new Error('Failed to fetch config from URL');

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(
      'Error fetching config from URL, falling back to local import:',
      error
    );

    // Fallback to importing directly from the public folder
    try {
      const localConfig = await import(
        `../../../public/siteConfigs/${process.env.NEXT_PUBLIC_CONFIG_NAME}`
      );
      return localConfig.default || localConfig; // Ensure compatibility with module systems
    } catch (importError) {
      console.error('Error importing local config:', importError);
      return null; // Graceful fallback
    }
  }
};

export async function getStaticProps({ params }) {
  const config = await fetchConfig();
  let id = params.id;
  const page = config?.pages?.find((page) => page.id === id);
  if (!id) {
    return {
      notFound: true,
    };
  }
  if (id === '') {
    id = 'homepage';
  }

  console.log(
    '** [ID PAGE] Found config for organisation id: ',
    config?.organisationId
  );
  return {
    props: { id, page },
  };
}

export async function getStaticPaths() {
  const config = await fetchConfig();
  console.log(
    '** [STATIC PATHS] Found config for organisation id: ',
    config?.organisationId
  );
  let paths = config?.pages?.map((p) => ({ params: { id: p.id } }));
  return {
    paths,
    fallback: false,
  };
}

function Page({ page, id }) {
  return (
    <div>
      {page.type === 'centered-color-page' ? (
        <div
          className={`min-h-screen bg-${page.colorCode} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}
        >
          {page && <RenderPageComponents items={page?.components} />}
        </div>
      ) : (
        <div className='w-full md:mt-4'>
          {page && <RenderPageComponents items={page?.components} />}
        </div>
      )}
    </div>
  );
}

export default Page;
