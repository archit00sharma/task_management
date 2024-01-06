

const { authController } = require('../../controllers');

module.exports = async function (fastify, opts) {
    fastify.register(authController);

    fastify.post(
        "/login",
        {
            handler: async (request, reply) => {
                try {
                    await fastify.authController.userLogin(request, reply)
                } catch (err) {
                    throw fastify.httpErrors.createError(err.status || 500, err.message);
                }
            },
        },
    );

}