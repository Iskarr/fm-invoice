interface InvoiceIdProps {
  params: Promise<{
    id: string;
  }>;
}

export interface Invoice {
  _id: string; // MongoDB _id field
  id: string; // Display ID
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: string;
  clientName: string;
  clientEmail: string;
  status: string;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export type { InvoiceIdProps };
