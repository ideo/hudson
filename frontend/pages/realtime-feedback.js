require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../style.scss';
import getConfig from 'next/config';
import Link from 'next/link';
import openSocket from 'socket.io-client';


const { publicRuntimeConfig } = getConfig();
const { BASE_API_URL } = publicRuntimeConfig;
const FEEDBACK_ENTRY_API_URL = `${BASE_API_URL}/feedbackentries`

class RealtimeFeedback extends Component {
  state = {
    hasSubmitted: false,
    prompt: '',
    promptId: null,
    response: ''
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


  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ response: value})
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { response, promptId: feedbackprompt } = this.state;
    fetch(FEEDBACK_ENTRY_API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        response,
        feedbackprompt
      })
    }).then(res => res.json())
    .then(res => {
      console.log('woohooo ', res);
      this.setState({ response: ''})
    })
    .catch(e => console.log('OH NO ', e));
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
    const { prompt, promptId, response } = this.state;
    return (
      <Layout>
        {notFound && <h1>Oops. Realtime feedback manager not found.</h1>}
        <h1>{prompt}</h1>
        <h3>{promptId}</h3>
        <form onSubmit={this.handleSubmit}>
          <textarea onChange={this.handleChange} value={response}>
          </textarea>
          <input type="submit" onClick={this.handleSubmit} />
        </form>
      </Layout>
    );
  }
}

export default RealtimeFeedback;