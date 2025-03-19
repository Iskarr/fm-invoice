"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Invoice, InvoiceItem, Address } from "@/types";

interface InvoiceFormProps {
  invoice?: Invoice | null; // Optional for new invoice creation
  showForm: boolean;
  isNewInvoice: boolean; // Flag to determine if creating new or editing
  onClose: () => void;
  onSave: (updatedInvoice: Invoice, saveAsDraft?: boolean) => void;
}

export default function InvoiceForm({
  invoice,
  showForm,
  isNewInvoice,
  onClose,
  onSave,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<Invoice | null>(null);
  const [paymentTerms, setPaymentTerms] = useState<string>("Net 30 Days");
  const [animateForm, setAnimateForm] = useState<boolean>(false);
  const [animateOverlay, setAnimateOverlay] = useState<boolean>(false);

  // Initialize the form when opened
  useEffect(() => {
    if (isNewInvoice) {
      // Create empty invoice template for new invoice
      const newInvoice: Invoice = {
        id: generateInvoiceId(),
        createdAt: new Date().toISOString().split("T")[0],
        paymentDue: calculateDueDate(new Date(), 30),
        description: "",
        paymentTerms: "Net 30 Days",
        clientName: "",
        clientEmail: "",
        status: "draft",
        senderAddress: {
          street: "",
          city: "",
          postCode: "",
          country: "",
        },
        clientAddress: {
          street: "",
          city: "",
          postCode: "",
          country: "",
        },
        items: [{ name: "", quantity: 1, price: 0 }],
        total: 0,
        $id: "",
      };
      setFormData(newInvoice);
      setPaymentTerms("Net 30 Days");
    } else if (invoice) {
      // Use existing invoice for edit mode
      setFormData(invoice);

      // Set payment terms based on the invoice if available
      if (invoice.paymentTerms) {
        setPaymentTerms(invoice.paymentTerms);
      }
    }
  }, [invoice, isNewInvoice, showForm]);

  // Handle form animations
  useEffect(() => {
    if (showForm) {
      // Trigger animation after a small delay to ensure the component is rendered
      setTimeout(() => {
        setAnimateForm(true);
        setAnimateOverlay(true);
      }, 10);
    } else {
      setAnimateForm(false);
      setAnimateOverlay(false);
    }
  }, [showForm]);

  // Body scroll lock
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm]);

  const handleCloseForm = () => {
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
    if (!formData) return;

    if (section && field) {
      // For nested objects like addresses
      if (section === "senderAddress" && formData.senderAddress) {
        setFormData({
          ...formData,
          senderAddress: {
            ...formData.senderAddress,
            [field]: e.target.value,
          },
        });
      } else if (section === "clientAddress" && formData.clientAddress) {
        setFormData({
          ...formData,
          clientAddress: {
            ...formData.clientAddress,
            [field]: e.target.value,
          },
        });
      }
    } else {
      // For top-level fields
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handlePaymentTermsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!formData) return;

    const terms = e.target.value;
    setPaymentTerms(terms);

    // Update payment due date based on selected terms
    const days = parseInt(terms.match(/\d+/)?.[0] || "30");
    const dueDate = calculateDueDate(
      new Date(formData.createdAt || new Date()),
      days
    );

    setFormData({
      ...formData,
      paymentTerms: terms,
      paymentDue: dueDate,
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    if (!formData) return;

    const newItems = [...formData.items];
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

    setFormData({
      ...formData,
      items: newItems,
      total: total,
    });
  };

  const addNewItem = () => {
    if (!formData) return;

    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    if (!formData) return;

    const newItems = [...formData.items];
    newItems.splice(index, 1);

    // Recalculate total
    const total = newItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    setFormData({
      ...formData,
      items: newItems,
      total: total,
    });
  };

  const handleSubmit = async (e: FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    if (!formData) return;

    const finalInvoice = {
      ...formData,
      paymentTerms: paymentTerms,
      status: saveAsDraft
        ? "draft"
        : isNewInvoice
        ? "pending"
        : formData.status,
    };

    // Call the parent's onSave method with the updated invoice
    onSave(finalInvoice, saveAsDraft);
  };

  // Helper to generate random invoice ID
  const generateInvoiceId = (): string => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    let id = "";

    // Add 2 random letters
    for (let i = 0; i < 2; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Add 4 random numbers
    for (let i = 0; i < 4; i++) {
      id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return id;
  };

  // Helper to calculate due date based on payment terms
  const calculateDueDate = (date: Date, days: number): string => {
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate.toISOString().split("T")[0];
  };

  if (!showForm || !formData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden ml-16">
      {/* Light gray overlay with fade effect */}
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-in-out"
        style={{
          backgroundColor: "rgba(229, 231, 235, 0.75)",
          opacity: animateOverlay ? 1 : 0,
        }}
        onClick={handleCloseForm}
      ></div>

      {/* Form Container - Responsive width */}
      <div
        className="pl-8 relative bg-white shadow-lg w-full max-w-md md:max-w-lg lg:max-w-2xl h-screen overflow-y-auto transform transition-all duration-300 ease-in-out z-10"
        style={{
          transform: animateForm ? "translateX(0)" : "translateX(-100%)",
          opacity: animateForm ? 1 : 0,
        }}
      >
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            {isNewInvoice ? (
              "New Invoice"
            ) : (
              <>
                Edit <span className="text-purple-600">#{formData.id}</span>
              </>
            )}
          </h2>
          <button
            onClick={handleCloseForm}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="p-4">
          {/* Bill From */}
          <div className="mb-6">
            <h3 className="text-purple-600 font-medium mb-3">Bill From</h3>

            <div className="mb-3">
              <label className="block text-sm text-gray-500 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="senderStreet"
                value={formData.senderAddress?.street || ""}
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
                  value={formData.senderAddress?.city || ""}
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
                  value={formData.senderAddress?.postCode || ""}
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
                  value={formData.senderAddress?.country || ""}
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
            <h3 className="text-purple-600 font-medium mb-3">Bill To</h3>

            <div className="mb-3">
              <label className="block text-sm text-gray-500 mb-1">
                Client's Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName || ""}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-500 mb-1">
                Client's Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail || ""}
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
                value={formData.clientAddress?.street || ""}
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
                  value={formData.clientAddress?.city || ""}
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
                  value={formData.clientAddress?.postCode || ""}
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
                  value={formData.clientAddress?.country || ""}
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
                  formData.createdAt
                    ? new Date(formData.createdAt).toISOString().split("T")[0]
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
                onChange={handlePaymentTermsChange}
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
                value={formData.description || ""}
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
              {formData.items &&
                formData.items.map((item, index) => (
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
                        disabled={formData.items.length <= 1}
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
              className="w-full p-2 mt-3 bg-gray-100 text-purple-600 font-medium rounded-md hover:bg-gray-200 text-sm"
            >
              + Add New Item
            </button>
          </div>

          <div className="flex justify-between mt-4 sticky bottom-0 bg-white p-3 border-t">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-3xl text-sm"
            >
              {isNewInvoice ? "Discard" : "Cancel"}
            </button>

            <div className="flex space-x-2">
              {isNewInvoice && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-3xl text-sm"
                >
                  Save as Draft
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-3xl text-sm"
              >
                {isNewInvoice ? "Save & Send" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
