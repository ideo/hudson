require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../style.scss';
import getConfig from 'next/config';
import openSocket from 'socket.io-client';

const { publicRuntimeConfig } = getConfig();
const { BASE_API_URL } = publicRuntimeConfig;
const PROMPTS_API_URL = `${BASE_API_URL}/freeformprompts`;

class Display extends Component {
  state = {
    transcription: 'No messages received yet. This is placeholder.'
  };

  static async getInitialProps({ query }) {
    let response = {};
    let notFound = false;

    try {
      response = await fetch(`${PROMPTS_API_URL}/${query.id}`).then(response => response.json());
    } catch(e) {
      console.log('woops - something went wrong', e);
      notFound = true;
    }
    
    return {
      data: response,
      notFound
    };
  }

  constructor(props) {
    super(props);
    this.socket = null;
  }

  componentWillMount() {
    this.socket = openSocket('http://localhost:1337');
  }

  subscribeToTimer(cb) {
    const { displaytimeout } = this.props.data;
    console.log('displaytimeout is ', displaytimeout);
    this.socket.on('timer', message => cb(null, message));
    this.socket.emit('subscribeToTimer', (displaytimeout * 1000)); // In seconds
  }
  
  componentDidMount() {
    this.subscribeToTimer((err, transcription) => {
      if(err) return;
      this.setState({
        transcription
      });
    })
  }

  componentWillUnMount() {
    
  }


  render() {
    const { notFound } = this.props;
    const { transcription } = this.state;
    return (
      <Layout>
        {notFound && <h1>Ah nuts. Couln't find the related prompt. Check the URL?</h1>}
        {!notFound && transcription }
      </Layout>
    );
  }
}

export default Display;