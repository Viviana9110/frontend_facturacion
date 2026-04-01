import { useEffect, useState } from "react";
import axios from "axios";

export default function InvoiceModal({ invoiceId, onClose }) {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (invoiceId) fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:3000/api/invoices/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setInvoice(res.data);
    } catch (error) {
      console.error("Error cargando factura", error);
    }
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-4xl rounded-xl p-6 overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="flex justify-between mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold">FACTURA ELECTRÓNICA</h1>
            <p className="text-sm">DIAN</p>
          </div>

          <button
            onClick={onClose}
            className="text-red-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* EMPRESA */}
        <div className="flex justify-between items-start">
  <div>
    <h2 className="text-xl font-bold">Factura Electrónica</h2>
    <p>No: {invoice.dianNumber}</p>
  </div>

  <img
    src={invoice.qrCode}
    className="w-32"
  />
</div>

        {/* CLIENTE */}
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <h3 className="font-bold mb-2">Datos del Cliente</h3>

          <div className="grid grid-cols-2 text-sm gap-2">
            <p><strong>Nombre:</strong> {invoice.client?.name}</p>
            <p><strong>Email:</strong> {invoice.client?.email}</p>
            <p><strong>Teléfono:</strong> {invoice.client?.phone}</p>
            <p><strong>ID:</strong> {invoice.client?.identification}</p>
          </div>
        </div>

        {/* TABLA */}
        <table className="w-full border mb-6 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Producto</th>
              <th>Cant</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="text-center border-b">
                <td>{item.product?.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALES */}
        <div className="text-right">
          <p>Subtotal: ${invoice.subtotal}</p>
          <p>IVA (19%): ${invoice.tax}</p>

          <h2 className="text-xl font-bold">
            Total: ${invoice.total}
          </h2>
        </div>

      </div>
    </div>
  );
}