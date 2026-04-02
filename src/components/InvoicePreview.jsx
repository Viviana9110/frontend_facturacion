import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoicePreview({ invoice }) {
  const invoiceRef = useRef();

  const downloadPDF = async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`factura-${invoice.dianNumber || invoice._id}.pdf`);
  };

  if (!invoice) return null;

  const formatCOP = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

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
        className="bg-white text-black p-8 rounded-xl text-sm"
      >
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">
              FACTURA ELECTRÓNICA DE VENTA
            </h1>
            <p><strong>No:</strong> {invoice.dianNumber || "N/A"}</p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* LOGO (opcional) */}
          <div className="text-right">
            <h2 className="font-bold text-lg">Tu Empresa SAS</h2>
            <p>NIT: 900123456-7</p>
            <p>Régimen: Responsable de IVA</p>
          </div>
        </div>

        {/* CLIENTE */}
        <div className="mb-6 border p-4 rounded">
          <h2 className="font-semibold mb-2">Cliente</h2>
          <p><strong>Nombre:</strong> {invoice.client?.name}</p>
          <p><strong>Email:</strong> {invoice.client?.email}</p>
          <p><strong>Tel:</strong> {invoice.client?.phone}</p>
        </div>

        {/* PRODUCTOS */}
        <table className="w-full border mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Producto</th>
              <th className="p-2">Cant</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{item.product?.name}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">{formatCOP(item.price)}</td>
                <td className="p-2 text-right">
                  {formatCOP(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALES */}
        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCOP(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (19%):</span>
              <span>{formatCOP(invoice.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t mt-2 pt-2">
              <span>Total:</span>
              <span>{formatCOP(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* DIAN INFO */}
        <div className="border-t pt-4">
          <h2 className="font-semibold mb-2">Información DIAN</h2>

          <p className="text-xs break-all">
            <strong>CUFE:</strong> {invoice.cufe || "No disponible"}
          </p>

          {invoice.publicUrl && (
            <p className="text-xs mt-2">
              <strong>Validación:</strong>{" "}
              <a
                href={invoice.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Consultar factura
              </a>
            </p>
          )}

          {invoice.qrCode && (
            <div className="mt-4 flex justify-center">
              <img
                src={invoice.qrCode}
                alt="QR DIAN"
                className="w-32 h-32"
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-xs text-center border-t pt-4">
          <p>
            Esta es una factura electrónica válida según la DIAN.
          </p>
          <p>
            Generada automáticamente por el sistema de facturación.
          </p>
        </div>
      </div>
    </div>
  );
}