import Layout from '../components/Layout'
import React, { Component } from 'react';
import axios from 'axios';

class FreeformPrompt extends Component {
  static async getInitialProps({ query }) {
    // TODO: account for case without query ID
    const BASE_API_URL = 'http://localhost:1337/freeformprompts';
    let response = { data: '' };
    let notFound = false;
    try {
      response = await axios.get(`${BASE_API_URL}/${query.id}`);
    } catch(e) {
      console.log('woops - something went wrong');
      notFound = true;
    }

    return {
      data: response.data,
      notFound
    };
  }

  componentDidMount() {
    console.log('hello world');
  }

  render() {
    const { notFound, data } = this.props
    return (
      <Layout>
        { notFound && <h1>Woops. Prompt does not exist.</h1> }
        { !notFound && data.provocation }
      </Layout>
    ); 
  }
}

export default FreeformPrompt;