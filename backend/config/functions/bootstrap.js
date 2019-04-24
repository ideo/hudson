'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */

 
module.exports = cb => {
  // import socket io
  const io = require('socket.io')(strapi.server);
  
  let displayTimerStarted = false;
  
  const fetchForDisplay = strapi.services.freeformentry.fetchForDisplay;
  const edit = strapi.services.freeformentry.edit;

  const displayTimer = (socket, interval) => {
    setInterval(() => {
      fetchForDisplay().then(response => {
        const serializedResponse = response.toJSON()[0];
        const { id, transcription } = serializedResponse;
        //socket.emit('timer', transcription);
        io.emit('timer', transcription); // this broadcasts to all clients
        console.log('Emitting: ', transcription);
        edit({ id }, {displayed_at: new Date()}); // returns promise
      });        
    }, interval);
  }

  //listen for user connection
  io.on('connection', (client) => {
    console.warn('New WS Connection')
    // Begin Display timer
    client.on('subscribeToTimer', (interval) => {
      if (!displayTimerStarted) {
        displayTimer(client, interval);
        displayTimerStarted = true;
      }
    });
    // End Display timer

    // Begin realtimefeedback
    const fetchRealtimefeedbackManager = strapi.services.realtimefeedbackmanager.fetch;
    const fetchFeedbackprompt = strapi.services.feedbackprompt.fetch;

    client.on('subscribeToRealtimeFeedbackManager', (id) => {
      console.log('Client subscribed to realtimeFeedbackManagwr with id: ', id);
      return fetchRealtimefeedbackManager({ id })
        .then(response => {
          const serializedResponse = response.toJSON();
          // console.log(JSON.stringify(serializedResponse))
          const { 
            feedbackprompt: {  
              id: promptId
            } 
          } = serializedResponse;
          return promptId
        })
        .then(promptId => {
          return fetchFeedbackprompt(promptId)
          .then(response => { 
            const serializedResponse = response.toJSON()
            // console.log(serializedResponse)
            const { 
              Prompt, id, textcolor, backgroundcolor, image
            } = serializedResponse;
            const imageUrl = image && image.url ? image.url : ''
            console.log('______________ prompt ID IS: ',)
            io.emit('promptUpdate', {
              Prompt, id, textcolor, backgroundcolor, imageUrl
            })
          })
        })
        .catch(e => {
          console.error('failed to get realtimefeedbackManager with id ', id, ' error: ', e)
        })
    });
    // End realtimefeedback

    
    client.on('disconnect', () => {
      console.log('a user disconnected');
      // should we clean up here?
    });
  });


  

  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
  cb();
};
