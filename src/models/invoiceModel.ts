export enum MontoInvoiceStatus {
  APPROVED = "Approved",
  PENDING_APPROVAL = "Pending Approval",
  PAID = "Paid",
  REJECTED = "Rejected",
  CANCELED = "Canceled",
};

export type MontoInvoice = {
  id: string;
  portal_name: string;
  invoice_number: string;
  po_number?: string;
  buyer: string;
  status: MontoInvoiceStatus;
  invoice_date: Date;
  currency: string;
  total: number;
};

// additional query parameters for date range, inorder to maintainthe original montoInvoice structure
export type MontoInvoiceQuery = Partial<MontoInvoice> & {
  invoice_date_start?: string;
  invoice_date_end?: string;
};
