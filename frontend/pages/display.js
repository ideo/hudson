require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../style.scss';
import getConfig from 'next/config';
import openSocket from 'socket.io-client';

const  socket = openSocket('http://localhost:1337');
const { publicRuntimeConfig } = getConfig();
const { BASE_API_URL } = publicRuntimeConfig;

class Display extends Component {
  state = {
    timestamp: 'no timestamp yet'
  };

  static async getInitialProps({ query }) {
    
    
    return {
      
    };
  }

  constructor(props) {
    super(props);
    
  }

  subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
  }
  
  componentDidMount() {
    this.subscribeToTimer((err, timestamp) => {
      if(err) return;
      this.setState({
        timestamp
      })
    })
  }

  componentWillUnMount() {
    
  }




  render() {
    return (
      <Layout>
        { this.state.timestamp }
      </Layout>
    );
  }
}

export default Display;