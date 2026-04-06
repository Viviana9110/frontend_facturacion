import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../api/axios";
import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Search,
} from "lucide-react";

import Modal from "../components/ui/Modal.jsx";
import InvoicePreview from "../components/InvoicePreview";

import { motion, AnimatePresence } from "framer-motion";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchInvoices = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
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

  const filtered = useMemo(() => {
    const now = new Date();
    let data = invoices;

    if (range === "today") {
      data = invoices.filter(
        (inv) =>
          new Date(inv.createdAt).toDateString() === now.toDateString(),
      );
    }

    if (range === "7d") {
      const last = new Date();
      last.setDate(now.getDate() - 7);
      data = invoices.filter((inv) => new Date(inv.createdAt) >= last);
    }

    if (range === "30d") {
      const last = new Date();
      last.setDate(now.getDate() - 30);
      data = invoices.filter((inv) => new Date(inv.createdAt) >= last);
    }

    if (search) {
      data = data.filter((inv) =>
        inv.client?.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (sort === "total") data = [...data].sort((a, b) => b.total - a.total);
    if (sort === "date")
      data = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

    return data;
  }, [invoices, range, search, sort]);

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, range, sort]);

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

  const formatCOP = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="px-4 py-6 sm:p-6 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">

        <KPI icon={<DollarSign />} title="Ingresos" value={formatCOP(total)}>
          <span
            className={`flex items-center gap-1 text-xs ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {growth.toFixed(1)}% vs periodo anterior
          </span>
        </KPI>

        <KPI icon={<FileText />} title="Facturas" value={count} />

        <KPI icon={<TrendingUp />} title="Promedio" value={formatCOP(avg)} />

        <KPI
          icon={<Users />}
          title="Clientes únicos"
          value={new Set(filtered.map((i) => i.client?._id)).size}
        />
      </div>

      {/* TABLA */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border mt-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Historial de facturas</h2>

          <select
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="date">Ordenar por fecha</option>
            <option value="total">Ordenar por total</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No hay facturas en este periodo
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {paginatedInvoices.map((inv) => (
                    <tr
                      key={inv._id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="p-3 font-semibold text-indigo-600">
                        {inv.dianNumber || "Sin número"}
                      </td>

                      <td className="p-3">{inv.client?.name}</td>

                      <td className="p-3 font-medium">{formatCOP(inv.total)}</td>

                      <td className="p-3">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex justify-between items-center mt-4">

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>

              <span className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>

            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Factura"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <InvoicePreview invoice={selectedInvoice} />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
}

function KPI({ icon, title, value, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div className="flex items-center gap-3 text-gray-500 mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <h2 className="text-2xl font-semibold">{value}</h2>

      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}