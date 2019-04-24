'use strict';

/**
 * Feedbackprompt.js controller
 *
 * @description: A set of functions called "actions" for managing `Feedbackprompt`.
 */

module.exports = {

  /**
   * Retrieve feedbackprompt records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.feedbackprompt.search(ctx.query);
    } else {
      return strapi.services.feedbackprompt.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a feedbackprompt record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.feedbackprompt.fetch(ctx.params);
  },

  /**
   * Count feedbackprompt records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.feedbackprompt.count(ctx.query);
  },

  /**
   * Create a/an feedbackprompt record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.feedbackprompt.add(ctx.request.body);
  },

  /**
   * Update a/an feedbackprompt record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.feedbackprompt.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an feedbackprompt record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.feedbackprompt.remove(ctx.params);
  }
};
