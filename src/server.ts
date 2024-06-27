import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { initSentry } from './utils/sentry.ts';
import invoivceRoutes from './routes/invoiceRoutes.ts';
import * as Sentry from '@sentry/node';
import { connect } from './utils/mongoConnect.ts';

initSentry();

const fastify: FastifyInstance = Fastify({ logger: true });
fastify.register(invoivceRoutes);

const start = async () => {
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
        await fastify.listen({ port: 3000 });
        connect();
        fastify.log.info(`Server is running on port 3000`);
    } catch (err) {
        Sentry.captureException(err);
        fastify.log.error(err);
        process.exit(1);
    }

};

<<<<<<< HEAD

  
    // Declaration of a route that returns a simple "Hello" message

  const helloQuerySchema = {
    type: 'object',
    properties: {
      name: { type: 'string' }
    },
    required: []
  };

  fastify.get<{ Querystring: { name?: string } }>('/hello', {
    schema: {
      querystring: helloQuerySchema
    }
  }, async (request: FastifyRequest<{ Querystring: { name?: string } }>, reply: FastifyReply) => {
    try {
      const { name } = request.query;
      return { message: `Hello ${name || 'World'}` };
    } catch (error) {
      Sentry.captureException(error);
      reply.code(500).send({ error: 'An error occurred' });
    }
  });

    // decleration of a rout that throw an error
fastify.get('/error', async (request, reply) => {
    try {
        throw new Error('error!!!')
    } catch (error) {
        Sentry.captureException(error);
        reply.code(500).send({error: 'Error it is!'});
    }
});

// run the server

start();
=======
// run the server
start();
>>>>>>> 4ef9128 (changes)
