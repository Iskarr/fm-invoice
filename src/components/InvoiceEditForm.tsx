"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { XMarkIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Invoice, InvoiceItem } from "@/types";

interface InvoiceEditFormProps {
  invoice: Invoice;
  showEditForm: boolean;
  onClose: () => void;
  onSave: (updatedInvoice: Invoice) => void;
}

export default function InvoiceEditForm({
  invoice,
  showEditForm,
  onClose,
  onSave,
}: InvoiceEditFormProps) {
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const [paymentTerms, setPaymentTerms] = useState<string>("Net 30 Days");
  const [animateForm, setAnimateForm] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [animateOverlay, setAnimateOverlay] = useState<boolean>(false);

  // Initialize the form when the invoice changes
  useEffect(() => {
    if (invoice) {
      setEditedInvoice(invoice);

      // Set payment terms based on the invoice if available
      if (invoice.paymentTerms) {
        setPaymentTerms(invoice.paymentTerms);
      }
    }
  }, [invoice]);

  // Handle form animations
  useEffect(() => {
    if (showEditForm) {
      // Trigger animation after a small delay to ensure the component is rendered
      setTimeout(() => {
        setAnimateForm(true);
        setAnimateOverlay(true);
      }, 10);
    } else {
      setAnimateForm(false);
      setAnimateOverlay(false);
    }
  }, [showEditForm]);

  // Body scroll lock
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

  const handleCloseEditForm = () => {
    setAnimateForm(false);
    setAnimateOverlay(false);
    // Delay closing until animation completes
    setTimeout(() => onClose(), 300);
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
    if (!editedInvoice) return;

    // Update payment terms in the invoice
    const updatedInvoice = {
      ...editedInvoice,
      paymentTerms: paymentTerms,
    };

    // Call the parent's onSave method with the updated invoice
    onSave(updatedInvoice);
  };

  if (!showEditForm || !editedInvoice) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden mt-20 md:mt-20 lg:ml-24 lg:mt-0">
      {/* Light gray overlay with fade effect */}
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-in-out faded-background"
        onClick={handleCloseEditForm}
      ></div>

      {/* Form Container */}
      <div
        className="top-0 bg-white shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl h-screen overflow-y-auto transform transition-all duration-300 ease-in-out z-10"
        style={{
          transform: animateForm ? "translateX(0)" : "translateX(-100%)",
          opacity: animateForm ? 1 : 0,
        }}
      >
        {/* Go Back button */}
        <div className="p-4 bg-white sticky top-0 z-10 form-background">
          <button
            type="button"
            onClick={handleCloseEditForm}
            className="flex items-center text-[#7C5DFA] font-bold"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Go back
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 form-background sticky top-[56px] z-10">
          <h2 className="text-lg md:text-xl font-bold total-color">
            Edit <span className="text-[#7C5DFA]">#{editedInvoice.id}</span>
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 md:pb-4 pb-0 relative form-background"
        >
          {/* Bill From */}
          <div className="mb-6">
            <h3 className="text-[#7C5DFA] font-bold mb-3">Bill From</h3>

            <div className="mb-3">
              <label className="block text-sm text-gray-500 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="senderStreet"
                value={editedInvoice.senderAddress?.street || ""}
                onChange={(e) =>
                  handleInputChange(e, "senderAddress", "street")
                }
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-1">City</label>
                <input
                  type="text"
                  name="senderCity"
                  value={editedInvoice.senderAddress?.city || ""}
                  onChange={(e) =>
                    handleInputChange(e, "senderAddress", "city")
                  }
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Post Code
                </label>
                <input
                  type="text"
                  name="senderPostCode"
                  value={editedInvoice.senderAddress?.postCode || ""}
                  onChange={(e) =>
                    handleInputChange(e, "senderAddress", "postCode")
                  }
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm text-gray-500 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="senderCountry"
                  value={editedInvoice.senderAddress?.country || ""}
                  onChange={(e) =>
                    handleInputChange(e, "senderAddress", "country")
                  }
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-6">
            <h3 className="text-[#7C5DFA] font-bold mb-3">Bill To</h3>

            <div className="mb-3">
              <label className="block text-sm text-gray-500 mb-1">
                Client&apos;s Name
              </label>
              <input
                type="text"
                name="clientName"
                value={editedInvoice.clientName || ""}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-500 mb-1">
                Client&apos;s Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={editedInvoice.clientEmail || ""}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-500 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="clientStreet"
                value={editedInvoice.clientAddress?.street || ""}
                onChange={(e) =>
                  handleInputChange(e, "clientAddress", "street")
                }
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-500 mb-1">City</label>
                <input
                  type="text"
                  name="clientCity"
                  value={editedInvoice.clientAddress?.city || ""}
                  onChange={(e) =>
                    handleInputChange(e, "clientAddress", "city")
                  }
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Post Code
                </label>
                <input
                  type="text"
                  name="clientPostCode"
                  value={editedInvoice.clientAddress?.postCode || ""}
                  onChange={(e) =>
                    handleInputChange(e, "clientAddress", "postCode")
                  }
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm text-gray-500 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="clientCountry"
                  value={editedInvoice.clientAddress?.country || ""}
                  onChange={(e) =>
                    handleInputChange(e, "clientAddress", "country")
                  }
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
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
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              >
                <option value="Net 1 Day">Net 1 Day</option>
                <option value="Net 7 Days">Net 7 Days</option>
                <option value="Net 14 Days">Net 14 Days</option>
                <option value="Net 30 Days">Net 30 Days</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-gray-500 mb-1">
                Project Description
              </label>
              <input
                type="text"
                name="description"
                value={editedInvoice.description || ""}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Item List */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Item List</h3>

            <div className="grid grid-cols-12 text-xs text-gray-500 mb-2 px-2">
              <div className="col-span-5">Item Name</div>
              <div className="col-span-2 text-center">Qty.</div>
              <div className="col-span-3 text-right">Price</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            <div className="max-h-60 overflow-y-auto pr-1">
              {editedInvoice.items &&
                editedInvoice.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-1 mb-3 items-center"
                  >
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        className="w-full p-2 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full p-2 border border-gray-200 rounded-md text-center text-sm"
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
                        className="w-full p-2 border border-gray-200 rounded-md text-right text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-1 text-right font-bold text-xs">
                      {(item.quantity * item.price).toFixed(2)}
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <button
              type="button"
              onClick={addNewItem}
              className="add-item-button w-full py-4 rounded-3xl font-bold mt-4"
            >
              + Add New Item
            </button>
          </div>

          {/* Button container */}
          <div className="sticky bottom-0 w-full">
            <div className="p-6">
              {/* Mobile buttons (stacked) */}
              <div className="flex flex-col gap-2 md:hidden">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="discard-button w-full py-4 rounded-3xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-and-send-button w-full py-4 rounded-3xl font-bold"
                >
                  Save Changes
                </button>
              </div>

              {/* Tablet/Desktop buttons */}
              <div className="hidden md:flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="discard-button py-4 px-6 rounded-3xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-and-send-button py-4 px-6 rounded-3xl font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
