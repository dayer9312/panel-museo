"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarObjetoPage() {
  const router = useRouter();
  const params = useParams();
  const idObjeto = params.id; // Sacamos el ID de la URL

  // Estados
  const [salas, setSalas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados del formulario
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [anio, setAnio] = useState("");
  const [autor, setAutor] = useState("");
  const [estadoConservacion, setEstadoConservacion] = useState("BUENO");
  const [idSala, setIdSala] = useState("");

  // 1. Cargar Salas y los datos de este Objeto en específico
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Pedimos ambas cosas al servidor en paralelo
        const [resSalas, resObjeto] = await Promise.all([
          fetch("http://localhost:3000/sala"),
          fetch(`http://localhost:3000/objeto/${idObjeto}`)
        ]);

        const dataSalas = await resSalas.json();
        const dataObjeto = await resObjeto.json();

        setSalas(dataSalas);

        // Llenamos el formulario con los datos que trajo el backend
        setTitulo(dataObjeto.titulo);
        setDescripcion(dataObjeto.descripcion);
        setAnio(dataObjeto.anio || "");
        setAutor(dataObjeto.autor || "");
        setEstadoConservacion(dataObjeto.estado_conservacion || "BUENO");
        setIdSala(dataObjeto.id_sala?.toString() || "");

      } catch (error) {
        alert("Error al cargar los datos.");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [idObjeto]);

  // 2. Guardar los cambios (PATCH)
  const actualizarObjeto = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const respuesta = await fetch(`http://localhost:3000/objeto/${idObjeto}`, {
        method: "PATCH", // Ojo aquí: PATCH es para actualizar
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descripcion,
          anio,
          autor,
          estado_conservacion: estadoConservacion,
          id_sala: Number(idSala)
        }),
      });

      if (respuesta.ok) {
        router.push("/dashboard/objetos");
        router.refresh();
      } else {
        const errorData = await respuesta.json();
        alert("⚠️ Error al actualizar:\n" + JSON.stringify(errorData.message, null, 2));
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="p-8 text-center text-slate-500 font-bold">Cargando datos de la pieza...</div>;

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Editar Pieza</h2>
        <p className="text-slate-500 mt-1">Modifica los detalles de este objeto histórico.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={actualizarObjeto} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Título de la Pieza *</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Autor / Creador</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={autor} onChange={(e) => setAutor(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Año o Época</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={anio} onChange={(e) => setAnio(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción Histórica *</label>
            <textarea required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación (Sala) *</label>
              <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white" value={idSala} onChange={(e) => setIdSala(e.target.value)}>
                <option value="" disabled>Selecciona una sala...</option>
                {salas.map((sala) => (
                  <option key={sala.id_sala} value={sala.id_sala}>{sala.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Estado de Conservación *</label>
              <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white" value={estadoConservacion} onChange={(e) => setEstadoConservacion(e.target.value)}>
                <option value="BUENO">Bueno (Óptimas condiciones)</option>
                <option value="REGULAR">Regular (Requiere cuidado)</option>
                <option value="MALO">Malo (En restauración)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button type="submit" disabled={guardando} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-blue-400">
              {guardando ? "Actualizando..." : "Actualizar Objeto"}
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