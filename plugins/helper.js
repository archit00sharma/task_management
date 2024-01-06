'use strict'

const fp = require('fastify-plugin');
const path = require('path');
const cache = require('memory-cache');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {
  
  fastify.decorate('successMsg', (request, reply, data = {}, message = 'Success', statusCode = 200) => {
    try {
      const traceId = request.traceId || 'N/A'
      return reply.status(statusCode).send({ traceId, message, data });
    } catch (err) {
      throw fastify.httpErrors.internalServerError(`Something went wrong: ${err.message ? err.message : err}`,);
    }
  },
  );
  
  fastify.decorate('cache', cache);

})
