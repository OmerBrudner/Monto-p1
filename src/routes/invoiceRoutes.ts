import { FastifyInstance } from "fastify";
import { getInvoices, createInvoice, sayHello } from "../controllers/invoiceController.ts";
import { bodySchema, querySchema, helloQuerySchema } from "../models/schemas.ts";

async function routes(fastify: FastifyInstance) {
    // Define the routes and associate them with the controller functions
    fastify.get('/hello', { schema: helloQuerySchema }, sayHello);
    fastify.get('/invoices', { schema: querySchema }, getInvoices);
    fastify.post('/invoices', { schema: bodySchema }, createInvoice); // directly associate the schema with a route
}

export default routes;