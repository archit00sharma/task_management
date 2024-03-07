'use strict'
const path = require('path');


const { taskController } = require(path.join(__dirname, '../../controllers'));


module.exports = async function (fastify, opts) {

    fastify.register(taskController);

    fastify.route({
        method: 'GET',
        preHandler: fastify.authVerify,
        path: '/task_list',
        handler: async (request, reply) => {
            try {
                await fastify.taskController.getTaskList(request, reply)
            } catch (err) {
                throw fastify.httpErrors.createError(err.status || 500, err.message);
            }
        },
    });
    fastify.route({
        method: 'GET',
        path: '/task/:id',
        preHandler: fastify.authVerify,
        handler: async (request, reply) => {
            try {
                await fastify.taskController.getTask(request, reply)
            } catch (err) {
                throw fastify.httpErrors.createError(err.status || 500, err.message);
            }
        },
    });
    fastify.route({
        method: 'POST',
        path: '/task',
        preHandler: fastify.authVerify,
        handler: async (request, reply) => {
            try {
                await fastify.taskController.postTask(request, reply)
            } catch (err) {
                throw fastify.httpErrors.createError(err.status || 500, err.message);
            }
        },
    });
    fastify.route({
        method: 'PUT',
        path: '/update_task/:id',
        preHandler:fastify.authVerify,
        handler: async (request, reply) => {
            try {
                
                await fastify.taskController.putTaskUpdate(request, reply)
            } catch (err) {
                throw fastify.httpErrors.createError(err.status || 500, err.message);
            }
        },
    });
    fastify.route({
        method: 'GET',
        path: '/delete_task/:id',
        preHandler:fastify.authVerify,
        handler: async (request, reply) => {
            try {
                await fastify.taskController.getTaskDelete(request, reply)
            } catch (err) {
                throw fastify.httpErrors.createError(err.status || 500, err.message);
            }
        },
    });

    fastify.route({
        method: 'GET',
        path: '/checking',
        handler: async (request, reply) => {
            try {
                reply.send("hiiii")
            } catch (err) {
                throw fastify.httpErrors.createError(err.status || 500, err.message);
            }
        },
    });
}



