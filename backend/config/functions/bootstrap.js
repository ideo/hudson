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

    client.on('subscribeToRealtimeFeedbackManager', (id) => {
      // console.log('Client subscribed to realtimeFeedbackManagwr with id: ', id);
      fetchRealtimefeedbackManager({ id })
        .then(response => {
          const serializedResponse = response.toJSON();
          // console.log(serializedResponse.feedbackprompt)
          const { feedbackprompt: { Prompt }, id: promptId } = serializedResponse;
          // console.log('_prompt is: _', Prompt)
          io.emit('promptUpdate', {Prompt, promptId})
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
