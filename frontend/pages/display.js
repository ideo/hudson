require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../screen.scss';
import getConfig from 'next/config';
import openSocket from 'socket.io-client';

const { publicRuntimeConfig } = getConfig();
const { BASE_API_URL } = publicRuntimeConfig;
const PROMPTS_API_URL = `${BASE_API_URL}/freeformprompts`;

import {TweenMax, Linear} from 'gsap';


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
    });

    let radius = 8;
    TweenMax.staggerFromTo('.blob', 4 , {
      cycle: {
        attr(i) {
          let r = i*90;
          return {
            transform:`rotate(${r}) translate(${radius},0.1) rotate(-${r})`
          }      
        }
      }  
    },{
      cycle: {
        attr(i) {
          let r = i*90+360;
          return {
            transform:`rotate(${r}) translate(${radius},0.1) rotate(-${r})`
          }      
        }
      },
      ease: Linear.easeInOut,
      repeat: -1
    });

  }

  componentWillUnMount() {
    
  }


  render() {
    const { notFound } = this.props;
    const { transcription } = this.state;
    
    return (
      <Layout>
        {notFound && <h1>Ah nuts. Couln't find the related prompt. Check the URL?</h1>}
        
        {!notFound && <p className="message-body">{ transcription }</p>}
        <div className="loading_cont">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="loader">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feBlend in2="goo" in="SourceGraphic" result="mix" />
              </filter>
              <linearGradient id="MyGradient">
                  <stop offset="5%"  stopColor="#40204c"/>
                  <stop offset="40%" stopColor="#a3225c"/>
                  <stop offset="100%" stopColor="#e24926"/>
              </linearGradient>
            </defs>
            <mask id="maska">
              <g className="blobs">
                <circle className="blob" cx="440" cy="250" r="30" transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob" cx="500" cy="320" r="70"  transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob" cx="300" cy="390" r="40"  transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob" cx="380" cy="390" r="80"  transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob" cx="470" cy="450" r="20"  transform="rotate(0) translate(0, 0) rotate(0)"/>
              </g>
            </mask>
            <rect x="200" y="200"  mask="url(#maska)" fill="url(#MyGradient)" width="400" height="400"></rect>
          </svg>	
        </div>
        
      </Layout>
    );
  }
}

export default Display;