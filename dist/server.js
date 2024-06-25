import Fastify from 'fastify';
import * as Sentry from '@sentry/node';
// init Sentry
Sentry.init({
    dsn: process.env.DSN_SENTRY,
});
console.log(process.env.DSN_SENTRY);
const fastify = Fastify({ logger: true });
// decleration of a rout that says hello
fastify.get('/hello', async (request, reply) => {
    const { name } = request.query;
    return { message: `Hello ${name}` };
});
// decleration of a rout that throw an error
fastify.get('/error', async (request, reply) => {
    try {
        throw new Error('error!!!');
    }
    catch (error) {
        Sentry.captureException(error);
        reply.code(500).send({ error: 'Error it is!' });
    }
});
// run the server
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        fastify.log.info(`Server is running on port 3000`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map