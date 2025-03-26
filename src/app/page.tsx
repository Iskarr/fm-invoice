"use client";
// pages/index.js
import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { PlusIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import SideBar from "@/components/Navbar";
import NoInvoice from "@/components/NoInvoice";
import FilterComponent from "@/components/FilterComponent";
import NewInvoiceForm from "@/components/NewInvoiceForm"; // Import the InvoiceForm component
import { Invoice } from "@/types";

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a reusable function to fetch invoices
  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/invoices");
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const data = await response.json();
      setInvoices(data);
      setFilteredInvoices(data); // Update filtered invoices as well
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setIsLoading(false);
    }
  }, []);

  // fetch invoices from API on initial load
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Function to format date to YY-MM-DD
  function formatShortDate(dateString: string) {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid

      // Get year as 2-digit
      const year = date.getFullYear().toString().slice(-2);
      // Get month with leading zero if needed
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      // Get day with leading zero if needed
      const day = date.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original on error
    }
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
      const response = await fetch(
        "http://localhost:3001/api/invoices/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceToSave),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save invoice");
      }

      const result = await response.json();

      // Close the form
      setShowInvoiceForm(false);

      // Refresh the invoice data after successful save
      fetchInvoices();
    } catch (error) {
      console.error("Error saving invoice:", error);
      // You might want to add error handling or user notification here
    }
  };

  return (
    <div className="flex h-screen">
      <SideBar />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 md:py-12 mt-20 md:mt-0 lg:mt-0">
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
            <h1 className="text-2xl md:text-3xl font-bold total-color">
              Invoices
            </h1>
            <p className="text-sm md:text-base total-color mt-1">
              {filteredInvoices.length > 0
                ? `${filteredInvoices.length} invoices`
                : "No invoices"}
            </p>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <FilterComponent
              invoices={invoices}
              setFilteredInvoices={setFilteredInvoices}
            />

            <button
              className="mark-paid-button flex items-center space-x-2 bg-(--primary-1) text-white px-2 md:px-4 py-2 md:py-3 rounded-3xl shadow"
              onClick={handleOpenNewInvoiceForm}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white new-invoice-button">
                <PlusIcon className="w-6 h-6 font-bold text-(--primary-1)" />
              </div>
              <span className="text-sm md:text-base">New Invoice</span>
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredInvoices.length > 0 ? (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/invoice/${invoice.id}`}
                className="block bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
              >
                {/* Mobile Layout (default) */}
                <div className="flex flex-col space-y-6 p-6 md:hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-500">
                      <span className="text-gray-500">#</span>
                      {invoice.id}
                    </span>
                    <span className="text-gray-500">{invoice.clientName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col space-y-2">
                      <span className="text-gray-500">
                        Due {formatShortDate(invoice.paymentDue)}
                      </span>
                      <span className="text-xl font-bold text-gray-800">
                        {invoice.total?.toLocaleString("en-GB", {
                          style: "currency",
                          currency: "GBP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

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
                  </div>
                </div>

                {/* Tablet/Desktop Layout */}
                <div className="hidden md:flex items-center justify-between p-6">
                  <div className="flex items-center space-x-6">
                    <span className="font-bold invoice-color">
                      <span className="hash-color">#</span>
                      {invoice.id}
                    </span>
                    <span className="due-date-color">
                      Due {formatShortDate(invoice.paymentDue)}
                    </span>
                    <span className="client-name-color">
                      {invoice.clientName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6">
                    <span className="text-xl font-bold total-color w-[140px] text-right">
                      {invoice.total?.toLocaleString("en-GB", {
                        style: "currency",
                        currency: "GBP",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md min-w-[104px] justify-center ${getStatusStyles(
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
                    <ChevronRightIcon className="w-6 h-6 font-bold text-[--primary-1] text-(--primary-1)" />
                  </div>
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
        <NewInvoiceForm
          showForm={showInvoiceForm}
          isNewInvoice={!selectedInvoice}
          onClose={handleCloseInvoiceForm}
          onSave={handleSaveInvoice}
        />
      )}
    </div>
  );
}
