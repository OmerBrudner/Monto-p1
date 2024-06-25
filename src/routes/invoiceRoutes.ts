import { FastifyInstance } from "fastify"; 
import { getInvoices, createInvoices, createInvoicesSchema } from "../controllers/invoiceController.ts";

async function routes(fastify: FastifyInstance) {
    // Define the routes and associate them with the controller functions
    fastify.get('/invoices', getInvoices);
    fastify.post('/invoices', { schema: createInvoicesSchema }, createInvoices); // directly associate the schema with a route
}

export default routes;