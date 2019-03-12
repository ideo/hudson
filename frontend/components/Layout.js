/* /components/Layout.js */

import React from 'react';
import Head from 'next/head';

class Layout extends React.Component {
  constructor(props) {
    super(props);
  }
  static async getInitialProps({ req }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { children } = this.props;
    const title = "Hudson";
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <header>
        </header>
        <div style={{ height: '100vh', width: '100vw' }}>
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;