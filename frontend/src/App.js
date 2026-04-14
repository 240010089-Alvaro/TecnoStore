import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PantallaInicio from "./pages/PantallaInicio";
import PanelProveedor from "./pages/PanelProveedor";
import PerfilProveedor from "./pages/PerfilProveedor";
import Productos from "./pages/Productos";
import GestionarProductos from "./pages/GestionarProductos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/PantallaInicio" element={<PantallaInicio />} />
        <Route path="/proveedor" element={<PanelProveedor />} />
        <Route path="/perfil-proveedor" element={<PerfilProveedor />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/gestionar-productos" element={<GestionarProductos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;