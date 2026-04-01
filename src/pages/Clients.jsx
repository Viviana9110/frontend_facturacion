import { useEffect, useState } from "react";
import API from "../api/axios.js";
import ClientForm from "../components/ClientForm";
import Modal from "../components/ui/Modal";

import { Edit, Trash2, PlusCircle, Search } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔄 Fetch
  const fetchClients = async () => {
    const res = await API.get("/clients");
    setClients(res.data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ❌ Delete
  const deleteClient = async (id) => {
    const confirmDelete = confirm("¿Eliminar cliente?");
    if (!confirmDelete) return;

    await API.delete(`/clients/${id}`);
    fetchClients();
  };

  // 🔍 filtro
  const filteredClients = clients.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Clientes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Gestiona tus clientes fácilmente
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null); // 👉 NUEVO CLIENTE
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow transition"
        >
          <PlusCircle size={18} />
          Nuevo Cliente
        </button>
      </div>

      {/* 🔍 BUSCADOR */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
          <Search className="text-gray-400" size={18} />
          <input
            placeholder="Buscar cliente..."
            className="w-full outline-none text-sm bg-transparent"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 📊 TABLA */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-6">
          Lista de clientes
        </h2>

        {filteredClients.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No hay clientes
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredClients.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>

                  <TableCell className="flex justify-end gap-3">
                    
                    {/* EDITAR */}
                    <button
                      onClick={() => {
                        setEditing(c); // 👉 EDITAR
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <Edit size={16} />
                      Editar
                    </button>

                    {/* ELIMINAR */}
                    <button
                      onClick={() => deleteClient(c._id)}
                      className="text-red-500 hover:underline text-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* 💎 MODAL (CLAVE) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <ClientForm
          fetchClients={fetchClients}
          editing={editing}
          setEditing={(val) => {
            setEditing(val);
            if (!val) setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}