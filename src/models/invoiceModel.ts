export enum MontoInvoiceStatus {
    APPROVED =  "Approved",
    PENDING_APPROVAL = "Pending Approval",
    PAID = "Paid",
    REJECTED = "Rejected",
    CANCELED = "Canceled",
  };
  
  export type MontoInvoice = {
    portal_name: string;
    invoice_number: string;
    po_number?: string;
    buyer: string;
    status: MontoInvoiceStatus;
    invoice_date: Date;
    currency: string;
    total: number;
  };
  