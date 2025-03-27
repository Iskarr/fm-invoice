"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Invoice } from "@/types";
interface FilterComponentProps {
  invoices: Invoice[];
  setFilteredInvoices: (invoices: Invoice[]) => void;
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
        className="flex items-center space-x-2 total-color px-4 py-2"
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
            <div
              key={status.value}
              className="py-2 cursor-pointer group"
              onClick={() => handleStatusToggle(status.value)}
            >
              <label className="flex items-center space-x-3 w-full cursor-pointer">
                <div
                  className={`filter-checkbox ${
                    selectedStatuses.includes(status.value) ? "selected" : ""
                  }`}
                >
                  {selectedStatuses.includes(status.value) && (
                    <svg
                      className="w-4 h-4 text-bold text-white"
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
                <span className="text-sm font-bold total-color">
                  {status.label}
                </span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
