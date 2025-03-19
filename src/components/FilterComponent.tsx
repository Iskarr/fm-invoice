"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

interface FilterComponentProps {
  invoices: any[];
  setFilteredInvoices: (invoices: any[]) => void;
}

const FilterComponent = ({
  invoices,
  setFilteredInvoices,
}: FilterComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses = [
    { label: "All", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Pending", value: "pending" },
    { label: "Draft", value: "draft" },
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

  // Apply filter when selectedStatus changes
  useEffect(() => {
    if (!invoices) return;

    if (selectedStatus === "All") {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(
        (invoice) =>
          invoice.status.toLowerCase() === selectedStatus.toLowerCase()
      );
      setFilteredInvoices(filtered);
    }
  }, [selectedStatus, invoices, setFilteredInvoices]);

  const handleStatusSelect = (status: { label: string; value: string }) => {
    setSelectedStatus(status.label);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-3xl shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedStatus === "All"
            ? "Filter by status"
            : `Status: ${selectedStatus}`}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-purple-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
          {statuses.map((status) => (
            <div
              key={status.value}
              className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleStatusSelect(status)}
            >
              <div className="flex-1">{status.label}</div>
              {selectedStatus === status.label && (
                <CheckIcon className="w-4 h-4 text-purple-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
