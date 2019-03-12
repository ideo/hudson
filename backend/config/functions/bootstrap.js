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
  let displayTimerStarted = false;
  const io = require('socket.io')(strapi.server);
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
    client.on('subscribeToTimer', (interval) => {
      console.log('----> has timer started? ', displayTimerStarted);
      if (!displayTimerStarted) {
        console.log('----> Nope. Go ahead and start it.');
        displayTimer(client, interval);
        displayTimerStarted = true;
        console.log('---> Has it started now? ', displayTimerStarted);
      }
    });
    client.on('disconnect', () => {
      console.log('a user disconnected');
      // should we clean up here?
    });
  });
  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
  cb();
};
