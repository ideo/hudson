require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../style.scss';
import getConfig from 'next/config';
import Link from 'next/link';
import openSocket from 'socket.io-client';


const { publicRuntimeConfig } = getConfig();
const { BASE_API_URL } = publicRuntimeConfig;


class RealtimeFeedback extends Component {
  state = {
    hasSubmitted: false,
    prompt: '',
    promptId: null
  };

  socket = null;

  static async getInitialProps({ query }) {
    // TODO: account for case without query ID
    let response = {};
    let notFound = false;
    if (!query.id) {
      notFound = true;
    }
    return {
      data: response,
      id: query.id,
      notFound
    };
  }

  constructor(props) {
    super(props);
  }
  
  componentWillMount() {    
    this.socket = openSocket(BASE_API_URL);
    this.subscribeToRealtimeFeedbackManager()
  }

  componentDidMount() {
    
  }

  componentWillUnMount() {
    
  }

  subscribeToRealtimeFeedbackManager(cb) {
    this.socket.on('promptUpdate', ({Prompt: prompt, promptId}) => {
      this.setState({
        prompt,
        promptId
      });
    });
    this.socket.emit('subscribeToRealtimeFeedbackManager', this.props.id); 
  }

  render() {
    const { notFound } = this.props;
    const { prompt, promptId } = this.state;
    return (
      <Layout>
        {notFound && <h1>Oops. Realtime feedback manager not found.</h1>}
        <h1>{prompt}</h1>
        <h3>{promptId}</h3>
      </Layout>
    );
  }
}

export default RealtimeFeedback;