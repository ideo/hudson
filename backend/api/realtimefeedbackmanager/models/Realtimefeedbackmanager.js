'use strict';

/**
 * Lifecycle callbacks for the `Realtimefeedbackmanager` model.
 */

module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  // beforeSave: async (model, attrs, options) => {},

  // After saving a value.
  // Fired after an `insert` or `update` query.
  afterSave: async (model, response, options) => {
    // console.log(model.toJSON())
    const { feedbackprompt: promptId } = model.toJSON();
    // console.log('\n', strapi.services.feedbackprompt.fetch, '\n');
    strapi.services.feedbackprompt.fetch({id: promptId}).then(response => {
      const serializedResponse = response.toJSON();
      // console.log('SERIALIZE ______ ', serializedResponse)
      const { 
        Prompt, id, textcolor, backgroundcolor, image: { url: imageUrl } 
      } = serializedResponse;
      console.log('______________ prompt ID IS: ', id)
      strapi.io.emit('promptUpdate', {
        Prompt, id, textcolor, backgroundcolor, imageUrl
      })
    })
    .catch(e => {
      console.error('failed to get realtimefeedbackManager with', 'error: ', e)
    })
  },

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
  // afterCreate: async (model, attrs, options) => {},

  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model, attrs, options) => {},

  // After updating a value.
  // Fired after an `update` query.
  // afterUpdate: async (model, attrs, options) => {},

  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model, attrs, options) => {},

  // After destroying a value.
  // Fired after a `delete` query.
  // afterDestroy: async (model, attrs, options) => {}
};
