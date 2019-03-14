require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../style.scss';
import getConfig from 'next/config';
import Router from 'next/router';
import Link from 'next/link';

const { publicRuntimeConfig } = getConfig();
const { BASE_API_URL } = publicRuntimeConfig;
const PROMPTS_API_URL = `${BASE_API_URL}/campaigns`;
const CONTACTS_API_URL = `${BASE_API_URL}/contacts`;


class Contact extends Component {
  
  state = {
    name: '',
    email: '',
    company: '',
    success: false
  }

  static async getInitialProps({ query }) {
    // TODO: account for case without query ID
    // get the campaign we are creating a contact for
    let campaign = {};
    let notFound = false;
    try {
      campaign = await fetch(`${PROMPTS_API_URL}/${query.campaignId}`).then(response => response.json());
    } catch (e) {
      console.log('woops - something went wrong', e);
      notFound = true;
    }
    console.log('campaign id: ', query.campaignId)
    console.log('prompt id: ', query.promptId)
    return {
      data: campaign,
      campaignId: query.campaignId,
      promptId: query.promptId,
      notFound
    };
  }

  constructor(props) {
    super(props);
    
  }
  
  componentDidMount() {
    
  }

  submit = (e) => {
    e.preventDefault();
    const { campaignId, promptId } = this.props;
    const { name, email, company } = this.state;
    console.log('submit ', this.state);
    fetch(CONTACTS_API_URL, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({ 
        campaign: campaignId,
        name,
        email,
        company 
      })
    }).then(resp => resp.json())
      .then(response => {
        this.setState({ success: true })
        console.log('Saved contact');
        window.setTimeout(() => {
          Router.push(`/freeform/${promptId}`)
        }, 5000)
       
      }).catch(e => {
        console.log('oh noe', e)
      })
  }

  updateCompany = (e) => {
    const value = e.target.value;
    this.setState({
      company: value
    })
  }

  updateName = (e) => {
    const value = e.target.value;
    this.setState({
      name: value
    })
  }

  updateEmail = (e) => {
    const value = e.target.value;
    this.setState({
      email: value
    })

  }

  render() {
    const { notFound, data} = this.props
    const { success } = this.state
    return (
      <Layout>
        {success && 
          <div style={{ zIndex: 101 }} className="contact-container">
            <h1 className="contact-thank-you">
              Thank you for staying in touch!
            </h1>
          </div>
        }
        <div className="contact-container">
          <input onChange={this.updateName}  className="input-name" type="text"></input>
          <input onChange={this.updateCompany} className="input-company" type="text"></input>
          <input onChange={this.updateEmail} className="input-email" type="email"></input>
          <button onClick={this.submit}>Submit</button>
        </div>
      </Layout>
    );
  }
}

export default Contact;