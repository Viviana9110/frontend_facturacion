import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Clients from "../pages/Clients";
import Products from "../pages/Products";
import CreateInvoice from "../pages/CreateInvoice";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { Toaster } from "sonner";

export default function Layout() {
  const location = useLocation();

  const hideSidebar = location.pathname === "/";

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-950">
      
      {!hideSidebar && <Sidebar />}

      <main className="flex-1 w-full lg:ml-64 overflow-x-hidden">
        <Toaster richColors position="top-right" />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/products" element={<Products />} />
          <Route path="/create" element={<CreateInvoice />} />
        </Routes>
      </main>

    </div>
  );
}