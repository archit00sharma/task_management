const fp = require('fastify-plugin');
const fastifyJwt = require('@fastify/jwt');
const messages = require('../messages.json');
const path = require('path');


module.exports = fp(async (fastify, opts) => {
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECERET,
        cookie: {
            cookieName: 'token',
            signed: false
        }
    });

    fastify.decorate('authVerify', async (request, reply) => {
        try {
            await request.jwtVerify()
            if (!await fastify.redis.get(`task_management:${process.env.NODE_ENV}:loggedInUsers:${request.user.id}`))
                throw fastify.httpErrors.unauthorized(messages.UNAUTHORIZED)
        } catch (err) {
            reply.send(err)
        }
    });
});
