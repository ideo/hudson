'use strict';

/**
 * Freeformprompt.js controller
 *
 * @description: A set of functions called "actions" for managing `Freeformprompt`.
 */

module.exports = {

  /**
   * Retrieve freeformprompt records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.freeformprompt.search(ctx.query);
    } else {
      return strapi.services.freeformprompt.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a freeformprompt record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.freeformprompt.fetch(ctx.params);
  },

  /**
   * Count freeformprompt records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.freeformprompt.count(ctx.query);
  },

  /**
   * Create a/an freeformprompt record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.freeformprompt.add(ctx.request.body);
  },

  /**
   * Update a/an freeformprompt record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.freeformprompt.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an freeformprompt record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.freeformprompt.remove(ctx.params);
  }
};
