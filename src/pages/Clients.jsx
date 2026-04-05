import { useEffect, useState } from "react";
import API from "../api/axios.js";
import ClientForm from "../components/ClientForm";
import Modal from "../components/ui/Modal.jsx";
import { toast } from "sonner";

import { Edit, Trash2, PlusCircle, Search, AlertTriangle } from "lucide-react";

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
  const deleteClient = (id) => {
  const toastId = toast.custom((t) => (
    <div
      className={`bg-white shadow-lg border border-gray-200 rounded-lg p-4 max-w-sm w-full flex flex-col gap-4 ${
        t.visible ? "animate-fadeIn" : "animate-fadeOut"
      }`}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <p className="text-gray-800 text-sm font-medium">
          ¿Seguro que quieres eliminar este cliente?
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={async () => {
            try {
              await API.delete(`/clients/${id}`);
              fetchClients();
              toast.success("Cliente eliminado con éxito");
            } catch (error) {
              toast.error("Error al eliminar el cliente");
            } finally {
              toast.dismiss(toastId); // cerramos este toast
            }
          }}
        >
          Sí
        </button>
        <button
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          onClick={() => toast.dismiss(toastId)}
        >
          No
        </button>
      </div>
    </div>
  ));
};

  // 🔍 filtro
  const filteredClients = clients.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) || (c.identification || "").toLowerCase().includes(search.toLowerCase())
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
            setEditing(null); 
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow transition transform hover:scale-[1.02] active:scale-[0.98]"
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
            className="w-full outline-none text-sm bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400"
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
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No hay clientes registrados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs uppercase">
                 <tr>
                  <th className="p-3 text-left">Identificacion</th>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Telefono</th>
                  <th className="p-3 text-center">Acciones</th>
                  </tr>
              </thead>

              <tbody>
                {filteredClients.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-3 font-medium">{c.identification}</td>
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 font-medium">{c.email}</td>
                    <td className="p-3 font-medium">{c.phone}</td>
                  <td className="p-3 flex justify-end gap-3">
                      
                      {/* EDITAR */}
                      <button
                        onClick={() => {
                          setEditing(c);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 transition text-sm"
                      >
                        <Edit size={16} />
                        Editar
                      </button>

                      {/* ELIMINAR */}
                      <button
                        onClick={() => deleteClient(c._id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition text-sm"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>

                    </td>
                  
                  </tr>
                ))}
              </tbody>         

          </table>
          </div>
         
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