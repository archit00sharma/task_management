'use strict'

const fp = require('fastify-plugin');
const path = require('path');
const CronJob = require('cron').CronJob;


module.exports = fp(async function (fastify, opts) {

    fastify.decorate('send_notification', async () => {
        try {
            const job = new CronJob('*/3 * * * * *', async function () {
                console.log('Running scheduled task every 3 seconds');
                const tasks = await fastify.taskServices.readAll({ due_date: new Date() });
                tasks.forEach((task) => { console.log(`Sending notification for task: ${task.title}`); });
            });
            job.start();
        } catch (err) {
            throw fastify.httpErrors.internalServerError(`Something went wrong: ${err.message ? err.message : err}`,);
        }
    },
    );

    fastify.send_notification();

})
