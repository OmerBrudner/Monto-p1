
import { FastifyReply, FastifyRequest } from 'fastify';
import { getDB } from '../utils/mongoConnect.ts';
import { MontoInvoice, MontoInvoiceQuery, InvoiceFilters } from '../models/models.ts';
import * as Sentry from '@sentry/node';
import { ObjectId } from 'mongodb';
import { getAuthToken } from './authentication.ts';
import { scrapeInvoices } from './invoiceServices.ts';
import { cacheGet, cacheSet } from '../utils/cache.ts';



// Rout handlet to say hello
export const sayHello = async (req: FastifyRequest<{ Querystring: { name?: string } }>, reply: FastifyReply) => {
    try {
        const { name } = req.query;
        return { message: `Hello ${name}` }; ``
    } catch (error) {
        Sentry.captureException(error);
        reply.code(500).send({ error: 'An error occurred' });
    }
}

// Route handler to create an invoice
export const createInvoice = async (req: FastifyRequest<{ Body: MontoInvoice }>, reply: FastifyReply) => {
    try {
        const db = await getDB();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');

        const invoice: MontoInvoice = req.body as MontoInvoice;

        const result = await invoicesCollection.insertOne(invoice);
        reply.status(201).send({ message: 'Invoice created', id: result.insertedId });
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error while creating invoice', error);
        reply.status(500).send({ message: 'Error while creating invoice' });
    }
};

// Route handler to create invoices
export const createInvoices = async (req: FastifyRequest<{ Body: MontoInvoice[] }>, reply: FastifyReply) => {
    try {
        const db = await getDB();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');

        const invoices: MontoInvoice[] = req.body as MontoInvoice[];

        for (const invoice of invoices) {
            await invoicesCollection.insertOne(invoice);
        }
        reply.status(201).send({ message: 'Invoices created' });
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error while creating invoices', error);
        reply.status(500).send({ message: 'Error while creating invoices' });
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

// Route handler to update an invoice
export const updateInvoice = async (req: FastifyRequest<{ Body: MontoInvoice }>, reply: FastifyReply) => {
    try {
        const db = await getDB();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');

        const invoice: MontoInvoice = req.body as MontoInvoice;
        const { id, ...updateFields } = invoice; // Destructuring the id and updateFields from the Invoice

        const result = await invoicesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }, // setting the updateFields
            { upsert: true }
        );
        if (result.upsertedCount > 0) {
            reply.status(201).send({ message: 'Invoice not found new invoice created', id: result.upsertedId });
        } else {
            reply.status(200).send({ message: 'Invoice updated', id: id })
        }
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error while updating invoice', error);
        reply.status(500).send({ message: 'Error while updating invoice' });
    }
}

//Route handler to delete an invoice
export const deleteInvoice = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
        const db = await getDB();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');
        const { id } = req.params;

        const result = await invoicesCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            reply.status(404).send({ message: 'Invoice not found' });
            return;
        }
        reply.status(200).send({ message: 'Invoice deleted', id: id });
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error while deleting invoice', error);
        reply.status(500).send({ message: 'Error while deleting invoice' });
    }
}

// Route handler to scrape invoices
export const getScrapedInvoices = async (req: FastifyRequest<{ Querystring: InvoiceFilters }>, reply: FastifyReply) => {
    try {
        const filters: InvoiceFilters = req.query;

        // generate a cache key
        const cacheKey = `scrapedInvoices:${JSON.stringify(filters)}`;
        const cachedData = await cacheGet(cacheKey);
        if (cachedData) {
            return reply.status(200).send(cachedData);
        }

        // get the authentication token
        const authToken = await getAuthToken({
            rootUrl: process.env.MONTO_URL!,
            userName: process.env.MONTO_USERNAME!,
            password: process.env.MONTO_PASSWORD!
        });

        // scrape invoices from service
        const scrapedInvoices = await scrapeInvoices(authToken, filters);

        // save the invoices to the database
        const db = await getDB();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');
        for (const invoice of scrapedInvoices) {
            const invoiceId = new ObjectId(invoice.id); // converts id to objectId of mongodb
            await invoicesCollection.updateOne(
                { _id: invoiceId }, // 
                { $set: { ...invoice, _id: invoiceId } }, // spreads all fields of invoice while explicitly setting _id to invoiceId
                { upsert: true } // ensures that if the invoice does not exist, it will be created
            );
        }

        await cacheSet(cacheKey, scrapedInvoices, 5 * 60 * 1000); // Cache for 5 minutes

        reply.status(200).send(scrapedInvoices);
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error while scraping invoices', error);
        reply.status(500).send({ message: 'Error while scraping invoices' });
    }
};
