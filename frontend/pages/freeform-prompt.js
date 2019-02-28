import Layout from '../components/Layout'
import React, { Component } from 'react';
import axios from 'axios';

class FreeformPrompt extends Component {
  static async getInitialProps({ query }) {
    // TODO: account for case without query ID
    const BASE_API_URL = 'http://localhost:1337/freeformprompts';
    const { data } = await axios.get(`${BASE_API_URL}/${query.id}`);
    return {
      data
    };
  }

  componentDidMount() {
    console.log('hello world');
  }

  render() {
    return (
      <Layout>
        { this.props.data.provocation }
      </Layout>
    ); 
  }
}

export default FreeformPrompt;