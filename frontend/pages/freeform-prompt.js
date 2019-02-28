import Layout from '../components/Layout'
import React, { Component } from 'react';

class FreeformPrompt extends Component {
  static async getInitialProps({ query }) {
    return {
      promptId: query.id
    }
  }

  componentDidMount() {
    console.log('hello world');
  }

  render() {
    return (
      <Layout>
        { this.props.promptId }
      </Layout>
    ); 
  }
}

export default FreeformPrompt;