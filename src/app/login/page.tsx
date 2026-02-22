"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Enviamos el correo y contraseña al backend real
      const respuesta = await fetch("http://localhost:3000/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          correo: email, 
          contrasena: password 
        }),
      });

      // 2. Verificamos la respuesta del servidor
      if (respuesta.ok) {
        const data = await respuesta.json();
        
        // Guardamos los datos del usuario real en el navegador
        localStorage.setItem("isLoggedIn", "true"); 
        localStorage.setItem("usuarioNombre", data.usuario.nombre); 
        
        router.push("/dashboard"); // ¡Abre la puerta!
      } else {
        alert("⚠️ Credenciales incorrectas. Intenta de nuevo.");
      }
    } catch (error) {
      alert("Error al conectar con el servidor. Verifica que tu backend esté encendido.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 tracking-wide">CASA DE LA LIBERTAD</h1>
          <p className="text-slate-500 mt-2">Panel de Administración</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mt-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="admin@monkeystudio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
          >
            Ingresar al Sistema
          </button>
        </form>

      </div>
    </div>
  );
}