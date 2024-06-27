export const bodySchema = {
    body: {
        type: 'object',
        required: ['portal_name', 'invoice_number', 'buyer', 'status', 'invoice_date', 'currency', 'total'],
        properties: {
            id: { type: 'string' },
            portal_name: { type: 'string' },
            invoice_number: { type: 'string' },
            po_number: { type: 'string' },
            buyer: { type: 'string' },
            status: {
                type: 'string',
                enum: ['Approved', 'Pending Approval', 'Paid', 'Rejected', 'Canceled'],
            },
            invoice_date: { type: 'string', format: 'date-time' },
            invoice_date_start: { type: 'string', format: 'date-time' },
            invoice_date_end: { type: 'string', format: 'date-time' },
            currency: { type: 'string' },
            total: { type: 'number' },
        },
    }
};

export const querySchema = {
    querystring: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            portal_name: { type: 'string' },
            invoice_number: { type: 'string' },
            po_number: { type: 'string' },
            buyer: { type: 'string' },
            status: {
                type: 'string',
                enum: ['Approved', 'Pending Approval', 'Paid', 'Rejected', 'Canceled'],
            },
            invoice_date: { type: 'string', format: 'date-time' },
            invoice_date_start: { type: 'string', format: 'date-time' },
            invoice_date_end: { type: 'string', format: 'date-time' },
            currency: { type: 'string' },
            total: { type: 'number' },
        },
    }
};

export const helloQuerySchema = {
    querystring: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        required: [],
    }
};