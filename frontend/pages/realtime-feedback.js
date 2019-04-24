require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../realtime.scss';
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
    response: '',
    textcolor: '#000000',
    backgroundcolor: '#ffffff',
    imageUrl: null
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

  componentWillUnmount() {
    this.socket && this.socket.off('promptUpdate');
  }

  subscribeToRealtimeFeedbackManager(cb) {
    this.socket.on('promptUpdate', ({
      Prompt: prompt, id: promptId, textcolor, backgroundcolor, imageUrl
    }) => {
      // console.log('_____ promptId', promptId)
      this.setState({
        prompt,
        promptId,
        textcolor,
        backgroundcolor,
        imageUrl: `${BASE_API_URL}${imageUrl}`
      });
    });
    this.socket.emit('subscribeToRealtimeFeedbackManager', this.props.id); 
  }

  render() {
    const { notFound } = this.props;
    const { prompt, promptId, response, backgroundcolor, textcolor } = this.state;
    return (
      <Layout>
        {notFound && <h1>Oops. Realtime feedback manager not found.</h1>}
        <div className="container" style={{
          backgroundColor: backgroundcolor,
          color: textcolor
        }}>
        <div 
          className="card"
          style={{
            backgroundColor: backgroundcolor,
            color: textcolor

          }}>
          <footer 
            className="footer"
            style={{
              backgroundColor: textcolor,
              color: backgroundcolor
            }}>
            <h1 className="prompt">{prompt}</h1>
          </footer>
        </div>
        <form className="response-form" onSubmit={this.handleSubmit}>
          <textarea onChange={this.handleChange} value={response}>
          </textarea>
          <input type="submit" onClick={this.handleSubmit} />
        </form>
        </div>
        
      </Layout>
    );
  }
}

export default RealtimeFeedback;