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
    [this.nameEl, this.emailEl, this.companyEl].forEach(el => el.blur());
    const { campaignId, promptId } = this.props;
    const { name, email, company } = this.state;
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
            <div className="contact-thank-you">
              <h1>
                Thank you for staying in touch!
              </h1>
              <br/>
              <br/>
              <br/>
              <p className="close-drawer">
                You can close the drawer now, thanks.
              </p>
            </div>
          </div>
        }
        <div className="contact-container">
          <form className="contact-form" onSubmit={this.submit}>
            <input ref={input => this.nameEl = input} onChange={this.updateName} placeholder="Name"  className="input-name" type="text"></input>
            <input ref={input => this.companyEl = input} onChange={this.updateCompany} placeholder="Company" className="input-company" type="text"></input>
            <input ref={input => this.emailEl = input} onChange={this.updateEmail} placeholder="you@place.are" className="input-email" type="email"></input>
            <button className="contact-submit " onClick={this.submit}>Submit</button>
          </form>
          
        </div>
      </Layout>
    );
  }
}

export default Contact;