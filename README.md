# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://www.fastify.io/docs/latest/).


<!-- flow -->

## routes 
1. user -> 
--> insertion :users are inserting in database from seed.js file
--> login : login route , match credentials , if wrong then return error.
--> authentication  : used redis and cookies.

2. Tasks ->
--> create task : task creation by post method , stores in cache memory also.
--> update task : update task , get task from cache and if not found then get it from database.
--> delete task : delete task from db , first get it from cache if not found get it from db and del it from cache too
--> task list : get task list user wise and show






