require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../style.scss';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { BASE_API_URL } = publicRuntimeConfig;

class Display extends Component {
  state = {
  };

  static async getInitialProps({ query }) {
    
    
    return {
      
    };
  }

  constructor(props) {
    super(props);
    
  }
  
  componentDidMount() {
    
  }

  componentWillUnMount() {
    
  }




  render() {
    return (
      <Layout>
        Oh shit whaddup.
      </Layout>
    );
  }
}

export default Display;