"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { XMarkIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Invoice, InvoiceItem, Address } from "@/types";

interface InvoiceFormProps {
  invoice?: Invoice | null; // Optional for new invoice creation
  showForm: boolean;
  isNewInvoice: boolean; // Flag to determine if creating new or editing
  onClose: () => void;
  onSave: (updatedInvoice: Invoice, saveAsDraft?: boolean) => void;
}

// Define an interface for form errors
interface FormErrors {
  senderAddress?: {
    street?: string;
    city?: string;
    postCode?: string;
    country?: string;
  };
  clientName?: string;
  clientEmail?: string;
  clientAddress?: {
    street?: string;
    city?: string;
    postCode?: string;
    country?: string;
  };
  createdAt?: string;
  description?: string;
  items?: { name?: string; quantity?: string; price?: string }[];
}

// Form Field Component
const FormField = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="mb-3">
    <div className="flex justify-between">
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
    {children}
  </div>
);

// Address Section Component
const AddressSection = ({
  title,
  prefix,
  address,
  errors,
  onChange,
  formData,
}: {
  title: string;
  prefix: string;
  address: Address;
  errors: any;
  onChange: (
    e: ChangeEvent<HTMLInputElement>,
    section: string,
    field: string
  ) => void;
  formData?: Invoice;
}) => (
  <div className="mb-6">
    <h3 className="text-purple-600 font-medium mb-3">{title}</h3>

    {prefix === "clientAddress" && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <FormField label="Client Name" error={errors?.clientName}>
          <input
            type="text"
            name="clientName"
            value={formData?.clientName || ""}
            onChange={(e) => onChange(e, "", "")}
            className={`w-full p-2 border ${
              errors?.clientName
                ? "border-red-500 error-field"
                : "border-gray-200"
            } rounded-md text-sm`}
          />
        </FormField>

        <FormField label="Client Email" error={errors?.clientEmail}>
          <input
            type="email"
            name="clientEmail"
            value={formData?.clientEmail || ""}
            onChange={(e) => onChange(e, "", "")}
            className={`w-full p-2 border ${
              errors?.clientEmail
                ? "border-red-500 error-field"
                : "border-gray-200"
            } rounded-md text-sm`}
          />
        </FormField>
      </div>
    )}

    <FormField label="Street Address" error={errors?.[prefix]?.street}>
      <input
        type="text"
        name={`${prefix}Street`}
        value={address?.street || ""}
        onChange={(e) => onChange(e, prefix, "street")}
        className={`w-full p-2 border ${
          errors?.[prefix]?.street
            ? "border-red-500 error-field"
            : "border-gray-200"
        } rounded-md text-sm`}
      />
    </FormField>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {["city", "postCode", "country"].map((field) => (
        <FormField
          key={field}
          label={
            field === "postCode"
              ? "Post Code"
              : field.charAt(0).toUpperCase() + field.slice(1)
          }
          error={errors?.[prefix]?.[field]}
        >
          <input
            type="text"
            name={`${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}`}
            value={address?.[field as keyof Address] || ""}
            onChange={(e) => onChange(e, prefix, field)}
            className={`w-full p-2 border ${
              errors?.[prefix]?.[field]
                ? "border-red-500 error-field"
                : "border-gray-200"
            } rounded-md text-sm`}
          />
        </FormField>
      ))}
    </div>
  </div>
);

