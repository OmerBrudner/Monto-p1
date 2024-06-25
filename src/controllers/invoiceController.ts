
import { FastifyReply, FastifyRequest } from 'fastify';
import { connect } from '../utils/mongoConnect.ts';
import { MontoInvoice } from '../models/invoiceModel.ts';

export const createInvoicesSchema = {
    body: {
        type: 'array',
        items: {
            type: 'object',
            required: ['portal_name', 'invoice_number', 'buyer', 'status', 'invoice_date', 'currency', 'total'],
            properties: {
                portal_name: { type: 'string' },
                invoice_number: { type: 'string' },
                po_number: { type: 'string' },
                buyer: { type: 'string' },
                status: {
                    type: 'string',
                    enum: ['Approved', 'Pending Approval', 'Paid', 'Rejected', 'Canceled'],
                },
                invoice_date: { type: 'string', format: 'date-time' },
                currency: { type: 'string' },
                total: { type: 'number' },
            },
        },
    },
};

// Route handler to create an invoice
export const createInvoices = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const db = await connect();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');

        let invoices: MontoInvoice[] = Array.isArray(req.body) ? req.body : [req.body];

        const result = await invoicesCollection.insertMany(invoices);
        reply.status(201).send({ message: 'Invoices created', ids: result.insertedIds });
    } catch (error) {
        console.error('Error while creating invoice', error);
        reply.status(500).send({ message: 'Error while creating invoices' });
    }
};

// Route handler to get invoices
export const getInvoices = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const db = await connect();
        const invoicesCollection = db.collection<MontoInvoice>('Invoices');
        const invoices = await invoicesCollection.find().toArray();
        reply.send(invoices);
    } catch (error) {
        console.error('Error while getting invoices', error);
        reply.status(500).send({ message: 'Error while getting invoices' });
    }
};


