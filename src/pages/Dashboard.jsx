import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { PlusCircle, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react";
import Modal from "../components/ui/Modal";
import InvoicePreview from "../components/InvoicePreview";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInvoices = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/api/invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvoices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // 📅 FILTRO
  useEffect(() => {
    const now = new Date();
    let filteredData = invoices;

    if (range === "today") {
      filteredData = invoices.filter(
        (inv) => new Date(inv.createdAt).toDateString() === now.toDateString(),
      );
    }

    if (range === "7d") {
      const last7 = new Date();
      last7.setDate(now.getDate() - 7);

      filteredData = invoices.filter((inv) => new Date(inv.createdAt) >= last7);
    }

    if (range === "30d") {
      const last30 = new Date();
      last30.setDate(now.getDate() - 30);

      filteredData = invoices.filter(
        (inv) => new Date(inv.createdAt) >= last30,
      );
    }

    setFiltered(filteredData);
  }, [range, invoices]);

  // 📊 KPIs
  const total = filtered.reduce((acc, i) => acc + (i.total || 0), 0);
  const count = filtered.length;
  const avg = count ? total / count : 0;

  const previousTotal = invoices
    .slice(0, Math.max(0, invoices.length - filtered.length))
    .reduce((acc, i) => acc + (i.total || 0), 0);

  const growth = previousTotal
    ? ((total - previousTotal) / previousTotal) * 100
    : 0;

  const isPositive = growth >= 0;

  // 📈 CHART
  const chartMap = filtered.reduce((acc, inv) => {
    const date = new Date(inv.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = 0;
    acc[date] += inv.total;
    return acc;
  }, {});

  const chartData = Object.keys(chartMap).map((date) => ({
    date,
    total: chartMap[date],
  }));

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-800 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Análisis avanzado de tu negocio
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-3 mb-6">
        {["today", "7d", "30d"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-xl text-sm ${
              range === r
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-800 border dark:border-gray-700"
            }`}
          >
            {r === "today" && "Hoy"}
            {r === "7d" && "7 días"}
            {r === "30d" && "30 días"}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Ingresos</p>
          <h2 className="text-2xl font-semibold mt-2">
            ${total.toLocaleString()}
          </h2>
          <span
            className={`text-xs flex items-center gap-1 mt-2 ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {growth.toFixed(1)}%
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Facturas</p>
          <h2 className="text-2xl font-semibold mt-2">{count}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Promedio</p>
          <h2 className="text-2xl font-semibold mt-2">${avg.toFixed(2)}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Clientes únicos</p>
          <h2 className="text-2xl font-semibold mt-2">
            {new Set(filtered.map((i) => i.client?._id)).size}
          </h2>
        </div>
      </div>

      {/* GRÁFICA */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🧾 TABLA PRO */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border">
        <h2 className="text-lg font-semibold mb-4">Historial de facturas</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b dark:border-gray-700">
              <tr>
                <th className="p-3"># Factura</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Total</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Acción</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3 font-semibold text-indigo-600">
                    {inv.dianNumber ? inv.dianNumber : "Sin número"}
                  </td>
                  <td className="p-3">{inv.client?.name}</td>
                  <td className="p-3 font-medium">${inv.total}</td>
                  <td className="p-3">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
      </div>

      {/* 🔥 MODAL FACTURA */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Factura"
      >
        <InvoicePreview invoice={selectedInvoice} />
      </Modal>
    </div>
  );
}
