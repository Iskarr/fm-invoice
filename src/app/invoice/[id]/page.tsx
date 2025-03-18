"use client";

import React from "react";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";

// Define TypeScript interfaces
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
  $id: string;
  id: string;
  status: string;
  description?: string;
  clientName: string;
  clientEmail: string;
  createdAt: string;
  paymentDue: string;
  clientAddress?: Address;
  senderAddress?: Address;
  items: InvoiceItem[];
  total: number;
}

export default function DetailPage({ params }: InvoiceIdProps) {
  const router = useRouter();
  // Unwrap params with React.use()
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  console.log(id);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [animateForm, setAnimateForm] = useState<boolean>(false);
  const [animateOverlay, setAnimateOverlay] = useState<boolean>(false);
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const [paymentTerms, setPaymentTerms] = useState<string>("Net 30 Days");

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
        setEditedInvoice(data);
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

  // Effect to handle body scroll lock when modal is open
  useEffect(() => {
    if (showEditForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showEditForm]);

  const handleGoBack = () => {
    router.push("/");
  };

  const handleMarkAsPaid = async () => {
    console.log("Mark as paid");
    // Implementation would go here
  };

  const handleDelete = async () => {
    console.log("Delete invoice");
    // Implementation would go here
  };

  const handleEditClick = () => {
    setShowEditForm(true);
    // Trigger animation after a small delay to ensure the component is rendered
    setTimeout(() => {
      setAnimateForm(true);
      setAnimateOverlay(true);
    }, 10);
  };

  const handleCloseEditForm = () => {
    setAnimateForm(false);
    setAnimateOverlay(false);
    // Delay hiding the form until animation completes
    setTimeout(() => setShowEditForm(false), 300);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section?: string,
    field?: string
  ) => {
    if (!editedInvoice) return;

    if (section && field) {
      // For nested objects like addresses
      if (section === "senderAddress" && editedInvoice.senderAddress) {
        setEditedInvoice({
          ...editedInvoice,
          senderAddress: {
            ...editedInvoice.senderAddress,
            [field]: e.target.value,
          },
        });
      } else if (section === "clientAddress" && editedInvoice.clientAddress) {
        setEditedInvoice({
          ...editedInvoice,
          clientAddress: {
            ...editedInvoice.clientAddress,
            [field]: e.target.value,
          },
        });
      }
    } else {
      // For top-level fields
      setEditedInvoice({
        ...editedInvoice,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    if (!editedInvoice) return;

    const newItems = [...editedInvoice.items];
    if (field === "quantity" || field === "price") {
      newItems[index][field] = parseFloat(value);
    } else {
      newItems[index][field] = value;
    }

    // Recalculate total
    const total = newItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    setEditedInvoice({
      ...editedInvoice,
      items: newItems,
      total: total,
    });
  };

  const addNewItem = () => {
    if (!editedInvoice) return;

    setEditedInvoice({
      ...editedInvoice,
      items: [...editedInvoice.items, { name: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    if (!editedInvoice) return;

    const newItems = [...editedInvoice.items];
    newItems.splice(index, 1);

    // Recalculate total
    const total = newItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    setEditedInvoice({
      ...editedInvoice,
      items: newItems,
      total: total,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Saving changes", editedInvoice);

    // Here you would implement the API call to update the invoice
    try {
      // For demonstration purposes, we're just updating the local state
      // In a real application, you would make an API call here

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Close the form with animation
      handleCloseEditForm();

      // Update the invoice state with the edited version
      setInvoice(editedInvoice);
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
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

      {/* Edit Invoice Form Overlay - Side Drawer (Left Side) with Gray Fade */}
      {showEditForm && editedInvoice && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Light gray overlay with fade effect */}
          <div
            className="absolute inset-0 transition-opacity duration-300 ease-in-out"
            style={{
              backgroundColor: "rgba(229, 231, 235, 0.75)",
              opacity: animateOverlay ? 1 : 0,
            }}
            onClick={handleCloseEditForm}
          ></div>

          <div
            className="relative bg-white shadow-lg w-full max-w-xl h-screen overflow-y-auto transform transition-all duration-300 ease-in-out z-10"
            style={{
              transform: animateForm ? "translateX(0)" : "translateX(-100%)",
              opacity: animateForm ? 1 : 0,
            }}
          >
            <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Edit{" "}
                <span className="text-purple-600">#{editedInvoice.id}</span>
              </h2>
              <button
                onClick={handleCloseEditForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Bill From */}
              <div className="mb-8">
                <h3 className="text-purple-600 font-medium mb-4">Bill From</h3>

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="senderStreet"
                    value={editedInvoice.senderAddress?.street || ""}
                    onChange={(e) =>
                      handleInputChange(e, "senderAddress", "street")
                    }
                    className="w-full p-3 border border-gray-200 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="senderCity"
                      value={editedInvoice.senderAddress?.city || ""}
                      onChange={(e) =>
                        handleInputChange(e, "senderAddress", "city")
                      }
                      className="w-full p-3 border border-gray-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Post Code
                    </label>
                    <input
                      type="text"
                      name="senderPostCode"
                      value={editedInvoice.senderAddress?.postCode || ""}
                      onChange={(e) =>
                        handleInputChange(e, "senderAddress", "postCode")
                      }
                      className="w-full p-3 border border-gray-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="senderCountry"
                      value={editedInvoice.senderAddress?.country || ""}
                      onChange={(e) =>
                        handleInputChange(e, "senderAddress", "country")
                      }
                      className="w-full p-3 border border-gray-200 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-8">
                <h3 className="text-purple-600 font-medium mb-4">Bill To</h3>

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-2">
                    Client's Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={editedInvoice.clientName || ""}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-3 border border-gray-200 rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-2">
                    Client's Email
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={editedInvoice.clientEmail || ""}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-3 border border-gray-200 rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="clientStreet"
                    value={editedInvoice.clientAddress?.street || ""}
                    onChange={(e) =>
                      handleInputChange(e, "clientAddress", "street")
                    }
                    className="w-full p-3 border border-gray-200 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="clientCity"
                      value={editedInvoice.clientAddress?.city || ""}
                      onChange={(e) =>
                        handleInputChange(e, "clientAddress", "city")
                      }
                      className="w-full p-3 border border-gray-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Post Code
                    </label>
                    <input
                      type="text"
                      name="clientPostCode"
                      value={editedInvoice.clientAddress?.postCode || ""}
                      onChange={(e) =>
                        handleInputChange(e, "clientAddress", "postCode")
                      }
                      className="w-full p-3 border border-gray-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="clientCountry"
                      value={editedInvoice.clientAddress?.country || ""}
                      onChange={(e) =>
                        handleInputChange(e, "clientAddress", "country")
                      }
                      className="w-full p-3 border border-gray-200 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    name="createdAt"
                    value={
                      editedInvoice.createdAt
                        ? new Date(editedInvoice.createdAt)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-3 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    Payment Terms
                  </label>
                  <select
                    name="paymentTerms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md"
                  >
                    <option value="Net 1 Day">Net 1 Day</option>
                    <option value="Net 7 Days">Net 7 Days</option>
                    <option value="Net 14 Days">Net 14 Days</option>
                    <option value="Net 30 Days">Net 30 Days</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-500 mb-2">
                    Project Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={editedInvoice.description || ""}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-3 border border-gray-200 rounded-md"
                  />
                </div>
              </div>

              {/* Item List */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-700 mb-4">
                  Item List
                </h3>

                <div className="grid grid-cols-12 text-sm text-gray-500 mb-2 p-2">
                  <div className="col-span-5">Item Name</div>
                  <div className="col-span-2 text-center">Qty.</div>
                  <div className="col-span-3 text-right">Price</div>
                  <div className="col-span-1 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {editedInvoice.items &&
                  editedInvoice.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 mb-4 items-center"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(index, "name", e.target.value)
                          }
                          className="w-full p-3 border border-gray-200 rounded-md"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          className="w-full p-3 border border-gray-200 rounded-md text-center"
                          min="1"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(index, "price", e.target.value)
                          }
                          className="w-full p-3 border border-gray-200 rounded-md text-right"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-1 text-right font-bold">
                        {(item.quantity * item.price).toFixed(2)}
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                <button
                  type="button"
                  onClick={addNewItem}
                  className="w-full p-3 mt-4 bg-gray-100 text-purple-600 font-medium rounded-md hover:bg-gray-200"
                >
                  + Add New Item
                </button>
              </div>

              <div className="flex justify-between mt-6 sticky bottom-0 bg-white p-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="px-6 py-3 bg-gray-200 text-gray-600 rounded-3xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-3xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
