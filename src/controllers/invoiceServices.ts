import { MontoInvoice, MontoAuthentication, InvoiceFilters } from "src/models/models.ts";
import * as Sentry from '@sentry/node';

export async function scrapeInvoices(authentication: MontoAuthentication, filters?: InvoiceFilters): Promise<MontoInvoice[]> {
    const { authToken, expiration } = authentication;

    // Check if the token is expired
    if (Date.now() > expiration) {
        Sentry.captureException(new Error('Authentication expired'));
        throw new Error('Authentication expired');
    }

    const response = await fetch(process.env.API_URL!, {
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

    // apply filters
    let filteredInvoices = invoices;
    if (filters?.invoice_date_start && filters?.invoice_date_end) {
        filteredInvoices = filteredInvoices.filter(invoice =>
            invoice.invoice_date.getTime() >= filters.invoice_date_start!.getTime() &&
            invoice.invoice_date.getTime() <= filters.invoice_date_end!.getTime())
    }
    // if (filters?.invoice_date_start) {
    //     filteredInvoices = filteredInvoices.filter(invoice => invoice.invoice_date.getTime() >= filters.invoice_date_start!.getTime())
    // }
    // if (filters?.invoice_date_end) {
    //     filteredInvoices = filteredInvoices.filter(invoice => invoice.invoice_date.getTime() <= filters.invoice_date_end!.getTime())
    // }
    if (filters?.portal_name) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.portal_name === filters.portal_name)
    }
    if (filters?.status) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.status === filters.status)
    }
    return filteredInvoices;

}

/*PUPETEER CODE*/
/*
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

try {
    // setting the auth token
    await page.setCookie({ name: 'appSession', value: authToken, domain: 'backoffice.dev.montopay.com' });
    await page.goto('https://backoffice.dev.montopay.com/');

    // extract the invoices data
    const invoices = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('table > tbody > tr'));
        const invoicesData = rows.map(row => {
            const cells = row.querySelectorAll('td');
            return {
                //id: cells[0].textContent?.trim() || '', - no column in the monto invoice backoffice
                portal_name: cells[5].textContent?.trim() || '',
                invoice_number: cells[2].textContent?.trim() || '',
                //po_number: cells[3].textContent?.trim() || '', - no cloumn in the monto invoice backoffice
                buyer: cells[1].textContent?.trim() || '',
                status: cells[6].textContent?.trim() as MontoInvoiceStatus || 'Pending', // default status if there's no status
                invoice_date: new Date(cells[4].textContent?.trim() || ''),
                // currency: cells[7].textContent?.trim() || '', - no column in the monto invoice backoffice
                // total: parseFloat(cells[8].textContent?.replace(/[^0-9.-]+/g, '').trim() || '0'),
            };
        });
        return invoicesData;
    });

    let filteredInvoices = invoices;
    if (filters?.invoice_date_start) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.invoice_date.getTime() >= filters.invoice_date_start!.getTime())
    }
    if (filters?.invoice_date_end) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.invoice_date.getTime() <= filters.invoice_date_end!.getTime())
    }
    if (filters?.portal_name) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.portal_name === filters.portal_name)
    }
    if (filters?.status) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.status === filters.status)
    }

    // ensure date type
    return filteredInvoices.map(invoice => ({
        ...invoice,
        invoice_date: new Date(invoice.invoice_date)
    }));

} catch (error) {
    Sentry.captureException(error);
    throw new Error('Error while getting invoices');
} finally {
    await browser.close();
}
    */