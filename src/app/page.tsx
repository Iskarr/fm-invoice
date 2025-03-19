"use client";
// pages/index.js
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { PlusIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import SideBar from "@/components/SideBar";
import NoInvoice from "@/components/NoInvoice";
import FilterComponent from "@/components/FilterComponent";
import InvoiceForm from "@/components/InvoiceForm"; // Import the InvoiceForm component
import { Invoice } from "@/types";

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/invoices");
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        setInvoices(data);
        setFilteredInvoices(data); // Initialize filtered invoices with all invoices
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getStatusStyles = (status: any) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Draft":
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusDot = (status: any) => {
    switch (status) {
      case "Paid":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Draft":
      default:
        return "bg-gray-500";
    }
  };

  // Function to handle opening the form for a new invoice
  const handleOpenNewInvoiceForm = () => {
    setSelectedInvoice(null); // Reset selected invoice
    setShowInvoiceForm(true); // Show the form
  };

  // Function to handle closing the form
  const handleCloseInvoiceForm = () => {
    setShowInvoiceForm(false);
  };

  // Function to handle saving a new or updated invoice
  const handleSaveInvoice = async (
    updatedInvoice: Invoice,
    saveAsDraft?: boolean
  ) => {
    try {
      // Prepare the invoice for saving
      const invoiceToSave = {
        ...updatedInvoice,
        status: saveAsDraft ? "draft" : "pending",
      };

      // API call to save the invoice
      const response = await fetch("http://localhost:3001/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceToSave),
      });

      if (!response.ok) {
        throw new Error("Failed to save invoice");
      }

      const savedInvoice = await response.json();

      // Update the local state
      if (selectedInvoice) {
        // Update existing invoice
        const updatedInvoices = invoices.map((inv) =>
          inv.id === savedInvoice.id ? savedInvoice : inv
        );
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
      } else {
        // Add new invoice
        const newInvoices = [...invoices, savedInvoice];
        setInvoices(newInvoices);
        setFilteredInvoices(newInvoices);
      }

      // Close the form
      setShowInvoiceForm(false);
    } catch (error) {
      console.error("Error saving invoice:", error);
      // You might want to add error handling or user notification here
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-8 py-12">
        <Head>
          <title>Invoices Dashboard</title>
          <meta
            name="description"
            content="Invoices dashboard built with Next.js and Tailwind CSS"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
            <p className="text-gray-500 mt-1">
              {filteredInvoices.length > 0
                ? `There are ${filteredInvoices.length} total invoices`
                : "No invoices"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <FilterComponent
              invoices={invoices}
              setFilteredInvoices={setFilteredInvoices}
            />

            <button
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-3xl shadow"
              onClick={handleOpenNewInvoiceForm}
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Invoice</span>
            </button>
          </div>
        </header>

        {filteredInvoices.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredInvoices.map((invoice, index) => (
              <Link
                key={invoice.id || invoice.$id}
                href={`/invoice/${invoice.id}`}
                className={`flex items-center justify-between p-6 hover:bg-gray-50 cursor-pointer ${
                  index !== filteredInvoices.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-6">
                  <span className="font-bold text-gray-500">#{invoice.id}</span>
                  <span className="text-gray-500">
                    Due {invoice.paymentDue}
                  </span>
                  <span className="text-gray-700">{invoice.clientName}</span>
                </div>

                <div className="flex items-center space-x-6">
                  <span className="text-xl font-bold text-gray-800">
                    {invoice.total?.toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </span>
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${getStatusStyles(
                      capitalizeFirstLetter(invoice.status)
                    )}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusDot(
                        capitalizeFirstLetter(invoice.status)
                      )}`}
                    ></div>
                    <span className="font-semibold">
                      {capitalizeFirstLetter(invoice.status)}
                    </span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-purple-600" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <NoInvoice />
        )}
      </div>

      {/* Invoice Form Component */}
      {showInvoiceForm && (
        <InvoiceForm
          showForm={showInvoiceForm}
          isNewInvoice={!selectedInvoice}
          onClose={handleCloseInvoiceForm}
          onSave={handleSaveInvoice}
        />
      )}
    </div>
  );
}
