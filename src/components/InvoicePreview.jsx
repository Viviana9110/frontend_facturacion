import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoicePreview({ invoice }) {
  const invoiceRef = useRef();

  const downloadPDF = async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save(`factura-${invoice.dianNumber || invoice._id}.pdf`);
  };

  if (!invoice) return null;

  const formatCOP = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="w-full">

      {/* BOTÓN PDF */}
      <div className="flex justify-end mb-2">
        {/* <button
          onClick={downloadPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
        >
          Descargar PDF
        </button> */}
      </div>

      {/* CONTENEDOR VISUAL */}
      <div className="flex justify-center">

        {/* DOCUMENTO */}
        <div className="flex justify-center scale-[0.78] origin-top">
  <div
    ref={invoiceRef}
    className="bg-white text-black w-[420px] p-5 rounded-lg shadow text-sm"
  >

          {/* HEADER */}
          <div className="flex justify-between mb-4">

            <div>
              <h1 className="text-base font-bold">
                FACTURA ELECTRÓNICA DE VENTA
              </h1>

              <p>
                <strong>No:</strong> {invoice.dianNumber || "N/A"}
              </p>

              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right text-xs">
              <h2 className="font-bold">Tu Empresa SAS</h2>
              <p>NIT: 900123456-7</p>
              <p>Responsable de IVA</p>
            </div>

          </div>

          {/* CLIENTE */}
          <div className="mb-4 border p-3 rounded">

            <h2 className="font-semibold mb-1">
              Cliente
            </h2>

            <p>
              <strong>Nombre:</strong> {invoice.client?.name}
            </p>

            <p>
              <strong>Email:</strong> {invoice.client?.email}
            </p>

            <p>
              <strong>Tel:</strong> {invoice.client?.phone}
            </p>

          </div>

          {/* PRODUCTOS */}
          <table className="w-full border mb-4 text-sm">

            <thead className="bg-gray-200">

              <tr>
                <th className="p-1 text-left">Producto</th>
                <th>Cant</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>

            </thead>

            <tbody>

              {invoice.items.map((item, i) => (

                <tr key={i} className="border-t">

                  <td className="p-1">
                    {item.product?.name}
                  </td>

                  <td className="text-center">
                    {item.quantity}
                  </td>

                  <td className="text-right">
                    {formatCOP(item.price)}
                  </td>

                  <td className="text-right">
                    {formatCOP(item.price * item.quantity)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* TOTALES */}
          <div className="flex justify-end mb-4">

            <div className="w-48 text-sm">

              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCOP(invoice.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>IVA (19%):</span>
                <span>{formatCOP(invoice.tax)}</span>
              </div>

              <div className="flex justify-between font-bold border-t mt-1 pt-1">
                <span>Total:</span>
                <span>{formatCOP(invoice.total)}</span>
              </div>

            </div>

          </div>

          {/* DIAN INFO */}
          <div className="border-t pt-2">

            <h2 className="font-semibold text-sm mb-1">
              Información DIAN
            </h2>

            <p className="text-xs break-all">
              <strong>CUFE:</strong> {invoice.cufe || "No disponible"}
            </p>

            {invoice.publicUrl && (
              <p className="text-xs mt-1">
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
              <div className="mt-2 flex justify-center">
                <img
                  src={invoice.qrCode}
                  alt="QR DIAN"
                  className="w-16 h-16"
                />
              </div>
            )}

          </div>

          {/* FOOTER */}
          <div className="mt-3 text-xs text-center border-t pt-2">

            <p>
              Esta es una factura electrónica válida según la DIAN.
            </p>

          </div>

        </div>

      </div>

    </div>
    </div>
  );
}