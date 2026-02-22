"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevaSalaPage() {
  const router = useRouter();
  
  // Estados para guardar lo que el usuario escribe
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [orden, setOrden] = useState(1);
  const [cargando, setCargando] = useState(false);

  // Función que se dispara al enviar el formulario
  const guardarSala = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const respuesta = await fetch("http://localhost:3000/sala", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          nombre: nombre, 
          descripcion: descripcion, 
          orden: Number(orden) // Aseguramos que sea un número para la BD
        }),
      });

      if (respuesta.ok) {
        // Redirigimos a la tabla y le decimos a Next.js que refresque los datos
        router.push("/dashboard/salas");
        router.refresh(); 
      } else {
        alert("⚠️ Hubo un error al guardar la sala.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Encabezado */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Crear Nueva Sala</h2>
        <p className="text-slate-500 mt-1">Añade un nuevo espacio al recorrido del museo.</p>
      </div>

      {/* Tarjeta del Formulario */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={guardarSala} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de la Sala</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="Ej: Sala de la República"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción</label>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Escribe un breve resumen sobre esta sala..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Orden del Recorrido</label>
            <input 
              type="number" 
              required
              min="1"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              value={orden}
              onChange={(e) => setOrden(Number(e.target.value))}
            />
            <p className="text-xs text-slate-500 mt-1">El número indica la posición de la sala en la app móvil.</p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-blue-400"
            >
              {cargando ? "Guardando..." : "Guardar Sala"}
            </button>
            <Link 
              href="/dashboard/salas" 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Cancelar
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}