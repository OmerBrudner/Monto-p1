import { FastifyInstance } from "fastify";
import { getInvoices, createInvoice, sayHello } from "../controllers/invoiceController.ts";
import { createInvoicesSchema, helloQuerySchema } from "../models/schemas.ts";

async function routes(fastify: FastifyInstance) {
    // Define the routes and associate them with the controller functions
    fastify.get('/hello', { schema: { querystring: helloQuerySchema } }, sayHello);
    fastify.get('/invoices', getInvoices);
    fastify.post('/invoices', { schema: createInvoicesSchema }, createInvoice); // directly associate the schema with a route
}

export default routes;