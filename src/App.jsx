import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./layouts/Layout";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Layout />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;