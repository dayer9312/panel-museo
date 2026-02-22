"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const idUsuario = params.id;

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "EDITOR",
    contrasena: "" // Opcional en la edición
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // 1. Cargar datos del usuario al abrir la página
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:3000/usuario/${idUsuario}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            rol: data.rol,
            contrasena: "" // La dejamos vacía por seguridad
          });
        }
      } catch (error) {
        alert("Error al cargar los datos del usuario.");
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();
  }, [idUsuario]);

  const actualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    // Creamos un objeto con los cambios
    const datosActualizados: any = { ...formData };
    
    // Si la contraseña está vacía, la eliminamos del objeto para no sobreescribirla con nada
    if (!datosActualizados.contrasena) {
      delete datosActualizados.contrasena;
    }

    try {
      const res = await fetch(`http://localhost:3000/usuario/${idUsuario}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados),
      });

      if (res.ok) {
        router.push("/dashboard/usuarios");
        router.refresh();
      } else {
        const err = await res.json();
        alert("⚠️ Error al actualizar: " + JSON.stringify(err.message));
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="p-10 text-center font-bold text-slate-500">Cargando perfil del integrante...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Editar Integrante</h2>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={actualizar} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Apellido</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
            <input type="email" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
              value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nueva Contraseña (Dejar en blanco para no cambiar)</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
              value={formData.contrasena} onChange={e => setFormData({...formData, contrasena: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Rol de Acceso</label>
            <select className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500" 
              value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})}>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button type="submit" disabled={guardando} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-lg transition-all disabled:bg-indigo-300">
              {guardando ? "Actualizando..." : "Guardar Cambios"}
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