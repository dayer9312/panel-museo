"use client";
import { useState } from "react";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // 🔐 ¡Aquí atrapamos el JWT y los datos del usuario!
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userRole", data.usuario.rol);
        localStorage.setItem("userName", data.usuario.nombre);
        localStorage.setItem("isLoggedIn", "true");

        // Usamos window.location para forzar la recarga y que el Layout lea el nuevo rol
        window.location.href = "/dashboard";
      } else {
        setError("Acceso denegado. Verifica tu correo y contraseña.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">
            CASA DE LA <span className="text-indigo-600">LIBERTAD</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 tracking-[0.2em] uppercase">
            Monkey Studio Management
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
              placeholder="admin@monkeystudio.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Contraseña
            </label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/30"
          >
            {cargando ? "Verificando credenciales..." : "Ingresar al Panel"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          <p>Sistema de gestión exclusivo para personal autorizado.</p>
        </div>
      </div>
    </div>
  );
}