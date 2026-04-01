import { useEffect, useState } from "react";
import API from "../api/axios";

export default function ProductForm({ fetchProducts, editing, setEditing }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔥 Cargar datos en modo edición
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        price: editing.price || "",
      });
    } else {
      setForm({ name: "", price: "" });
    }
  }, [editing]);

  // 🔍 Validación
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!form.price || form.price <= 0) {
      newErrors.price = "Precio válido requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      if (editing?._id) {
        await API.put(`/products/${editing._id}`, form);
      } else {
        await API.post("/products", form);
      }

      fetchProducts();
      setEditing(null);
      setForm({ name: "", price: "" });

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Error guardando producto ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* 🧾 NOMBRE */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
          Nombre del producto
        </label>

        <input
          type="text"
          placeholder="Ej: Camiseta deportiva"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className={`w-full mt-1 px-4 py-2 rounded-xl border 
          bg-gray-50 dark:bg-gray-800 
          text-gray-800 dark:text-white
          placeholder-gray-400
          outline-none focus:ring-2 focus:ring-indigo-500
          ${errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
        />

        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* 💰 PRECIO */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
          Precio
        </label>

        <input
          type="number"
          placeholder="Ej: 50000"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
          className={`w-full mt-1 px-4 py-2 rounded-xl border 
          bg-gray-50 dark:bg-gray-800 
          text-gray-800 dark:text-white
          outline-none focus:ring-2 focus:ring-indigo-500
          ${errors.price ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
        />

        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price}</p>
        )}
      </div>

      {/* ⚡ ACCIONES */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">

        <button
          type="button"
          onClick={() => setEditing(null)}
          className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 
          hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white 
          hover:bg-indigo-700 transition shadow
          disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : editing
            ? "Actualizar"
            : "Crear"}
        </button>

      </div>
    </form>
  );
}