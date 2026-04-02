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

  const [date, setDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");

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
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setItems((prev) => [...prev, { productId, quantity: 1 }]);
    }
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;

    setItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => {
    const product = products.find((p) => p._id === item.productId);
    return acc + (Number(product?.price) || 0) * item.quantity;
  }, 0);

  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const handleSubmit = async () => {
    if (!clientId) return toast.warning("Selecciona un cliente");
    if (!selectedClient) return toast.warning("Cliente inválido");
    if (items.length === 0)
      return toast.warning("Agrega productos");

    try {
      setLoading(true);

      const payload = {
        clientId,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
        })),
        date,
        paymentMethod,
      };
     

      await API.post("/invoices", payload);

      toast.success("Factura creada exitosamente 🎉");

      // 🔥 REDIRECCIÓN
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.msg || "Error al crear la factura"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border mb-6">
          <div className="flex justify-between">
            <div>
              <h1 className="text-xl font-bold">TU EMPRESA S.A.S</h1>
              <p className="text-sm text-gray-500">NIT: 900123456</p>
              <p className="text-sm text-gray-500">Dirección: Colombia</p>
            </div>

            <div className="text-right">
              <h2 className="text-lg font-semibold">FACTURA</h2>
              <p className="text-sm text-gray-500">No. 0001</p>
            </div>
          </div>
        </div>

        {/* CLIENTE + FACTURA */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border">
            <label className="text-sm text-gray-500">Cliente</label>

            <select
              className="w-full mt-2 border rounded-xl px-4 py-2 bg-white dark:bg-gray-900"
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

            {selectedClient && (
              <div className="mt-4 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <p><strong>Nombre:</strong> {selectedClient.name}</p>
                <p><strong>Email:</strong> {selectedClient.email}</p>
                <p><strong>Teléfono:</strong> {selectedClient.phone || "N/A"}</p>
                <p><strong>ID:</strong> {selectedClient.identification || "N/A"}</p>
                <p><strong>Dirección:</strong> {selectedClient.address || "N/A"}</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border">
            <label className="text-sm text-gray-500">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-2 border rounded-xl px-4 py-2 bg-white dark:bg-gray-900"
            />

            <label className="text-sm text-gray-500 mt-4 block">
              Método de pago
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full mt-2 border rounded-xl px-4 py-2 bg-white dark:bg-gray-900"
            >
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Tarjeta</option>
              <option>Crédito</option>
            </select>
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border mb-6">
          <select
            className="w-full border rounded-xl px-4 py-2 bg-white dark:bg-gray-900"
            onChange={(e) => {
              addProduct(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">Agregar producto</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} - ${p.price}
              </option>
            ))}
          </select>
        </div>

        {/* TABLA */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border mb-6">
          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th>Producto</th>
                <th>Cant</th>
                <th>Precio</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const product = products.find((p) => p._id === item.productId);

                return (
                  <tr key={index} className="border-b">
                    <td>{product?.name}</td>

                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(index, Number(e.target.value))
                        }
                        className="w-16 border rounded text-center"
                      />
                    </td>

                    <td>${product?.price}</td>
                    <td>${(product?.price || 0) * item.quantity}</td>

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
        </div>

        {/* TOTALES */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border text-right mb-6">
          <p>Subtotal: ${subtotal}</p>
          <p>IVA (19%): ${iva.toFixed(2)}</p>
          <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
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