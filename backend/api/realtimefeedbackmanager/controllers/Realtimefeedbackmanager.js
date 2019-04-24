'use strict';

/**
 * Realtimefeedbackmanager.js controller
 *
 * @description: A set of functions called "actions" for managing `Realtimefeedbackmanager`.
 */

module.exports = {

  /**
   * Retrieve realtimefeedbackmanager records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.realtimefeedbackmanager.search(ctx.query);
    } else {
      return strapi.services.realtimefeedbackmanager.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a realtimefeedbackmanager record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.realtimefeedbackmanager.fetch(ctx.params);
  },

  /**
   * Count realtimefeedbackmanager records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.realtimefeedbackmanager.count(ctx.query);
  },

  /**
   * Create a/an realtimefeedbackmanager record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.realtimefeedbackmanager.add(ctx.request.body);
  },

  /**
   * Update a/an realtimefeedbackmanager record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.realtimefeedbackmanager.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an realtimefeedbackmanager record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.realtimefeedbackmanager.remove(ctx.params);
  }
};
