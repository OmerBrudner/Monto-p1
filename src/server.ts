import Fastify, { FastifyInstance } from 'fastify';
import { initSentry } from './utils/sentry.ts';
import invoivceRoutes from './routes/invoiceRoutes.ts';
import * as Sentry from '@sentry/node';
import { getDB } from './utils/mongoConnect.ts';

initSentry();

const fastify: FastifyInstance = Fastify({ logger: true });
fastify.register(invoivceRoutes);

const start = async () => {
    try {
        await getDB();
        const port = process.env.PORT ? parseInt(process.env.PORT!, 10) : 3000;
        await fastify.listen({ port });
        fastify.log.info(`Server is running on port 3000`);
    } catch (err) {
        Sentry.captureException(err);
        fastify.log.error(err);
        process.exit(1);
    }
};

(async () => {
    await start();
}
)();

