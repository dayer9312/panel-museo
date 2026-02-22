"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "", 
    apellido: "", 
    correo: "", // Cambiado de email
    contrasena: "", // Cambiado de password
    rol: "EDITOR"
  });
  const [guardando, setGuardando] = useState(false);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const res = await fetch("http://localhost:3000/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard/usuarios");
        router.refresh();
      } else {
        const err = await res.json();
        alert("⚠️ Error: " + JSON.stringify(err.message));
      }
    } catch (error) { 
      alert("Error de conexión con el servidor."); 
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Nuevo Integrante de Monkey Studio</h2>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={guardar} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Apellido</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                onChange={e => setFormData({...formData, apellido: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
            <input type="email" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
              onChange={e => setFormData({...formData, correo: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
            <input type="password" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
              onChange={e => setFormData({...formData, contrasena: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Rol de Acceso</label>
            <select className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500" 
              onChange={e => setFormData({...formData, rol: e.target.value})}>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button type="submit" disabled={guardando} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-lg transition-all disabled:bg-indigo-300">
              {guardando ? "Registrando..." : "Crear Usuario"}
            </button>
            <Link href="/dashboard/usuarios" className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 px-8 rounded-lg transition-all">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}