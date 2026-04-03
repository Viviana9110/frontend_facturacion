import { useState } from "react";
import axios from "axios";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.warning("Completa todos los campos");
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      toast.success("Bienvenid@ 🚀");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      
      {/* CARD */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Iniciar sesión
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Accede a tu panel de facturación
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-500">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoFocus
              className="w-full mt-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="correo@email.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-500">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="••••••••"
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-xl transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}