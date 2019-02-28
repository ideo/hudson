/* /components/Layout.js */

import React from "react";
import Head from "next/head";

import { Container } from "reactstrap";

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
    const title = "Freeform Prompt";
    return (
      <div>
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
        <Container>{children}</Container>
      </div>
    );
  }
}

export default Layout;