require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../screen.scss';
import getConfig from 'next/config';
import openSocket from 'socket.io-client';

const { publicRuntimeConfig } = getConfig();
const { BASE_API_URL } = publicRuntimeConfig;
const PROMPTS_API_URL = `${BASE_API_URL}/freeformprompts`;
console.log('BASE_API_URL -> ', BASE_API_URL, '\n', 'PROMPTS_API_URL -> ', PROMPTS_API_URL);
import {TweenMax, Linear} from 'gsap';


class Display extends Component {
  state = {
    transcription: 'No messages received yet. This is placeholder.'
  };

  static async getInitialProps({ query }) {
    let response = null;
    let notFound = false;

    try {
      response = await fetch(`${PROMPTS_API_URL}/${query.id}`).then(response => response.json());
      console.log('display response ----> ', response);
    } catch(e) {
      console.log('woops - something went wrong', e);
      notFound = true;
    }
    
    if (!response || !response.hasOwnProperty('id')) {
      // we either don't have a query.id or the response was not valid 
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
    if (this.props.notFound) return;
    console.log('socket endpoint ----> ', BASE_API_URL);
    this.socket = openSocket(BASE_API_URL);
  }

  subscribeToTimer(cb) {
    const { displaytimeout } = this.props.data;
    console.log('displaytimeout is ', displaytimeout);
    this.socket.on('timer', message => cb(null, message));
    this.socket.emit('subscribeToTimer', (displaytimeout * 1000)); // In seconds
  }
  
  componentDidMount() {
    if (this.props.notFound) return;

    this.subscribeToTimer((err, transcription) => {
      if(err) return;
      this.setState({
        transcription
      });
    });

    let radius = 20;
    TweenMax.staggerFromTo('.blob-1', 10 , {
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
      ease: Linear.easeIn,
      repeat: -1
    });

    TweenMax.staggerFromTo('.blob-2', 58 , {
      cycle: {
        attr(i) {
          let r = i*90;
          return {
            transform:`rotate(${-r}) translate(${radius * 2},0.1) rotate(-${r})`
          }      
        }
      }  
    },{
      cycle: {
        attr(i) {
          let r = i*90+ 360;
          return {
            transform:`rotate(${r}) translate(${radius},0.1) rotate(-${r})`
          }      
        }
      },
      ease: Linear.easeOut,
      repeat: -1
    });

    TweenMax.staggerFromTo('.blob-3', 4 , {
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
            transform:`rotate(${r}) translate(${radius * 0.1},0.1) rotate(-${r})`
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
        {notFound && <p className="message-body">Ah nuts. Couln't find the related prompt. Check the URL?</p>}
        
        {!notFound && <p className="message-body">{ transcription }</p>}
        <div className="blobs-container">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="blobs-parent">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                <feColorMatrix in="blur" mode="matrix" values="1 21 21 71  40 61 30 20 0  0 0 1 0 0  0 0 0 18 -7" result="mix" />
              </filter>
              
              <linearGradient id="grad-1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"  stopColor="rgb(45, 56, 70)" stopOpacity="1"/>
                <stop offset="70%" stopColor="rgb(210, 156, 107)" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="grad-2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="rgb(196, 73, 56)" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="rgb(210, 156, 107)" stopOpacity="1"/>
              </linearGradient>
              <linearGradient id="grad-3" x1="0" y1="0" x2="1" y2="0.2">
                <stop offset="0%"  stopColor="rgb(205, 162, 118)" stopOpacity="0"/>
                <stop offset="10%" stopColor="rgb(31, 42, 69)" stopOpacity="0.22"/>
                <stop offset="35%" stopColor="rgb(198, 107, 85)" stopOpacity="0.56"/>
                <stop offset="55%" stopColor="rgb(88, 79, 71)" stopOpacity="0.36"/>
                <stop offset="85%" stopColor="rgb(198, 75, 58)" stopOpacity="0.16"/>
              </linearGradient>
            </defs>
            <mask id="mask-1">
              <g className="blobs">
                <ellipse className="blob blob-1" cx="40%" cy="50%" rx="40%" ry="80%" transform="rotate(0) translate(0, 0) rotate(0)" />
                {/*<circle className="blob" cx="500" cy="320" r="70" transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob" cx="300" cy="390" r="40" transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob" cx="380" cy="390" r="80" transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob" cx="470" cy="450" r="20" transform="rotate(0) translate(0, 0) rotate(0)"/>*/}
              </g>
            </mask>
            <mask id="mask-2">
              <g className="blobs">
                {/*<ellipse className="blob" cx="0%" cy="20%" rx="40%" ry="80%" transform="rotate(0) translate(0, 0) rotate(0)" />*/}
                <ellipse className="blob blob-2" cx="10%" cy="0%" rx="60%" ry="60%" transform="rotate(0) translate(0, 0) rotate(0)" />
                <ellipse className="blob blob-2" cx="50%" cy="30%" rx="48%" ry="48%" transform="rotate(0) translate(0, 0) rotate(0)" />
                <ellipse className="blob blob-2" cx="30%" cy="80%" rx="38%" ry="38%" transform="rotate(0) translate(0, 0) rotate(0)" />
              </g>
            </mask>
            <mask id="mask-3">
              <g className="blobs">
                <circle className="blob blob-3" cx="73%" cy="30%" r="50%" transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob blob-3" cx="33%" cy="30%" r="20%" transform="rotate(0) translate(0, 0) rotate(0)"/>                

                {/*<circle className="blob" cx="20%" cy="88%" r="40%" transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob" cx="43%" cy="80%" r="80%" transform="rotate(0) translate(0, 0) rotate(0)"/>
                <circle className="blob" cx="60%" cy="450" r="20%" transform="rotate(0) translate(0, 0) rotate(0)"/>*/}
              </g>
            </mask>
            
            <rect 
              style={{ stroke: '#000', strokeWidth: 0 }} 
              mask="url(#mask-1)"
              x="0%" 
              y="0"
              fill="url(#grad-1)"
              width="100%"
              height="100%">
            </rect>
            <rect 
              style={{ stroke: '#000', strokeWidth: 0 }} 
              mask="url(#mask-2)"
              x="0%" 
              y="0"
              fill="url(#grad-2)"
              width="100%"
              height="100%">
            </rect>
            <rect 
              style={{ stroke: '#000', strokeWidth: 0 }} 
              mask="url(#mask-3)"
              x="0%" 
              y="0"
              fill="url(#grad-3)"
              width="100%"
              height="100%">
            </rect>

            
          </svg>	
        </div>
        
      </Layout>
    );
  }
}

export default Display;