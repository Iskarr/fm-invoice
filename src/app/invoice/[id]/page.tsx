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
          className="px-4 py-2 bg-purple-600 text-white rounded-md"
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
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={handleGoBack}
        className="flex items-center text-purple-600 mb-8"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-2" />
        Go back
      </button>

      {/* Status bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center">
          <span className="text-gray-500 mr-4">Status</span>
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${getStatusStyles(
              invoice.status
            )}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${getStatusDot(invoice.status)}`}
            ></div>
            <span className="font-semibold">
              {capitalizeFirstLetter(invoice.status)}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            className="px-6 py-3 text-purple-600 bg-white border border-gray-200 rounded-3xl shadow"
            onClick={handleEditClick}
          >
            Edit
          </button>
          <button
            className="px-6 py-3 text-white bg-red-500 rounded-3xl shadow"
            onClick={handleDelete}
          >
            Delete
          </button>
          {invoice.status !== "paid" && (
            <button
              className="px-6 py-3 text-white bg-purple-600 rounded-3xl shadow"
              onClick={handleMarkAsPaid}
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice details */}
      <div className="bg-white rounded-lg shadow p-8">
        {/* Invoice header */}
        <div className="flex justify-between mb-12">
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-1">
              #{invoice.id}
            </h2>
            <p className="text-gray-500">
              {invoice.description || "Graphic Design"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">
              {invoice.senderAddress?.street || ""}
            </p>
            <p className="text-gray-500">{invoice.senderAddress?.city || ""}</p>
            <p className="text-gray-500">
              {invoice.senderAddress?.postCode || ""}
            </p>
            <p className="text-gray-500">
              {invoice.senderAddress?.country || ""}
            </p>
          </div>
        </div>

        {/* Invoice details */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div>
            <p className="text-gray-500 mb-2">Invoice Date</p>
            <p className="font-bold">{formatDate(invoice.createdAt)}</p>

            <p className="text-gray-500 mt-6 mb-2">Payment Due</p>
            <p className="font-bold">{formatDate(invoice.paymentDue)}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-2">Bill To</p>
            <p className="font-bold">{invoice.clientName || ""}</p>
            <p className="text-gray-500">
              {invoice.clientAddress?.street || ""}
            </p>
            <p className="text-gray-500">{invoice.clientAddress?.city || ""}</p>
            <p className="text-gray-500">
              {invoice.clientAddress?.postCode || ""}
            </p>
            <p className="text-gray-500">
              {invoice.clientAddress?.country || ""}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-2">Sent to</p>
            <p className="font-bold">{invoice.clientEmail || ""}</p>
          </div>
        </div>

        {/* Invoice items */}
        <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="grid grid-cols-12 text-gray-500 mb-4">
              <div className="col-span-5">Item Name</div>
              <div className="col-span-2 text-center">QTY.</div>
              <div className="col-span-3 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Map through invoice items */}
            {invoice.items &&
              invoice.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 mb-4 text-gray-700 font-bold"
                >
                  <div className="col-span-5">{item.name}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-3 text-right">
                    {item.price.toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </div>
                  <div className="col-span-2 text-right">
                    {(item.quantity * item.price).toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </div>
                </div>
              ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center bg-gray-800 p-6 text-white">
            <span>Amount Due</span>
            <span className="text-2xl font-bold">
              {invoice.total.toLocaleString("en-GB", {
                style: "currency",
                currency: "GBP",
              })}
            </span>
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
