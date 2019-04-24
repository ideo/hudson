/* _app.js */
import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";


export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Major+Mono+Display" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css?family=Roboto:500" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css?family=Domine" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css?family=Rajdhani" rel="stylesheet"></link>
          <link rel="manifest" href="/manifest.json" />
          <link rel="pwa-setup" href="/manifest.json" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Hudson by IDEO NY" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="apple-mobile-web-app-title" content="IDEO Hudson" />
          <link rel="apple-touch-icon" href="/icon-152x152.png" />
          <meta name="msapplication-TileImage" content="/icon-144x144.png" />
          <meta name="msapplication-TileColor" content="#d1987d" />
          <script async src="/pw-compat.js"></script>

        </Head>

        <Container>
          <Component {...pageProps} />
        </Container>
      </>
    );
  }
}