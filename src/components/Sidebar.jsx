import {
  HomeIcon,
  LogOut,
  Users2Icon,
  BoxesIcon,
  ReceiptIcon,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    { name: "Clientes", icon: Users2Icon, path: "/clients" },
    { name: "Productos", icon: BoxesIcon, path: "/products" },
    { name: "Facturación", icon: ReceiptIcon, path: "/create" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {/* BOTON HAMBURGUESA */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-900 shadow"
      >
        <Menu size={22} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 flex flex-col w-64 h-screen
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* BOTON CERRAR (solo móvil) */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* LOGO */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <img src="/logo-white.png" className="w-4" />
          </div>

          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Facturación
          </h1>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2 px-4">
          <p className="px-4 mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Menú
          </p>

          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-1
                ${
                  isActive
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="mt-auto p-4 space-y-2">
          <ThemeToggle />

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 lg:hidden"
        />
      )}
    </>
  );
}