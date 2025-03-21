"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface FilterComponentProps {
  invoices: any[];
  setFilteredInvoices: (invoices: any[]) => void;
}

const FilterComponent = ({
  invoices,
  setFilteredInvoices,
}: FilterComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses = [
    { label: "Draft", value: "draft" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
  ];

  useEffect(() => {
    // Handle clicks outside the dropdown to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Apply filter when selectedStatuses changes
  useEffect(() => {
    if (!invoices) return;

    // If no statuses are selected, show all invoices
    if (selectedStatuses.length === 0) {
      setFilteredInvoices(invoices);
      return;
    }

    // Filter invoices based on selected statuses
    const filtered = invoices.filter((invoice) =>
      selectedStatuses.includes(invoice.status.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [selectedStatuses, invoices, setFilteredInvoices]);

  const handleStatusToggle = (value: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(value)
        ? prev.filter((status) => status !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 text-gray-700 px-4 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="md:hidden font-bold">Filter</span>
        <span className="hidden md:block font-bold">Filter by status</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-purple-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-10">
          {statuses.map((status) => (
            <label
              key={status.value}
              className="flex items-center space-x-3 py-2 cursor-pointer"
            >
              <div
                className={`w-4 h-4 border rounded flex items-center justify-center ${
                  selectedStatuses.includes(status.value)
                    ? "border-purple-600 bg-purple-600"
                    : "border-gray-300"
                }`}
                onClick={() => handleStatusToggle(status.value)}
              >
                {selectedStatuses.includes(status.value) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span className="text-sm">{status.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
