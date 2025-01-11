import Navigation from '../navigation';
import Footer from '@/components/footer';
import { use } from 'marked';
import Head from 'next/head';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';

const Layout = ({ children }) => {
  const config = useConfig();
  return (
    <div>
      {config && (
        <>
          <Head>
            <title>{config?.partnerName}</title>
            <link rel='icon' href={config?.favicon.ico} sizes='any' />
            <link rel='icon' href={config?.favicon.appleTouch} sizes='any' />
            <link rel='icon' href={config?.favicon.size32} sizes='any' />
            <link rel='icon' href={config?.favicon.size16} sizes='any' />
            <link rel='icon' href={config?.favicon.size512} sizes='any' />
            <link rel='icon' href={config?.favicon.size192} sizes='any' />
          </Head>
          <Navigation />
          <main className='container mx-auto mt-20'>{children}</main>
          <Footer />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    theme: state.theme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveTheme: (theme) => dispatch({ type: 'SAVE_THEME', payload: theme }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
