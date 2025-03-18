// create api call to localhost:3001/api/invoice endpoint
import axios from "axios";

export const getInvoices = async () => {
  const { data } = await axios.get("http://localhost:3001/api/invoice");
  return data;
};

export const createInvoice = async (invoice: any) => {
  const { data } = await axios.post(
    "http://localhost:3001/api/invoice",
    invoice
  );
  return data;
};

export const updateInvoice = async (id: any, invoice: any) => {
  const { data } = await axios.put(
    `http://localhost:3001/api/invoice/${id}`,
    invoice
  );
  return data;
};

export const deleteInvoice = async (id: any) => {
  const { data } = await axios.delete(
    `http://localhost:3001/api/invoice/${id}`
  );
  return data;
};

export const getInvoice = async (id: any) => {
  const { data } = await axios.get(`http://localhost:3001/api/invoice/${id}`);
  return data;
};

export const getInvoiceItems = async (id: any) => {
  const { data } = await axios.get(
    `http://localhost:3001/api/invoice/${id}/items`
  );
  return data;
};
