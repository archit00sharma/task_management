'use strict';

const fp = require('fastify-plugin');
const path = require('path');
const bcrypt = require('bcrypt');
const messages = require('../messages.json');

const { userServices } = require('../services');

const authController = (fastify) => {

    fastify.register(userServices);

    const userLogin = async (request, reply) => {
        try {
            const { email, password } = request.body;

            const user = await fastify.userServices.read({ email });
            if (!user) throw fastify.httpErrors.badRequest(messages.USER_NOT_FOUND);
            

            const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password);
            if (!isPasswordCorrect) throw fastify.httpErrors.badRequest(messages.PASSWORD_WRONG);

            const token = await fastify.jwt.sign({ id: user.id }, { secret: process.env.JWT_SECRET });
            reply.setCookie('token', token, { httpOnly: true, path: '/', secure: true });
            await fastify.redis.set(`task_management:${process.env.NODE_ENV}:loggedInUsers:${user.id}`, token);

            return fastify.successMsg(request, reply, { token, user })

        } catch (err) {
            throw fastify.httpErrors.createError(err.status || 500, err.message);
        }
    };

    return {
        userLogin,
    };
};

module.exports = fp((fastify, options, next) => {
    fastify.decorate('authController', authController(fastify));
    next();
});
