import {
  Factory,
  HomeIcon,
  LogOut,
  Users2Icon,
  BoxesIcon,
  ReceiptIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const location = useLocation();

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
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm">

      {/* LOGO */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
          <img src="../../public/logo-white.png" className="w-4"/>
        </div>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Facturación
        </h1>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 px-4">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
                ${
                  isActive
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
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
  );
}