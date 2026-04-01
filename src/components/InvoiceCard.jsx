// src/components/InvoiceCard.jsx
export default function InvoiceCard({ invoice }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 border">
      <h2 className="font-bold text-lg">
        Factura: {invoice.factus.number}
      </h2>

      <p>Cliente: {invoice.client?.name}</p>
      <p>Total: ${invoice.total}</p>

      <a
        href={invoice.factus.publicUrl}
        target="_blank"
        className="text-blue-500 underline"
      >
        Ver factura
      </a>
    </div>
  );
}