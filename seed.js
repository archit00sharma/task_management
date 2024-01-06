// seed.js

const mongoose = require('mongoose');
const fastify = require('fastify')();
const bcrypt = require('bcrypt');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { user } = require('./models/user');

const usersData = [
    { name: 'user1', email: 'user1@example.com', password: '12345', is_deleted: false },
    { name: 'user2', email: 'user2@example.com', password: '12345', is_deleted: false },
];


const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

async function seedData() {
    try {

        await user.deleteMany();

        for (const userData of usersData) {
            userData.password = await hashPassword(userData.password);
          }
        await user.insertMany(usersData);

        console.log('Data seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        // Close the database connection
        await mongoose.disconnect();
        fastify.close();
    }
};

seedData();
