import { useEffect, useState } from "react";
import API from "../api/axios";

export default function ClientForm({ fetchClients, editing, setEditing }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔄 Cargar datos al editar
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        email: editing.email || "",
        phone: editing.phone || "",
      });
    } else {
      setForm({ name: "", email: "", phone: "" });
    }
  }, [editing]);

  // 🔍 Validación
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
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
        await API.put(`/clients/${editing._id}`, form);
      } else {
        await API.post("/clients", form);
      }

      fetchClients();
      setEditing(null);
      setForm({ name: "", email: "", phone: "" });

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Error guardando cliente ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* 👤 NOMBRE */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
          Nombre
        </label>

        <input
          type="text"
          placeholder="Ej: María López"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className={`w-full mt-1 px-4 py-2 rounded-xl border 
          bg-gray-50 dark:bg-gray-800 
          text-gray-800 dark:text-white
          outline-none focus:ring-2 focus:ring-indigo-500
          ${errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
        />

        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* 📧 EMAIL */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
          Email
        </label>

        <input
          type="email"
          placeholder="correo@email.com"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className={`w-full mt-1 px-4 py-2 rounded-xl border 
          bg-gray-50 dark:bg-gray-800 
          text-gray-800 dark:text-white
          outline-none focus:ring-2 focus:ring-indigo-500
          ${errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
        />

        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* 📱 TELÉFONO */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
          Teléfono
        </label>

        <input
          type="text"
          placeholder="Ej: 3001234567"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          className="w-full mt-1 px-4 py-2 rounded-xl border 
          bg-gray-50 dark:bg-gray-800 
          text-gray-800 dark:text-white
          outline-none focus:ring-2 focus:ring-indigo-500
          border-gray-200 dark:border-gray-700"
        />
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