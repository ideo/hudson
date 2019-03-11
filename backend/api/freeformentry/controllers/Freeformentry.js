'use strict';

/**
 * Freeformentry.js controller
 *
 * @description: A set of functions called "actions" for managing `Freeformentry`.
 */

module.exports = {

  /**
   * Retrieve freeformentry records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    console.log('ctx is: ', ctx.query);
    if (ctx.query._q) {
      return strapi.services.freeformentry.search(ctx.query);
    } else {
      return strapi.services.freeformentry.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a freeformentry record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.freeformentry.fetch(ctx.params);
  },

  /**
   * Count freeformentry records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.freeformentry.count(ctx.query);
  },

  /**
   * Create a/an freeformentry record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.freeformentry.add(ctx.request.body);
  },

  /**
   * Update a/an freeformentry record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.freeformentry.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an freeformentry record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.freeformentry.remove(ctx.params);
  }
};
