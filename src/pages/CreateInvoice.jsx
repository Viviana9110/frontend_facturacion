import { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import { Trash2, PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreateInvoice() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Debes iniciar sesión");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsRes = await API.get("/clients");
        const productsRes = await API.get("/products");
        setClients(clientsRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Error cargando datos");
      }
    };
    fetchData();
  }, []);

  const selectedClient = useMemo(
    () => clients.find((c) => c._id === clientId),
    [clientId, clients]
  );

  const addProduct = (productId) => {
    if (!productId) return;

    const exists = items.find((i) => i.productId === productId);

    if (exists) {
      setItems(
        items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setItems([...items, { productId, quantity: 1 }]);
    }
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;

    const updated = [...items];
    updated[index].quantity = quantity;
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => {
    const product = products.find((p) => p._id === item.productId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const handleSubmit = async () => {
  if (!clientId) return toast.warning("Selecciona un cliente");
  if (items.length === 0) return toast.warning("Agrega productos");

  try {
    setLoading(true);

    await API.post("/invoices", { clientId, items });

    toast.success("Factura creada exitosamente 🎉");

    // ⏳ pequeño delay para que el usuario vea el toast
    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);

  } catch (error) {
    console.error(error);
    toast.error("Error al crear la factura");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-semibold mb-6">
          Nueva Factura
        </h1>

        {/* CLIENTE */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border mb-6">
          <select
            className="w-full border rounded-xl px-4 py-2 bg-white dark:bg-gray-900"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">Seleccionar cliente</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* PRODUCTOS */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border mb-6">
          <select
            className="w-full border rounded-xl px-4 py-2 bg-white dark:bg-gray-900"
            onChange={(e) => addProduct(e.target.value)}
          >
            <option value="">Seleccionar producto</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} - ${p.price}
              </option>
            ))}
          </select>
        </div>

        {/* TABLA */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border mb-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">
              No hay productos
            </p>
          ) : (
            <table className="w-full">
              <tbody>
                {items.map((item, index) => {
                  const product = products.find(
                    (p) => p._id === item.productId
                  );

                  return (
                    <tr key={index}>
                      <td>{product?.name}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(index, Number(e.target.value))
                          }
                          className="w-16 border rounded"
                        />
                      </td>
                      <td>${product?.price}</td>
                      <td>
                        ${(product?.price || 0) * item.quantity}
                      </td>
                      <td>
                        <button onClick={() => removeItem(index)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* TOTALES */}
        <div className="text-right mb-6">
          <p>Subtotal: ${subtotal}</p>
          <p>IVA: ${iva.toFixed(2)}</p>
          <p className="text-xl font-bold">
            Total: ${total.toFixed(2)}
          </p>
        </div>

        {/* BOTÓN */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creando factura...
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                Crear Factura
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}