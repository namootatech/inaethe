import Navigation from "../navigation";
import Footer from "@/components/footer";
import { use } from "marked";
import Head from 'next/head'
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { getThemeConfig } from "@/themes"


const Layout = ({ children, saveTheme, theme }) => {
  useEffect(() => {
    saveTheme(getThemeConfig());
  }, []);

  return (
    <div>
      {theme && (
        <>
          <Head>
            <title>{theme?.partnerName}</title>
            <link rel="icon" href={`/images/${theme?.themeName}/favicon/favicon.ico`} sizes="any" />
            <link rel="icon" href={`/images/${theme?.themeName}/favicon/apple-touch-icon.png`} sizes="any" />
            <link rel="icon" href={`/images/${theme?.themeName}/favicon/favicon-32x32.png`} sizes="any" />
            <link rel="icon" href={`/images/${theme?.themeName}/favicon/favicon-16x16.png`} sizes="any" />
            <link rel="icon" href={`/images/${theme?.themeName}/favicon/android-chrome-512x512.png`} sizes="any" />
            <link rel="icon" href={`/images/${theme?.themeName}/favicon/android-chrome-192x192.png`} sizes="any" />
          </Head>
          <Navigation />
          <main className="container mx-auto mt-20">{children}</main>
          <Footer />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    theme: state.theme
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveTheme: (theme) => dispatch({ type: 'SAVE_THEME', payload: theme })
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
