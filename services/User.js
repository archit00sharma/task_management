'use strict'


const fp = require('fastify-plugin');

const { user } = require('../models/user');

const userServices = (fastify) => {

    const create = async (data) => await user.create(
        data,
    ).catch((err) => {
        throw err;
    });
    const read = async (data, select = {}) => user.findOne(
        data
    ).catch((err) => {
        throw err
    });

    return {
       create, read
    };
};

module.exports = fp((fastify, options, next) => {
    fastify.decorate('userServices', userServices(fastify));
    next();
});
