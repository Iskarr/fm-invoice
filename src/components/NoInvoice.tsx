import React from "react";
import Image from "next/image";
const NoInvoice = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="max-w-xs mb-6">
        <Image
          alt="No invoices"
          className="w-full"
          src="/assets/illustration-empty.svg"
          width={100}
          height={100}
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
  );
};

export default NoInvoice;
