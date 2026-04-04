import { Menu } from "lucide-react";

export default function MobileNavbar({ setOpen }) {
  return (
    <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b dark:border-gray-800 bg-white dark:bg-gray-900">
      <button onClick={() => setOpen(true)}>
        <Menu size={24} />
      </button>

      <h1 className="font-semibold">Facturación</h1>
    </div>
  );
}