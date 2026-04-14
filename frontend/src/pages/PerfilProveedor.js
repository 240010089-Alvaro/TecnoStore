import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PerfilProveedor() {
  const [proveedor, setProveedor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setProveedor(data);
  }, []);

  if (!proveedor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="animate-pulse text-lg text-gray-400">
          Cargando perfil...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-cyan-400/20 rounded-3xl shadow-2xl p-8"
      >
        {/* 🔥 HEADER */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-2xl font-bold shadow-lg">
            {proveedor.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-2xl font-bold mt-4 text-white">
            {proveedor.name}
          </h2>

          <p className="text-cyan-400 text-sm">
            Proveedor
          </p>
        </div>

        {/* 🔥 INFO */}
        <div className="space-y-4 text-sm">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-gray-400">Correo</span>
            <p className="font-semibold text-white">{proveedor.email}</p>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-gray-400">Empresa</span>
            <p className="font-semibold text-white">{proveedor.empresa}</p>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-gray-400">Teléfono</span>
            <p className="font-semibold text-white">{proveedor.telefono}</p>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-gray-400">Dirección</span>
            <p className="font-semibold text-white">
              {proveedor.direccion || "No registrada"}
            </p>
          </div>
        </div>

        {/* 🔥 BOTONES */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate("/proveedor")}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            ⬅ Volver al Panel
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default PerfilProveedor;