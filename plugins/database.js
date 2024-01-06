const fp = require('fastify-plugin');
const mongoose = require('mongoose');
const Agenda = require('agenda');


// async function dueNotificationsJob(job) {
//     try {
//         const tasks = await taskServices.find({ due_date: new Date() });
//         console.log("tasks>>>>>>>>>>>>>>>>>>>>>>.", tasks)
//         tasks.forEach((task) => { console.log(`Sending notification for task: ${task.title}`); });
//     } catch (err) {
//         console.error(`Error in dueNotificationsJob: ${err.message}`);
//     };
// };


module.exports = fp(async (fastify, opts) => {
    const url = process.env.MONGODB_URI;
    try {

        const db = await mongoose.connect(url);
        mongoose.set({ debug: true });
        fastify.mongo = db;

        // const agenda = new Agenda({ mongo: db.connection });
        // fastify.agenda = agenda;

        // agenda.define('due_notifications', dueNotificationsJob);

        // (async function () {
        //     await agenda.start();
        //     await agenda.every("*/3 * * * *", "due_notifications");
        // })();

        

        fastify.addHook('onClose', async (instance) => {
            await mongoose.disconnect();
            // await agenda.stop();
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
});
