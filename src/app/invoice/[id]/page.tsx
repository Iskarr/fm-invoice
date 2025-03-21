"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { InvoiceIdProps, Invoice } from "@/types";
import InvoiceEditForm from "@/components/InvoiceEditForm"; // Import the new component

export default function DetailPage({ params }: InvoiceIdProps) {
  const router = useRouter();
  // Unwrap params with React.use()
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  // use effect to fetch from localhost:3001/api/invoices/:id
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/invoices/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch invoice");
        }
        const data = await response.json();
        setInvoice(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleGoBack = () => {
    router.push("/");
  };

  const handleMarkAsPaid = async () => {
    console.log("Mark as paid");
    // Implementation would go here
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "paid" }),
      });
      if (!response.ok) {
        throw new Error("Failed to mark as paid");
      }
      router.push("/");
    } catch (error) {
      console.error("Error marking as paid:", error);
    }
  };

  const handleDelete = async () => {
    // confirm delete
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (!confirmDelete) return;
    // Implementation would go here
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete invoice");
      }
      router.push("/");
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const handleSaveInvoice = async (updatedInvoice: Invoice) => {
    // Implement the API call to update the invoice
    console.log("Saving changes", updatedInvoice);
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInvoice),
      });
      if (!response.ok) {
        throw new Error("Failed to update invoice");
      }
      router.push("/");
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Paid":
      case "paid":
        return "bg-green-100 text-green-600";
      case "Pending":
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "Draft":
      case "draft":
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Paid":
      case "paid":
        return "bg-green-500";
      case "Pending":
      case "pending":
        return "bg-yellow-500";
      case "Draft":
      case "draft":
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Force UTC interpretation to avoid timezone issues
    const utcDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
    );

    // Format as MM-DD-YYYY
    const month = String(utcDate.getMonth() + 1).padStart(2, "0");
    const day = String(utcDate.getDate()).padStart(2, "0");
    const year = utcDate.getFullYear();

    return `${month}-${day}-${year}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Invoice not found</p>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-purple-600 text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8FB]">
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-12 mt-20 md:mt-0 lg:mt-0">
        {/* Go back button */}
        <button
          onClick={handleGoBack}
          className="flex items-center text-[#7C5DFA] mb-6 font-bold"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          Go back
        </button>

        {/* Status bar */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
              <div className="flex items-center">
                <span className="text-[#7E88C3] mr-4">Status</span>
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md ${getStatusStyles(
                    invoice.status
                  )}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusDot(
                      invoice.status
                    )}`}
                  ></div>
                  <span className="font-semibold">
                    {capitalizeFirstLetter(invoice.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile buttons at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-6 flex justify-center space-x-2 md:hidden">
              <button
                className="px-6 py-3 text-[#7E88C3] bg-[#F9FAFE] hover:bg-[#DFE3FA] rounded-3xl font-bold"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="px-6 py-3 text-white bg-[#EC5757] hover:bg-[#FF9797] rounded-3xl font-bold"
                onClick={handleDelete}
              >
                Delete
              </button>
              {invoice.status !== "paid" && (
                <button
                  className="px-6 py-3 text-white bg-[#7C5DFA] hover:bg-[#9277FF] rounded-3xl font-bold"
                  onClick={handleMarkAsPaid}
                >
                  Mark as Paid
                </button>
              )}
            </div>

            {/* Desktop/Tablet buttons */}
            <div className="hidden md:flex space-x-2 mt-4 md:mt-0">
              <button
                className="px-6 py-3 text-[#7E88C3] bg-[#F9FAFE] hover:bg-[#DFE3FA] rounded-3xl font-bold"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="px-6 py-3 text-white bg-[#EC5757] hover:bg-[#FF9797] rounded-3xl font-bold"
                onClick={handleDelete}
              >
                Delete
              </button>
              {invoice.status !== "paid" && (
                <button
                  className="px-6 py-3 text-white bg-[#7C5DFA] hover:bg-[#9277FF] rounded-3xl font-bold"
                  onClick={handleMarkAsPaid}
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Invoice details */}
        <div className="bg-white rounded-lg shadow p-6 mb-24 md:mb-0">
          {/* Invoice header */}
          <div className="md:flex md:flex-row md:justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">
                <span className="text-[#7E88C3]">#</span>
                <span>{invoice.id}</span>
              </h2>
              <p className="text-[#7E88C3] text-sm">{invoice.description}</p>
            </div>

            {/* Sender Address - Hidden on mobile */}
            <div className="hidden md:block text-[#7E88C3] text-right">
              <p>{invoice.senderAddress?.street}</p>
              <p>{invoice.senderAddress?.city}</p>
              <p>{invoice.senderAddress?.postCode}</p>
              <p>{invoice.senderAddress?.country}</p>
            </div>

            {/* Sender Address - Mobile only */}
            <div className="text-[#7E88C3] text-sm mt-6 md:hidden">
              <p>{invoice.senderAddress?.street}</p>
              <p>{invoice.senderAddress?.city}</p>
              <p>{invoice.senderAddress?.postCode}</p>
              <p>{invoice.senderAddress?.country}</p>
            </div>
          </div>

          {/* Mobile layout for dates and billing info */}
          <div className="md:hidden mt-8">
            <div className="flex">
              <div className="flex-1">
                <div className="mb-6">
                  <p className="text-[#7E88C3] text-sm mb-3">Invoice Date</p>
                  <p className="font-bold">{formatDate(invoice.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[#7E88C3] text-sm mb-3">Payment Due</p>
                  <p className="font-bold">{formatDate(invoice.paymentDue)}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[#7E88C3] text-sm mb-3">Bill To</p>
                <p className="font-bold mb-2">{invoice.clientName}</p>
                <div className="text-[#7E88C3] text-sm">
                  <p>{invoice.clientAddress?.street}</p>
                  <p>{invoice.clientAddress?.city}</p>
                  <p>{invoice.clientAddress?.postCode}</p>
                  <p>{invoice.clientAddress?.country}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[#7E88C3] text-sm mb-3">Sent to</p>
              <p className="font-bold">{invoice.clientEmail}</p>
            </div>

            {/* Mobile view items */}
            <div className="md:hidden mt-8 bg-[#F9FAFE] rounded-lg overflow-hidden">
              <div className="p-6">
                {invoice.items?.map((item, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-2">
                      <p className="font-bold text-black">{item.name}</p>
                      <p className="font-bold text-black">
                        £{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-[#7E88C3] font-bold">
                      {item.quantity} x £{item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-[#373B53] p-6 rounded-b-lg text-white flex justify-between items-center">
                <span className="text-sm">Grand Total</span>
                <span className="text-xl font-bold">
                  £{invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet layout - hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 mb-8 md:mb-12">
            <div className="space-y-8">
              <div>
                <p className="text-[#7E88C3] mb-3">Invoice Date</p>
                <p className="font-bold text-black">
                  {formatDate(invoice.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-[#7E88C3] mb-3">Payment Due</p>
                <p className="font-bold text-black">
                  {formatDate(invoice.paymentDue)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[#7E88C3] mb-3">Bill To</p>
              <p className="font-bold text-black mb-2">{invoice.clientName}</p>
              <div className="text-[#7E88C3]">
                <p>{invoice.clientAddress?.street}</p>
                <p>{invoice.clientAddress?.city}</p>
                <p>{invoice.clientAddress?.postCode}</p>
                <p>{invoice.clientAddress?.country}</p>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <p className="text-[#7E88C3] mb-3">Sent to</p>
              <p className="font-bold text-black">{invoice.clientEmail}</p>
            </div>
          </div>

          {/* Tablet/Desktop view items */}
          <div className="hidden md:block mt-8 bg-[#F9FAFE] rounded-lg overflow-hidden">
            <div className="p-6">
              {invoice.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4 last:mb-0"
                >
                  <div className="flex-1">
                    <p className="font-bold text-black mb-2">{item.name}</p>
                    <p className="text-[#7E88C3] font-bold">
                      {item.quantity} x £{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-black text-right ml-4">
                    £{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#373B53] p-6 rounded-b-lg text-white flex justify-between items-center">
              <span className="text-sm">Grand Total</span>
              <span className="text-xl font-bold">
                £{invoice.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Edit Form Component */}
      {invoice && (
        <InvoiceEditForm
          invoice={invoice}
          showEditForm={showEditForm}
          onClose={handleCloseEditForm}
          onSave={handleSaveInvoice}
        />
      )}
    </div>
  );
}
