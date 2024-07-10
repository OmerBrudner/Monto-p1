import { FastifyInstance } from "fastify";
import { sayHello, getInvoices, createInvoice, createInvoices, updateInvoice, deleteInvoice } from "../controllers/invoiceController.ts";
import { helloQuerySchema, querySchema, bodySchema, arraySchema, updateSchema, deleteSchema } from "../models/schemas.ts";

async function routes(fastify: FastifyInstance) {
    // Define the routes and associate them with the controller functions
    fastify.get('/hello', { schema: helloQuerySchema }, sayHello); // directly associate the schema with a route
    fastify.get('/invoices', { schema: querySchema }, getInvoices);
    fastify.post('/invoice', { schema: bodySchema }, createInvoice);
    fastify.post('/invoices', { schema: arraySchema }, createInvoices);
    fastify.put('/invoices/:id', { schema: updateSchema }, updateInvoice);
    fastify.delete('/invoices/:id', { schema: deleteSchema }, deleteInvoice);

}

export default routes;