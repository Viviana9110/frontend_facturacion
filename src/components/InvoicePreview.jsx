import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoicePreview({ invoice }) {
  const invoiceRef = useRef();

  const downloadPDF = async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`factura-${invoice._id}.pdf`);
  };

  if (!invoice) return null;

  return (
    <div>
      {/* BOTÓN PDF */}
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadPDF}
          className="bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Descargar PDF
        </button>
      </div>

      {/* FACTURA */}
      <div
        ref={invoiceRef}
        className="bg-white text-black p-8 rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-4">
          FACTURA ELECTRÓNICA
        </h1>

        <div className="mb-4">
          <p><strong>ID:</strong> {invoice._id}</p>
          <p><strong>Fecha:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold">Cliente</h2>
          <p>{invoice.client?.name}</p>
          <p>{invoice.client?.email}</p>
        </div>

        <table className="w-full text-sm border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Producto</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="p-2">{item.product?.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">${item.price}</td>
                <td className="p-2">
                  ${item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-6">
          <p>Subtotal: ${invoice.subtotal}</p>
          <p>IVA: ${invoice.iva}</p>
          <p className="text-xl font-bold">
            Total: ${invoice.total}
          </p>
        </div>
      </div>
    </div>
  );
}