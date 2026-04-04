import { useEffect, useState, useRef } from "react";
import API from "../api/axios";

export default function InvoiceModal({ invoiceId, onClose }) {
  const [invoice, setInvoice] = useState(null);
  const [scale, setScale] = useState(1);

  const containerRef = useRef(null);

  useEffect(() => {
    if (invoiceId) fetchInvoice();
  }, [invoiceId]);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      const baseWidth = 420; // ancho original de tu factura
      const newScale = Math.min(1, containerWidth / baseWidth);

      setScale(newScale);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchInvoice = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/invoices/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvoice(res.data);
    } catch (error) {
      console.error("Error cargando factura", error);
    }
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-4 z-50 p-4">

      {/* MODAL */}
      <div
        ref={containerRef}
        className="bg-white w-full max-w-md rounded-xl shadow-xl flex flex-col max-h-[92vh]"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b">

          <div>
            <h1 className="text-lg font-bold">Factura</h1>
            <p className="text-xs text-gray-500">
              Completa la información del producto
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>

        </div>

        {/* CONTENIDO */}
        <div className="px-4 py-4 overflow-y-auto flex justify-center">

          {/* FACTURA ESCALADA AUTOMÁTICAMENTE */}
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center"
            }}
          >

            <div className="bg-gray-100 text-black w-[420px] p-5 rounded-lg text-sm">

              {/* HEADER FACTURA */}
              <div className="flex justify-between mb-4">

                <div>
                  <h1 className="text-base font-bold">
                    FACTURA ELECTRÓNICA DE VENTA
                  </h1>

                  <p><strong>No:</strong> {invoice.dianNumber}</p>
                  <p><strong>Fecha:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="text-right text-xs">
                  <h2 className="font-bold">Tu Empresa SAS</h2>
                  <p>NIT: 900123456-7</p>
                  <p>Responsable de IVA</p>
                </div>

              </div>

              {/* CLIENTE */}
              <div className="mb-4">
                <h2 className="font-semibold mb-1">Cliente</h2>
                <p><strong>Nombre:</strong> {invoice.client?.name}</p>
                <p><strong>Email:</strong> {invoice.client?.email}</p>
                <p><strong>Tel:</strong> {invoice.client?.phone}</p>
              </div>

              {/* TABLA */}
              <table className="w-full text-sm mb-4">

                <thead className="bg-gray-300">
                  <tr>
                    <th className="p-1 text-left">Producto</th>
                    <th>Cant</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {invoice.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.product?.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">${item.price.toLocaleString()}</td>
                      <td className="text-right">
                        ${(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              {/* TOTALES */}
              <div className="text-right text-sm">

                <p>Subtotal: ${invoice.subtotal.toLocaleString()}</p>
                <p>IVA (19%): ${invoice.tax.toLocaleString()}</p>

                <h2 className="font-bold">
                  Total: ${invoice.total.toLocaleString()}
                </h2>

              </div>

              {/* QR */}
              {invoice.qrCode && (
                <div className="mt-4 flex justify-center">
                  <img src={invoice.qrCode} className="w-20" />
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}