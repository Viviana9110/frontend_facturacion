// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import CreateInvoice from "./pages/CreateInvoice";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex">
        <Sidebar/>
        <div className="flex-1">
          <Toaster richColors position="top-right" />
          <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/clients" element={<Clients/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/create" element={<CreateInvoice />} />
      </Routes>

        </div>
      </div>
      </ThemeProvider>     
      
    </BrowserRouter>
  );
}

export default App;