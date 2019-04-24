'use strict';

/**
 * Feedbackentry.js controller
 *
 * @description: A set of functions called "actions" for managing `Feedbackentry`.
 */

module.exports = {

  /**
   * Retrieve feedbackentry records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.feedbackentry.search(ctx.query);
    } else {
      return strapi.services.feedbackentry.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a feedbackentry record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.feedbackentry.fetch(ctx.params);
  },

  /**
   * Count feedbackentry records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.feedbackentry.count(ctx.query);
  },

  /**
   * Create a/an feedbackentry record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.feedbackentry.add(ctx.request.body);
  },

  /**
   * Update a/an feedbackentry record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.feedbackentry.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an feedbackentry record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.feedbackentry.remove(ctx.params);
  }
};
