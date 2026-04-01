import { useEffect, useState } from "react";
import API from "../api/axios";
import InvoiceModal from "./InvoiceModal";

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await API.get("/invoices");
        setInvoices(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Historial de Facturas</h2>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {invoices.map(inv => (
            <tr key={inv._id} className="text-center border-t">
              <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
              <td>{inv.clientId?.name}</td>
              <td>${inv.total}</td>
              <td>
                <button
                  onClick={() => setSelectedInvoice(inv)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}