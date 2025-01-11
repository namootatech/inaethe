import Layout from '@/components/layout';
import { connect } from 'react-redux';
import Artifacts from '@/components/content/generator';
import { useConfig } from '@/context/ConfigContext';
import { useEffect, useState } from 'react';

const fetchConfig = async () => {
  try {
    console.log(
      '** [FETCH CONFIG] config path',
      process.env.NEXT_PUBLIC_CONFIG_LINK
    );

    let configPath = process.env.NEXT_PUBLIC_CONFIG_LINK;

    // If configPath is a relative path, prepend the base URL
    if (!configPath.startsWith('http')) {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      configPath = `${baseUrl}${
        configPath.startsWith('/') ? '' : '/'
      }${configPath}`;
    }

    const response = await fetch(configPath); // Use the resolved absolute URL
    if (!response.ok) throw new Error('Failed to fetch config');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching config:', error);
    return null; // Graceful fallback
  }
};

export async function getStaticProps({ params }) {
  const id = params.id;
  return { props: { id } };
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

function Page(props) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const getConfig = async () => {
      if (!config) {
        const configData = await fetchConfig();
        setConfig(configData);
      }
    };
    getConfig();
  }, []);

  let pageId = props.id;

  if (pageId === '') {
    pageId = 'homepage';
  }

  const page = config?.pages?.find((page) => page.id === pageId);
  console.log(
    '** [ID PAGE] Found config for organisation id: ',
    config?.organisationId
  );
  return (
    <Layout>
      <div className='container md:mt-4 md:px-16 px-4'>
        {page && <Artifacts items={page?.artifacts} />}
      </div>
    </Layout>
  );
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme,
  };
};

export default connect(mapStateToProps)(Page);
