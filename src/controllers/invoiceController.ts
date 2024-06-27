
import { FastifyReply, FastifyRequest } from 'fastify';
import { getDB } from '../utils/mongoConnect.ts';
import { MontoInvoice, MontoInvoiceQuery } from '../models/invoiceModel.ts';
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
export const createInvoice = async (req: FastifyRequest<{ Body: MontoInvoice }>, reply: FastifyReply) => {
    try {
        const db = await getDB();
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
export const getInvoices = async (req: FastifyRequest<{ Querystring: MontoInvoiceQuery }>, reply: FastifyReply) => {
    try {
        // Creating an empty object to store filters
        const filters: Record<string, any> = {};

        // Extracting qury parameters
        const queryParams = req.query;

        // Building filters based on query parameters
        if (queryParams.id) {
            filters._id = queryParams.id;
        }
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
        if (queryParams.invoice_date_start || queryParams.invoice_date_end) {
            filters.invoice_date = {};
            if (queryParams.invoice_date_start) {
                filters.invoice_date.$gte = new Date(queryParams.invoice_date_start);
            }
            if (queryParams.invoice_date_end) {
                filters.invoice_date.$lte = new Date(queryParams.invoice_date_end);
            }
        } else if (queryParams.invoice_date) {
            filters.invoice_date = new Date(queryParams.invoice_date);
        }
        if (queryParams.currency) {
            filters.currency = queryParams.currency;
        }
        if (queryParams.total) {
            filters.total = queryParams.total;
        }


        console.log('Filters:', filters);


        const db = await getDB();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');
        const invoices = await invoicesCollection.find(filters).toArray();
        reply.status(200).send(invoices);
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error while getting invoices', error);
        reply.status(500).send({ message: 'Error while getting invoices' });
    }
};