// Item List Component
const ItemList = ({
  items,
  errors,
  onItemChange,
  onRemoveItem,
  onAddItem,
}: {
  items: InvoiceItem[];
  errors: any;
  onItemChange: (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
}) => (
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
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-12 gap-1 mb-3 items-center">
          <div className="col-span-5">
            <input
              type="text"
              value={item.name}
              onChange={(e) => onItemChange(index, "name", e.target.value)}
              className={`w-full p-2 border ${
                errors?.items?.[index]?.name
                  ? "border-red-500 error-field"
                  : "border-gray-200"
              } rounded-md text-sm`}
            />
          </div>
          <div className="col-span-2">
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => onItemChange(index, "quantity", e.target.value)}
              className={`w-full p-2 border ${
                errors?.items?.[index]?.quantity
                  ? "border-red-500 error-field"
                  : "border-gray-200"
              } rounded-md text-center text-sm`}
              min="1"
            />
          </div>
          <div className="col-span-3">
            <input
              type="number"
              value={item.price}
              onChange={(e) => onItemChange(index, "price", e.target.value)}
              className={`w-full p-2 border ${
                errors?.items?.[index]?.price
                  ? "border-red-500 error-field"
                  : "border-gray-200"
              } rounded-md text-right text-sm`}
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
              onClick={() => onRemoveItem(index)}
              className="text-gray-500 hover:text-red-500"
              disabled={items.length <= 1}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>

    <button
      type="button"
      onClick={onAddItem}
      className="w-full p-2 mt-3 bg-gray-100 text-purple-600 font-medium rounded-md hover:bg-gray-200 text-sm"
    >
      + Add New Item
    </button>

    {/* Add error messages below the button */}
    {errors?.items && (
      <div className="mt-4 text-red-500 text-sm">
        <div>- All fields must be added</div>
        <div>- An item must be added</div>
      </div>
    )}
  </div>
);

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] = useState<boolean>(false);

  // Helper to calculate payment due date string from a date string and days
  const calculateDueDate = (dateString: string, days: number): string => {
    // If no date string provided, return empty string
    if (!dateString) return "";

    // Simple string manipulation to add days to a date string (YYYY-MM-DD)
    const parts = dateString.split("-");
    if (parts.length !== 3) return "";

    // Create temp date object just for calculation
    const tempDate = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2])
    );
    tempDate.setDate(tempDate.getDate() + days);

    // Convert back to string format
    const year = tempDate.getFullYear();
    const month = String(tempDate.getMonth() + 1).padStart(2, "0");
    const day = String(tempDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Initialize the form when opened
  useEffect(() => {
    if (isNewInvoice) {
      // Create empty invoice template for new invoice with today's date string
      // const todayString = getTodayString();

      const newInvoice: Invoice = {
        id: generateInvoiceId(),
        createdAt: "",
        paymentDue: calculateDueDate("", 30),
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
      // Use existing invoice for edit mode, keeping the dates as strings
      setFormData(invoice);

      // Set payment terms based on the invoice if available
      if (invoice.paymentTerms) {
        setPaymentTerms(invoice.paymentTerms);
      }
    }

    // Reset errors when form is opened
    setErrors({});
    setShowErrors(false);
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

    // Clear error for this field when user starts typing
    if (section && field) {
      // Clear nested error
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[section as keyof FormErrors]) {
          const sectionErrors = {
            ...(newErrors[section as keyof FormErrors] as Record<
              string,
              string
            >),
          };
          delete sectionErrors[field];
          newErrors[section as keyof FormErrors] = sectionErrors as any;
        }
        return newErrors;
      });
    } else {
      // Clear top-level error
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name as keyof FormErrors];
        return newErrors;
      });
    }

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
      const fieldName = e.target.name;
      const value = e.target.value;

      // If changing the date, also update the payment due date based on current terms
      if (fieldName === "createdAt") {
        const dateString = value; // Direct string from input

        // Extract days from payment terms
        const days = parseInt(paymentTerms.match(/\d+/)?.[0] || "30");
        const newDueDate = calculateDueDate(dateString, days);

        setFormData({
          ...formData,
          createdAt: dateString,
          paymentDue: newDueDate,
        });
      } else {
        // For all other fields
        setFormData({
          ...formData,
          [fieldName]: value,
        });
      }
    }
  };

  const handlePaymentTermsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!formData) return;

    const terms = e.target.value;
    setPaymentTerms(terms);

    // Update payment due date based on selected terms
    const days = parseInt(terms.match(/\d+/)?.[0] || "30");

    // Calculate due date from the current createdAt string
    const dueDate = calculateDueDate(formData.createdAt || "", days);

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

    // Clear item error when user types
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.items && newErrors.items[index]) {
        const itemErrors = { ...newErrors.items[index] };
        delete itemErrors[field as keyof typeof itemErrors];
        newErrors.items[index] = itemErrors;
      }
      return newErrors;
    });

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

    // Remove errors for deleted item
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.items) {
        const itemsErrors = [...newErrors.items];
        itemsErrors.splice(index, 1);
        newErrors.items = itemsErrors;
      }
      return newErrors;
    });

    setFormData({
      ...formData,
      items: newItems,
      total: total,
    });
  };

  // Validate the form and return true if valid, false otherwise
  const validateForm = (formData: Invoice, saveAsDraft: boolean): boolean => {
    // Clear all errors when saving as draft
    if (saveAsDraft) {
      setErrors({});
      return true;
    }

    const newErrors: FormErrors = {};
    let isValid = true;

    // Check sender address
    if (!formData.senderAddress?.street) {
      newErrors.senderAddress = {
        ...newErrors.senderAddress,
        street: "can't be empty",
      };
      isValid = false;
    }
    if (!formData.senderAddress?.city) {
      newErrors.senderAddress = {
        ...newErrors.senderAddress,
        city: "can't be empty",
      };
      isValid = false;
    }
    if (!formData.senderAddress?.postCode) {
      newErrors.senderAddress = {
        ...newErrors.senderAddress,
        postCode: "can't be empty",
      };
      isValid = false;
    }
    if (!formData.senderAddress?.country) {
      newErrors.senderAddress = {
        ...newErrors.senderAddress,
        country: "can't be empty",
      };
      isValid = false;
    }

    // Check client details
    if (!formData.clientName) {
      newErrors.clientName = "can't be empty";
      isValid = false;
    }

    if (!formData.clientEmail) {
      newErrors.clientEmail = "can't be empty";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = "must be a valid email";
      isValid = false;
    }

    // Check client address
    if (!formData.clientAddress?.street) {
      newErrors.clientAddress = {
        ...newErrors.clientAddress,
        street: "can't be empty",
      };
      isValid = false;
    }
    if (!formData.clientAddress?.city) {
      newErrors.clientAddress = {
        ...newErrors.clientAddress,
        city: "can't be empty",
      };
      isValid = false;
    }
    if (!formData.clientAddress?.postCode) {
      newErrors.clientAddress = {
        ...newErrors.clientAddress,
        postCode: "can't be empty",
      };
      isValid = false;
    }
    if (!formData.clientAddress?.country) {
      newErrors.clientAddress = {
        ...newErrors.clientAddress,
        country: "can't be empty",
      };
      isValid = false;
    }

    // Check invoice details
    if (!formData.createdAt) {
      newErrors.createdAt = "can't be empty";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "can't be empty";
      isValid = false;
    }

    // Check items
    if (formData.items.length === 0) {
      newErrors.items = [{}]; // Empty object to trigger error styling
      isValid = false;
    } else {
      const itemErrors = formData.items.map((item) => {
        const itemError: { name?: string; quantity?: string; price?: string } =
          {};

        if (!item.name || item.quantity <= 0 || item.price <= 0) {
          // Just set empty strings to trigger error styling without messages
          if (!item.name) itemError.name = "";
          if (item.quantity <= 0) itemError.quantity = "";
          if (item.price <= 0) itemError.price = "";
          isValid = false;
        }

        return Object.keys(itemError).length > 0 ? itemError : undefined;
      });
      if (itemErrors.some((error) => error !== undefined)) {
        newErrors.items = itemErrors.filter(
          (
            error
          ): error is { name?: string; quantity?: string; price?: string } =>
            error !== undefined
        );
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    if (!formData) return;

    // Validate form if not saving as draft
    const isValid = validateForm(formData, saveAsDraft);
    setShowErrors(!saveAsDraft); // Only show errors if not saving as draft

    if (!isValid) {
      // Scroll to the first error
      const firstErrorElement = document.querySelector(".error-field");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    // Use dates as they are - strings from the input
    const formattedInvoice = {
      ...formData,
      status: saveAsDraft
        ? "draft"
        : isNewInvoice
        ? "pending"
        : formData.status,
    };

    // Call the parent's onSave method with the updated invoice
    onSave(formattedInvoice, saveAsDraft);
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

  if (!showForm || !formData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
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
        className="top-0 bg-white shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl h-screen overflow-y-auto transform transition-all duration-300 ease-in-out z-10"
        style={{
          transform: animateForm ? "translateX(0)" : "translateX(-100%)",
          opacity: animateForm ? 1 : 0,
        }}
      >
        {/* Mobile Go Back button */}
        <div className="p-4 bg-white sticky top-0 z-10">
          <button
            type="button"
            onClick={handleCloseForm}
            className="flex items-center text-[#7C5DFA] font-bold"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Go back
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white sticky top-[56px] z-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            New Invoice
          </h2>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="p-4">
          <AddressSection
            title="Bill From"
            prefix="senderAddress"
            address={
              formData.senderAddress || {
                street: "",
                city: "",
                postCode: "",
                country: "",
              }
            }
            errors={errors}
            onChange={handleInputChange}
            formData={formData}
          />
          <AddressSection
            title="Bill To"
            prefix="clientAddress"
            address={
              formData.clientAddress || {
                street: "",
                city: "",
                postCode: "",
                country: "",
              }
            }
            errors={errors}
            onChange={handleInputChange}
            formData={formData}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <FormField label="Invoice Date" error={errors.createdAt}>
              <input
                type="date"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleInputChange}
                className={`w-full p-2 border ${
                  errors.createdAt
                    ? "border-red-500 error-field"
                    : "border-gray-200"
                } rounded-md text-sm`}
              />
            </FormField>

            <FormField label="Payment Terms">
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
            </FormField>

            <div className="col-span-1 md:col-span-2">
              <FormField label="Project Description" error={errors.description}>
                <input
                  type="text"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${
                    errors.description
                      ? "border-red-500 error-field"
                      : "border-gray-200"
                  } rounded-md text-sm`}
                />
              </FormField>
            </div>
          </div>
          <ItemList
            items={formData.items}
            errors={errors}
            onItemChange={handleItemChange}
            onRemoveItem={removeItem}
            onAddItem={addNewItem}
          />

          {/* Desktop Go Back and action buttons */}
          <div className="hidden md:flex justify-end mt-4 sticky bottom-0 bg-white p-3">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 bg-[#F9FAFE] text-[#7E88C3] rounded-3xl text-sm hover:bg-[#DFE3FA]"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="px-4 py-2 bg-[#373B53] text-white rounded-3xl text-sm hover:bg-[#0C0E16]"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#7C5DFA] text-white rounded-3xl text-sm hover:bg-[#9277FF]"
              >
                Save & Send
              </button>
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="md:hidden flex flex-wrap gap-2 mt-4 sticky bottom-0 bg-white p-3">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-4 py-2 bg-[#F9FAFE] text-[#7E88C3] rounded-3xl text-sm hover:bg-[#DFE3FA]"
            >
              Discard
            </button>
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="px-4 py-2 bg-[#373B53] text-white rounded-3xl text-sm hover:bg-[#0C0E16]"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#7C5DFA] text-white rounded-3xl text-sm hover:bg-[#9277FF]"
              >
                Save & Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
