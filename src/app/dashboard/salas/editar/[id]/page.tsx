"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarSalaPage() {
  const router = useRouter();
  const params = useParams(); // Rescata el ID de la URL (ej: /editar/5)
  const idSala = params.id;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [orden, setOrden] = useState(1);
  const [cargando, setCargando] = useState(true);

  // Al entrar a la página, buscamos los datos de ESA sala en específico
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/sala/${idSala}`);
        const data = await res.json();
        
        // Llenamos los cajoncitos con la información de la base de datos
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setOrden(data.orden_recorrido);
      } catch (error) {
        alert("Error al cargar la sala.");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [idSala]);

  const actualizarSala = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const respuesta = await fetch(`http://localhost:3000/sala/${idSala}`, {
        method: "PATCH", // PATCH es para actualizar!
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, orden: Number(orden) }),
      });

      if (respuesta.ok) {
        router.push("/dashboard/salas");
        router.refresh();
      } else {
        alert("Hubo un error al actualizar.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div className="p-8 text-center text-slate-500 font-bold">Cargando datos de la sala...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Editar Sala</h2>
        <p className="text-slate-500 mt-1">Modifica los detalles del espacio.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={actualizarSala} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción</label>
            <textarea required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Orden del Recorrido</label>
            <input type="number" required min="1" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={orden} onChange={(e) => setOrden(Number(e.target.value))} />
          </div>
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button type="submit" disabled={cargando} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-blue-400">
              {cargando ? "Guardando..." : "Actualizar Sala"}
            </button>
            <Link href="/dashboard/salas" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg transition-colors">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}