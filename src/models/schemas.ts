export const helloQuerySchema = {
    querystring: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                maxLength: 100
            }
        },
        required: [],
    }
};

export const bodySchema = {
    body: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                maxLength: 100
            },
            portal_name: {
                type: 'string',
                maxLength: 100
            },
            invoice_number: {
                type: 'string',
                maxLength: 100
            },
            po_number: {
                type: 'string',
                maxLength: 100
            },
            buyer: {
                type: 'string',
                maxLength: 100
            },
            status: {
                type: 'string',
                enum: ['Approved', 'Pending Approval', 'Paid', 'Rejected', 'Canceled'],
            },
            invoice_date: { type: 'string', format: 'date-time' },
            invoice_date_start: { type: 'string', format: 'date-time' },
            invoice_date_end: { type: 'string', format: 'date-time' },
            currency: { type: 'string' },
            total: {
                type: 'number',
                minimum: 0
            },
        },
        required: ['portal_name', 'invoice_number', 'buyer', 'status', 'invoice_date', 'currency', 'total'],
    }
};

export const arraySchema = {
    body: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    maxLength: 100
                },
                portal_name: {
                    type: 'string',
                    maxLength: 100
                },
                invoice_number: {
                    type: 'string',
                    maxLength: 100
                },
                po_number: {
                    type: 'string',
                    maxLength: 100
                },
                buyer: {
                    type: 'string',
                    maxLength: 100
                },
                status: {
                    type: 'string',
                    enum: ['Approved', 'Pending Approval', 'Paid', 'Rejected', 'Canceled'],
                },
                invoice_date: { type: 'string', format: 'date-time' },
                invoice_date_start: { type: 'string', format: 'date-time' },
                invoice_date_end: { type: 'string', format: 'date-time' },
                currency: { type: 'string' },
                total: {
                    type: 'number',
                    minimum: 0
                },
            },
            required: ['portal_name', 'invoice_number', 'buyer', 'status', 'invoice_date', 'currency', 'total'],
        }
    }
};

export const querySchema = {
    querystring: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                maxLength: 100
            },
            portal_name: {
                type: 'string',
                maxLength: 100
            },
            invoice_number: {
                type: 'string',
                maxLength: 100
            },
            po_number: {
                type: 'string',
                maxLength: 100
            },
            buyer: {
                type: 'string',
                maxLength: 100
            },
            status: {
                type: 'string',
                enum: ['Approved', 'Pending Approval', 'Paid', 'Rejected', 'Canceled'],
            },
            invoice_date: { type: 'string', format: 'date-time' },
            invoice_date_start: { type: 'string', format: 'date-time' },
            invoice_date_end: { type: 'string', format: 'date-time' },
            currency: { type: 'string' },
            total: {
                type: 'number',
                minimum: 0
            },
        },
        required: [],
    }
};

export const updateSchema = {
    body: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                maxLength: 100
            },
            portal_name: {
                type: 'string',
                maxLength: 100
            },
            invoice_number: {
                type: 'string',
                maxLength: 100
            },
            po_number: {
                type: 'string',
                maxLength: 100
            },
            buyer: {
                type: 'string',
                maxLength: 100
            },
            status: {
                type: 'string',
                enum: ['Approved', 'Pending Approval', 'Paid', 'Rejected', 'Canceled'],
            },
            invoice_date: { type: 'string', format: 'date-time' },
            invoice_date_start: { type: 'string', format: 'date-time' },
            invoice_date_end: { type: 'string', format: 'date-time' },
            currency: { type: 'string' },
            total: {
                type: 'number',
                minimum: 0
            },
        },
        required: ['id'],
    }
};

export const deleteSchema = {
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                maxLength: 100
            }
        },
        required: ['id'],
    }
};