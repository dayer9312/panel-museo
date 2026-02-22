"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoMultimediaPage() {
  const router = useRouter();

  const [objetos, setObjetos] = useState<any[]>([]);
  const [cargandoObjetos, setCargandoObjetos] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  // Estados alineados con tu BD
  const [archivo, setArchivo] = useState<File | null>(null);
  const [tipo, setTipo] = useState("IMAGEN");
  const [descripcion, setDescripcion] = useState("");
  const [idObjeto, setIdObjeto] = useState("");

  useEffect(() => {
    const fetchObjetos = async () => {
      try {
        const res = await fetch("http://localhost:3000/objeto");
        const data = await res.json();
        setObjetos(data);
        if (data.length > 0) setIdObjeto(data[0].id_objeto.toString());
      } catch (error) {
        console.error("Error al cargar objetos");
      } finally {
        setCargandoObjetos(false);
      }
    };
    fetchObjetos();
  }, []);

  const subirArchivo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      alert("⚠️ Por favor selecciona un archivo.");
      return;
    }
    if (!idObjeto) return;

    setSubiendo(true);

    const formData = new FormData();
    // 1. CAMBIO CLAVE: Cambiamos "file" por "archivo" para que coincida con tu backend
    formData.append("archivo", archivo); 
    formData.append("tipo", tipo);
    formData.append("descripcion", descripcion);
    formData.append("id_objeto", idObjeto);

    try {
      // 2. CAMBIO CLAVE: Apuntamos al endpoint correcto: /media/subir
      const respuesta = await fetch("http://localhost:3000/media/subir", {
        method: "POST",
        body: formData,
      });

      if (respuesta.ok) {
        router.push("/dashboard/multimedia");
        router.refresh();
      } else {
        const errorData = await respuesta.json();
        alert("⚠️ Error al subir:\n" + JSON.stringify(errorData.message || errorData, null, 2));
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-10">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Subir Archivo Multimedia</h2>
        <p className="text-slate-500 mt-1">Añade fotos o audios y asócialos a una pieza específica.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={subirArchivo} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Seleccionar Archivo *</label>
              <input type="file" required accept={tipo === "IMAGEN" ? "image/*" : "audio/*"} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer" onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Archivo *</label>
              <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="IMAGEN">IMAGEN</option>
                <option value="AUDIO">AUDIO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción del Archivo</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ej: Foto en alta resolución del acta..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Asignar a Pieza *</label>
            {cargandoObjetos ? (
              <p className="text-sm text-slate-500">Cargando piezas...</p>
            ) : (
              <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white" value={idObjeto} onChange={(e) => setIdObjeto(e.target.value)}>
                {objetos.map((obj) => (
                  <option key={obj.id_objeto} value={obj.id_objeto}>{obj.titulo}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button type="submit" disabled={subiendo || cargandoObjetos} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-purple-400">
              {subiendo ? "Subiendo archivo..." : "Subir al Servidor"}
            </button>
            <Link href="/dashboard/multimedia" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg transition-colors">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}