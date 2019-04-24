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
    imageUrl: null,
    isFormVisible: false,
    isThankYouVisible: false
  };

  socket = null;
  footer = null;
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
    //console.log(value)
    this.setState({ response: value})
  }
  
  showForm = () => {
    this.setState({
      isFormVisible: true
    })
  }

  hideForm = () => {
    this.setState({
      isFormVisible: false
    })
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
      this.setState({ response: ''});
      this.flashThankyouMessage();
      this.hideForm();
    })
    .catch(e => {
      console.log('OH NO ', e);
      this.setState({ response: ''});
      this.flashThankyouMessage();
      this.hideForm();
    });
  }

  componentWillUnmount() {
    this.socket && this.socket.off('promptUpdate');
  }

  flashThankyouMessage = () => {
    this.setState({
      isThankYouVisible: true
    }, () => {
      window.setTimeout((() => {
        this.setState({
          isThankYouVisible: false
        })
      }).bind(this), 2000)
    })
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
    const { prompt, promptId, response, backgroundcolor, textcolor, imageUrl, isFormVisible, isThankYouVisible } = this.state;
    // console.log(this.footer, this.footer && this.footer.offsetHeight)
    return (
      <Layout>
        {notFound && <h1>Oops. Realtime feedback manager not found.</h1>}
        <div className="container" style={{
          backgroundColor: backgroundcolor,
          color: textcolor
        }}>
        <div className="logo">
          <img alt="IDEO" src="../static/ideo-logo.png" />
        </div>
        <div 
          className="card"
          style={{
            backgroundColor: backgroundcolor,
            color: textcolor
          }}
          onTouchStart={this.showForm}>
          <div className="pulsating-circle"></div>

          <header 
          className="header"
          style={{
            backgroundImage: `url('${imageUrl}')`,
          }}>
          
          </header>
          <footer 
            ref={(el) => this.footer = el}
            className="footer"
            style={{
              backgroundColor: textcolor,
              color: backgroundcolor,
              borderColor: backgroundcolor
            }}>
            <h1 className="prompt">{prompt}</h1>
          </footer>
        </div>

        { isFormVisible &&    
          <form className="response-form" onSubmit={this.handleSubmit}>
            <input 
              className="response-submit" 
              type="submit" 
              onClick={this.handleSubmit} 
              style={{
                color: textcolor,
                backgroundColor: backgroundcolor,
                borderColor: textcolor
              }}
            />

            <textarea className="response-entry" onChange={this.handleChange} value={response}>
            </textarea>
          </form>
        }

        {
          isThankYouVisible &&
          <div className="thankyou"
            style={{
              color: textcolor,
              backgroundColor: backgroundcolor,
              borderColor: textcolor
            }}>
            <div className="logo">
              <img alt="IDEO" src="../static/ideo-logo.png" />
            </div>
            <p>
              Thanks you! <br /> Your feedback is much appreciated.
            </p>
          </div>
        }
        </div>
        
      </Layout>
    );
  }
}

export default RealtimeFeedback;