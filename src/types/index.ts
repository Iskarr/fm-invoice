interface InvoiceIdProps {
  params: Promise<{
    id: string;
  }>;
}

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

interface Invoice {
  id: string;
  $id?: string;
  paymentDue: string;
  clientName: string;
  status: string;
  createdAt?: string;
  description?: string;
  paymentTerms?: string;
  clientEmail?: string;
  clientAddress?: Address;
  senderAddress?: Address;
  items: InvoiceItem[];
  total: number;
}

export type { InvoiceIdProps, InvoiceItem, Address, Invoice };
