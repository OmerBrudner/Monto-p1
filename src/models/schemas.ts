export const createInvoicesSchema = {
    body: {
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
};

export const helloQuerySchema = {
    type: 'object',
    properties: {
        name: { type: 'string' }
    },
    required: [],
};