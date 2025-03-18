"use client";
// pages/index.js
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
} from "@heroicons/react/20/solid";

export default function Home() {
  interface Invoice {
    id: string;
    $id?: string;
    paymentDue: string;
    clientName: string;
    total: number;
    status: string;
  }

  const [invoices, setInvoices] = useState<Invoice[]>([]);

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-24 bg-gray-800">
        <div className="flex items-center justify-center h-24 bg-purple-600 rounded-br-3xl">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <svg
                viewBox="0 0 28 24"
                className="w-8 h-8 text-white"
                fill="currentColor"
              >
                <path d="M10 20C10 22.2091 8.20914 24 6 24C3.79086 24 2 22.2091 2 20C2 17.7909 3.79086 16 6 16C8.20914 16 10 17.7909 10 20Z" />
                <path d="M26 20C26 22.2091 24.2091 24 22 24C19.7909 24 18 22.2091 18 20C18 17.7909 19.7909 16 22 16C24.2091 16 26 17.7909 26 20Z" />
                <path d="M8 10C8 13.3137 11.1863 16 14 16C16.8137 16 20 13.3137 20 10C20 6.68629 16.8137 4 14 4C11.1863 4 8 6.68629 8 10Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex items-center justify-center py-6 border-t border-gray-700">
          <div className="text-gray-400">
            <MoonIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center justify-center py-6 border-t border-gray-700">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
            />
          </div>
        </div>
      </div>

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
              {invoices.length > 0
                ? `There are ${invoices.length} total invoices`
                : "No invoices"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-3xl shadow">
              <span>Filter by status</span>
              <ChevronDownIcon className="w-4 h-4 text-purple-600" />
            </button>

            <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-3xl shadow">
              <PlusIcon className="w-4 h-4" />
              <span>New Invoice</span>
            </button>
          </div>
        </header>

        {invoices.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {invoices.map(
              (invoice, index) => (
                console.log(invoice.id),
                (
                  <Link
                    key={invoice.id || invoice.$id}
                    href={`/invoice/${invoice.id}`}
                    className={`flex items-center justify-between p-6 hover:bg-gray-50 cursor-pointer ${
                      index !== invoices.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-6">
                      <span className="font-bold text-gray-500">
                        #{invoice.id}
                      </span>
                      <span className="text-gray-500">
                        Due {invoice.paymentDue}
                      </span>
                      <span className="text-gray-700">
                        {invoice.clientName}
                      </span>
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
                )
              )
            )}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="max-w-xs mb-6">
              <img
                alt="No invoices"
                className="w-full"
                src="/assets/illustration-empty.svg"
                fetchPriority="low"
                loading="lazy"
                decoding="async"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              There is nothing here
            </h2>
            <p className="text-gray-500 text-center mb-4">
              Create an invoice by clicking the
              <br />
              New Invoice button and get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
