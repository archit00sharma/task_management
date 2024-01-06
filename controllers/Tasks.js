'use strict';

const fp = require('fastify-plugin');
const path = require('path');
const bcrypt = require('bcrypt');
const messages = require('../messages.json');
const mongoose = require('mongoose')


const { taskServices } = require('../services');


const taskController = (fastify) => {
    fastify.register(taskServices);
    const getTaskList = async (request, reply) => {
        try {
            const { page_no, no_of_records } = request;
            const cond = { user_id: new mongoose.Types.ObjectId(request.user.id) }
            const [tasks] = await fastify.taskServices.all(page_no, no_of_records, cond);
            const total_records = tasks?.total_records?.[0]?.count ?? 0;

            return fastify.successMsg(request, reply, { total_records, page_no, no_of_records, tasks: tasks.data || {} })
        } catch (err) {
            throw fastify.httpErrors.createError(err.status || 500, err.message);
        }
    };
    const getTask = async (request, reply) => {
        try {
            let task;
            const { id } = request.params;

            const cacheKey = `task_${id}`;
            task = await fastify.cache.get(cacheKey);
            if (task && (task.is_deleted === true || task.user_id.toString() !== request.user.id)) throw fastify.httpErrors.badRequest("Task Not Found");

            if (!task) {
                task = await fastify.taskServices.read({ _id: id, user_id: request.user.id });
                if (!task) throw fastify.httpErrors.badRequest("Task Not Found");
                fastify.cache.put(cacheKey, task, 300000);
            }

            return fastify.successMsg(request, reply, { task })
        } catch (err) {
            throw fastify.httpErrors.createError(err.status || 500, err.message);
        }
    };
    const postTask = async (request, reply) => {
        try {
            const { id } = request.user;

            request.body.user_id = id;
            request.body.due_date = new Date(request.body.due_date);

            const task = await fastify.taskServices.create(request.body);

            const cacheKey = `task_${task._id}`;
            await fastify.cache.put(cacheKey, task, 300000);

            return fastify.successMsg(request, reply, { task })
        } catch (err) {
            throw fastify.httpErrors.createError(err.status || 500, err.message);
        }
    };
    const putTaskUpdate = async (request, reply) => {
        try {
            const { id } = request.params;
            const callbackUrl = "https://bb26-2405-201-5c0b-ba0-4db0-7566-1816-e96c.ngrok-free.app"

            fastify.taskQueue.push({ id, callbackUrl, request, reply }, (err) => {
                if (err) {
                    console.log("error", err.message)
                } else {
                    console.log("completed successfully")
                }
            });

            return fastify.successMsg(request, reply);
        } catch (err) {
            throw fastify.httpErrors.createError(err.status || 500, err.message);
        }
    };
    const getTaskDelete = async (request, reply) => {
        try {
            let checkTask
            const { id } = request.params;

            const cacheKey = `task_${id}`;
            checkTask = await fastify.cache.get(cacheKey);

            if (checkTask && checkTask.is_deleted === true) throw fastify.httpErrors.badRequest("Task Not Found");
            if (!checkTask) checkTask = await fastify.taskServices.read({ _id: id, is_deleted: false })
            if (!checkTask) throw fastify.httpErrors.badRequest("Task Not Found");
            if (checkTask.user_id.toString() !== request.user.id) throw fastify.httpErrors.forbidden("Not authorized");

            const task = await fastify.taskServices.update(id, { is_deleted: true });
            await fastify.cache.del(cacheKey);
            return fastify.successMsg(request, reply, { task })
        } catch (err) {
            throw fastify.httpErrors.createError(err.status || 500, err.message);
        }
    };

    return {
        getTaskList,
        getTask,
        postTask,
        putTaskUpdate,
        getTaskDelete
    };
};

module.exports = fp((fastify, options, next) => {
    fastify.decorate('taskController', taskController(fastify));
    next();
});
