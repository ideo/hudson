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
  const fetchAll = strapi.services.freeformentry.fetchAll;
  // import socket io
  const io = require('socket.io')(strapi.server);
  //listen for user connection
  io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
      console.log('client is subscribing to timer with interval ', interval);
      setInterval(() => {
        //console.log('---> fetchAll is: ', fetchAll({}));
        fetchAll({}).then(response => {
          console.log(response.toJSON());
          client.emit('timer', new Date());
        })
      }, interval);
    });
    client.on('disconnect', () => console.log('a user disconnected'));
  });
  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
  cb();
};
