'use strict';

const fp = require('fastify-plugin');
const path = require('path');
const { Kafka } = require('kafkajs');

module.exports = fp(async function (fastify, opts) {

    fastify.decorate('producer', async (task) => {
        let producer;
        try {
            const kafka = new Kafka({
                clientId: 'task-producer',
                brokers: ['localhost:9092'],
            });
            producer = kafka.producer();
            await producer.connect();
            await producer.send({
                topic: 'task_queue_update',
                messages: [{ value: JSON.stringify(task) }],
            });
        } catch (err) {
            throw fastify.httpErrors.internalServerError(`Something went wrong: ${err.message ? err.message : err}`);
        } finally {
            await producer.disconnect();
        }
    });

    fastify.decorate('consumer', async () => {
        let consumer;
        try {
            const kafka = new Kafka({
                clientId: 'task-consumer',
                brokers: ['localhost:9092'],
            });
            consumer = kafka.consumer({ groupId: 'task-group' });
            await consumer.connect();
            await consumer.subscribe({ topic: 'task_queue_update', fromBeginning: false });

            consumer.run({
                eachMessage: async ({ message }) => {
                    const task = JSON.parse(message.value);
                },
            });

        } catch (err) {
            throw fastify.httpErrors.internalServerError(`Something went wrong: ${err.message ? err.message : err}`);
        } finally {
            if (consumer) {
                await consumer.disconnect();
            }
        }
    });

});
