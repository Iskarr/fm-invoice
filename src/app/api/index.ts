// Note: This API can work with either:
// - Local development: http://localhost:3001/api/invoices
// - Production: https://fm-invoice-backend.onrender.com/api/invoices

import axios from "axios";

const API_URL = "https://fm-invoice-backend.onrender.com/api/invoices";

export const getInvoices = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createInvoice = async (invoice: string) => {
  const { data } = await axios.post(API_URL, invoice);
  return data;
};

export const updateInvoice = async (id: string, invoice: string) => {
  const { data } = await axios.put(`${API_URL}/${id}`, invoice);
  return data;
};

export const deleteInvoice = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

export const getInvoice = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const getInvoiceItems = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/${id}/items`);
  return data;
};
