import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductForm from "../components/ProductForm";
import Modal from "./components/ui/Modal";

import {
  Edit,
  Trash2,
  PlusCircle,
  Search,
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirmDelete = confirm("¿Eliminar producto?");
    if (!confirmDelete) return;

    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  // 🔍 filtro búsqueda
  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">
            Productos
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Gestiona tu catálogo de productos
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
          Nuevo Producto
        </button>
      </div>

      {/* 🔍 BUSCADOR */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
          <Search className="text-gray-400" size={18} />
          <input
            placeholder="Buscar producto..."
            className="w-full outline-none text-sm bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 📊 TABLA */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-6">
          Lista de productos
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No hay productos registrados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs uppercase">
                <tr>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Precio</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-3 font-medium">
                      {p.name}
                    </td>

                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      ${p.price}
                    </td>

                    <td className="p-3 flex justify-end gap-3">
                      
                      {/* EDITAR */}
                      <button
                        onClick={() => {
                          setEditing(p);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 transition text-sm"
                      >
                        <Edit size={16} />
                        Editar
                      </button>

                      {/* ELIMINAR */}
                      <button
                        onClick={() => deleteProduct(p._id)}
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

      {/* 🔥 MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Editar Producto" : "Nuevo Producto"}
      >
        <div className="dark:text-gray-100">
          <ProductForm
            fetchProducts={fetchProducts}
            editing={editing}
            setEditing={(val) => {
              setEditing(val);
              if (!val) setIsModalOpen(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
}