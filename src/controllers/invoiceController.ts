
import { FastifyReply, FastifyRequest } from 'fastify';
import { connect } from '../utils/mongoConnect.ts';
import { MontoInvoice } from '../models/invoiceModel.ts';
import * as Sentry from '@sentry/node';


// Rout handlet to say hello
export const sayHello = async (req: FastifyRequest<{ Querystring: { name?: string } }>, reply: FastifyReply) => {
    try {
        const { name } = req.query;
        return { message: `Hello ${name || 'World'}` };
    } catch (error) {
        Sentry.captureException(error);
        reply.code(500).send({ error: 'An error occurred' });
    }
}

// Route handler to create an invoice without array
export const createInvoice = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const db = await connect();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');

        const invoice: MontoInvoice = req.body as MontoInvoice;

        const result = await invoicesCollection.insertOne(invoice);
        reply.status(201).send({ message: 'Invoice created', id: result.insertedId });
    } catch (error) {
        console.error('Error while creating invoice', error);
        reply.status(500).send({ message: 'Error while creating invoice' });
    }
};

// Route handler to get invoices
export const getInvoices = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        // Creating an empty object to store filters
        const filters: Record<string, any> = {};

        // Extracting qury parameters
        const queryParams = req.query as Partial<MontoInvoice>;

        // Building filters based on query parameters
        if (queryParams.portal_name) {
            filters.portal_name = queryParams.portal_name;
        }
        if (queryParams.invoice_number) {
            filters.invoice_number = queryParams.invoice_number;
        }
        if (queryParams.po_number) {
            filters.po_number = queryParams.po_number;
        }
        if (queryParams.buyer) {
            filters.buyer = queryParams.buyer;
        }
        if (queryParams.status) {
            filters.status = queryParams.status;
        }
        if (queryParams.invoice_date) {
            filters.invoice_date = new Date(queryParams.invoice_date);
        }
        if (queryParams.currency) {
            filters.currency = queryParams.currency;
        }
        if (queryParams.total) {
            filters.total = queryParams.total;
        }

        const db = await connect();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');
        const invoices = await invoicesCollection.find(filters).toArray();
        reply.send(invoices);
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error while getting invoices', error);
        reply.status(500).send({ message: 'Error while getting invoices' });
    }
};


