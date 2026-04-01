// src/pages/Invoices.jsx
import { useEffect, useState } from "react";
import API from "../api/invoiceApi";
import InvoiceCard from "../components/InvoiceCard";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);

  const getInvoices = async () => {
    const res = await API.get("/invoices");
    setInvoices(res.data);
  };

  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Facturas</h1>

      <div className="grid gap-4">
        {invoices.map((inv) => (
          <InvoiceCard key={inv._id} invoice={inv} />
        ))}
      </div>
    </div>
  );
}