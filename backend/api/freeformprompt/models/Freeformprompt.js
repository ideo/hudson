const uuidv1 = require('uuid/v1');
const fs = require('fs');
const path = require('path');
'use strict';

/**
 * Lifecycle callbacks for the `Freeformprompt` model.
 */

module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  // beforeSave: async (model, attrs, options) => {},

  // After saving a value.
  // Fired after an `insert` or `update` query.
  // afterSave: async (model, response, options) => {},

  // Before fetching a value.
  // Fired before a `fetch` operation.
  // beforeFetch: async (model, columns, options) => {},

  // After fetching a value.
  // Fired after a `fetch` operation.
  // afterFetch: async (model, response, options) => {},

  // Before creating a value.
  // Fired before an `insert` query.
  // beforeCreate: async (model, attrs, options) => {},

  // After creating a value.
  // Fired after an `insert` query.
  afterCreate: async (model, attrs, options) => {
    console.log('afterCreate called for Freeformprompt. ');
    
    const { attributes: { provocation } } = model;
    const filename = path.join(__dirname, `./freeform-prompt-${uuidv1()}`);
    const data = new Uint8Array(Buffer.from(provocation));
    fs.writeFile(filename, data, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    


    //console.log('campaign -> ', attrs);
    //console.log('attrs ', attrs);
    //console.log('options ', options);
  },

  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model, attrs, options) => {},

  // After updating a value.
  // Fired after an `update` query.
  afterUpdate: async (model, attrs, options) => {
    console.log('afterUpdate called for Freeformprompt. ');
    //console.log('model ', model);
    //console.log('attrs ', attrs);
    //console.log('options ', options);
  },

  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model, attrs, options) => {},

  // After destroying a value.
  // Fired after a `delete` query.
  afterDestroy: async (model, attrs, options) => {
    console.log('afterDestroy called for Freeformprompt. ');
  }
};
