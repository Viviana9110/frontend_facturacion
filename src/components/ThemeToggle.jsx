import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // evita error de hidratación

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() =>
        setTheme(currentTheme === "dark" ? "light" : "dark")
      }
      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      <span className="text-sm">
        {currentTheme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}