import { MontoInvoice, MontoAuthentication, InvoiceFilters } from "src/models/models.ts";
import * as Sentry from '@sentry/node';

export async function scrapeInvoices(authentication: MontoAuthentication, filters?: InvoiceFilters): Promise<MontoInvoice[]> {
    const { authToken, expiration } = authentication;

    // Check if the token is expired
    if (Date.now() > expiration) {
        Sentry.captureException(new Error('Authentication expired'));
        throw new Error('Authentication expired');
    }
    const urlApi = `https://backoffice.dev.montopay.com/${process.env.API_URL!}`;
    const response = await fetch(urlApi, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `appSession=${authToken}`,
            'Referer': 'https://backoffice.dev.montopay.com/invoices?tab=new'
        }
    });

    if (!response.ok) {
        Sentry.captureException(new Error('Error while fetching invoices'));
        throw new Error('Error while fetching invoices');
    }

    const invoices: MontoInvoice[] = await response.json();
    // Convert string dates to Date objects
    const convertedInvoices = invoices.map(invoice => ({
        ...invoice,
        invoice_date: new Date(invoice.invoice_date),
    }));
    // apply filters
    let filteredInvoices = convertedInvoices;
    if (filters?.invoice_date_start && filters?.invoice_date_end) {
        // convertion to date object for the comparison
        const startDate = new Date(filters.invoice_date_start);
        const endDate = new Date(filters.invoice_date_end);

        filteredInvoices = filteredInvoices.filter(invoice =>
            invoice.invoice_date.getTime() >= startDate.getTime() &&
            invoice.invoice_date.getTime() <= endDate.getTime()
        );
    }
    if (filters?.portal_name) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.portal_name === filters.portal_name)
    }
    if (filters?.status) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.status === filters.status)
    }
    return filteredInvoices;

}

