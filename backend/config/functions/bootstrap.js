'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */

module.exports = cb => {
  //console.log('----> strapi services: ', );
  const fetchForDisplay = strapi.services.freeformentry.fetchForDisplay;
  const edit = strapi.services.freeformentry.edit;
  // import socket io
  const io = require('socket.io')(strapi.server);
  //listen for user connection
  io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
      //console.log('client is subscribing to timer with interval ', interval);
      setInterval(() => {
        fetchForDisplay().then(response => {
          const serializedResponse = response.toJSON()[0];
          const { id, transcription } = serializedResponse;
          client.emit('timer', transcription + ' ' + id);
          edit({ id }, {displayed_at: new Date()}).then(response => {
            console.log('Updated `displayed_at` ', response.toJSON());
          });
        });        
      }, interval);
    });
    client.on('disconnect', () => console.log('a user disconnected'));
  });
  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
  cb();
};
