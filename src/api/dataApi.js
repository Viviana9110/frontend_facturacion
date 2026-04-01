// src/api/dataApi.js
import API from "./invoiceApi";

export const getClients = () => API.get("/clients");
export const getProducts = () => API.get("/products");