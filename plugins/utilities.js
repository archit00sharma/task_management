'use strict';

const fp = require('fastify-plugin');
const async = require('async');
const axios = require("axios")
const { taskServices } = require('../services');

module.exports = fp(async function (fastify, opts) {
    fastify.register(taskServices);

    const queueConcurrency = opts && opts.queueConcurrency ? opts.queueConcurrency : 1;
    const taskQueue = async.queue(async (task) => {
        const { id, request, reply } = task;
        try {
            let checkTask;

            const cacheKey = `task_${id}`;
            checkTask = fastify.cache.get(cacheKey);
            if (!checkTask) checkTask = await fastify.taskServices.read({ _id: id });

            if (!checkTask) throw fastify.httpErrors.badRequest("Task Not Found");
            if (checkTask.user_id.toString() !== request.user.id) throw fastify.httpErrors.forbidden("Not authorized");

            request.body.due_date && (request.body.due_date = new Date(request.body.due_date));

            const updatedTask = await fastify.taskServices.update(id, request.body);
            fastify.cache.put(cacheKey, updatedTask, 300000);

            if (task.callbackUrl) {
                const callbackResponse = { status: 'success', message: 'Task processed successfully' };
                await axios.post(request.body.callbackUrl, callbackResponse);
            };
            return Promise.resolve();
        } catch (err) {
            if (task.callbackUrl) {
                const callbackResponse = { status: 'error', message: `Error processing task,${err.message}` };
                await axios.post(request.body.callbackUrl, callbackResponse);
            }
            return Promise.reject(err);
        }
    }, queueConcurrency);


    fastify.decorate('taskQueue', taskQueue);


    fastify.decorate('check_due_date',)

});
