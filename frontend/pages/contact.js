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
    company: ''
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
    console.log('submit ', this.state);
    fetch(CONTACTS_API_URL, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(Object.assign({}, this.state, { campaign: campaignId }))
    }).then(resp => resp.json())
      .then(response => {
        if (response.ok) {
          console.log('Saved contact');
        } else {
          console.log('response not ok')
        }
       
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
    return (
      <Layout>
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