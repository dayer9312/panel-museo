"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoObjetoPage() {
  const router = useRouter();
  
  // Estados para cargar las salas desde la BD
  const [salas, setSalas] = useState<any[]>([]);
  const [cargandoSalas, setCargandoSalas] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados del formulario
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [anio, setAnio] = useState("");
  const [autor, setAutor] = useState("");
  const [estadoConservacion, setEstadoConservacion] = useState("BUENO");
  const [idSala, setIdSala] = useState("");

  // 1. Al abrir la página, buscamos las salas disponibles
  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const res = await fetch("http://localhost:3000/sala");
        const data = await res.json();
        setSalas(data);
        // Si hay salas, seleccionamos la primera por defecto
        if (data.length > 0) {
          setIdSala(data[0].id_sala.toString());
        }
      } catch (error) {
        console.error("Error al cargar las salas:", error);
      } finally {
        setCargandoSalas(false);
      }
    };
    fetchSalas();
  }, []);

  // 2. Función para guardar el objeto en la BD
  const guardarObjeto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idSala) {
      alert("⚠️ Debes crear al menos una Sala antes de registrar objetos.");
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch("http://localhost:3000/objeto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          titulo, 
          descripcion, 
          anio, 
          autor,
          estado_conservacion: estadoConservacion,
          id_sala: Number(idSala) // Lo convertimos a número para Prisma
        }),
      });

     if (respuesta.ok) {
        router.push("/dashboard/objetos");
        router.refresh();
      } else {
        // === LA MAGIA ESTÁ AQUÍ ===
        // Leemos la respuesta exacta de NestJS y la mostramos en la alerta
        const errorData = await respuesta.json(); 
        console.error("Detalles del error:", errorData);
        alert("⚠️ El servidor rechazó los datos por esto:\n\n" + JSON.stringify(errorData.message, null, 2));
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Registrar Nueva Pieza</h2>
        <p className="text-slate-500 mt-1">Añade un objeto histórico o documento al catálogo del museo.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={guardarObjeto} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Título de la Pieza *</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ej: Espada de Simón Bolívar" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>

            {/* Autor */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Autor / Creador</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ej: Desconocido" value={autor} onChange={(e) => setAutor(e.target.value)} />
            </div>

            {/* Año */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Año o Época</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ej: 1825 o Siglo XIX" value={anio} onChange={(e) => setAnio(e.target.value)} />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción Histórica *</label>
            <textarea required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none" placeholder="Detalla la historia y relevancia de este objeto..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            {/* Ubicación (Sala) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación (Sala) *</label>
              {cargandoSalas ? (
                <p className="text-sm text-slate-500">Cargando salas...</p>
              ) : (
                <select 
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                  value={idSala}
                  onChange={(e) => setIdSala(e.target.value)}
                >
                  {salas.map((sala) => (
                    <option key={sala.id_sala} value={sala.id_sala}>
                      {sala.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Estado de Conservación */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Estado de Conservación *</label>
              <select 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                value={estadoConservacion}
                onChange={(e) => setEstadoConservacion(e.target.value)}
              >
                <option value="BUENO">Bueno (Óptimas condiciones)</option>
                <option value="REGULAR">Regular (Requiere cuidado)</option>
                <option value="MALO">Malo (En restauración)</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button type="submit" disabled={guardando || cargandoSalas} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-blue-400">
              {guardando ? "Guardando..." : "Guardar Objeto"}
            </button>
            <Link href="/dashboard/objetos" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg transition-colors">
              Cancelar
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}