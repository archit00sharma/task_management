'use strict'
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const fastifyRedis = require('@fastify/redis');
const fastifyCors = require('@fastify/cors');
const fastifyRateLimit = require('@fastify/rate-limit');
const fastifySecureSession = require('@fastify/secure-session');
const qs = require('qs')
const AutoLoad = require('@fastify/autoload');
const CronJob = require('cron').CronJob;


// Pass --options via CLI arguments in command to enable these options.
const options = {}

module.exports = async function (fastify, opts) {


  fastify.register(require('@fastify/multipart'))

  fastify.register(require('@fastify/formbody'), { parser: str => qs.parse(str) });

  const isProduction = process.env.NODE_ENV === 'production';

  fastify.register(fastifyCors)

  fastify.register(fastifySecureSession, {
    secret: crypto.randomBytes(32).toString('hex'),
    cookie: {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: 86400000 // 24 hours in milliseconds
    }
  });

  fastify.register(fastifyRateLimit, {
    max: 100, // Maximum number of requests within the duration
    timeWindow: '1 minute' // Duration in which the maximum requests are allowed
  });

  fastify.register(fastifyRedis, {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
    family: process.env.REDIS_FAMILY, // 4 (IPv4) or 6 (IPv6)
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });

  fastify.addHook('onRequest', async (request, reply) => {
    request.page_no = request.query.page_no ? parseInt(request.query.page_no, 10) : 1;
    request.no_of_records = parseInt(process.env.NO_OF_RECORDS, 10) || 10;
  });

  fastify.setErrorHandler(async (error, request, reply) => {
    const statusCode = error.statusCode || 500;
    fastify.log.error(error);
    const errorMessage = error.message ? error.message : 'Internal server error'
    await reply.status(statusCode).send(errorMessage)
  });
}

module.exports.options = options
