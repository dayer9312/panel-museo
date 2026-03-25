"use client"; // 👈 Esto es clave para que React permita usar useState

import { useState } from "react";
import Link from "next/link";
import BotonEliminarObjeto from "./BotonEliminarObjeto"; // Verifica que esta ruta sea correcta

export default function TablaObjetos({ objetos }: { objetos: any[] }) {
  const [busqueda, setBusqueda] = useState("");

  // 🧠 Lógica de filtrado en tiempo real
  const objetosFiltrados = objetos.filter((obj) => {
    const termino = busqueda.toLowerCase();
    
    // Extraemos los campos y nos aseguramos de que no sean nulos
    const titulo = obj.titulo?.toLowerCase() || "";
    const autor = obj.autor?.toLowerCase() || "";
    const anio = obj.anio?.toLowerCase() || "";
    const sala = obj.sala?.nombre?.toLowerCase() || "";
    const estado = obj.estado_conservacion?.toLowerCase() || "";
    const ubicacion = obj.sala?.ubicacion?.toLowerCase() || "";

    // Retorna true si el término de búsqueda coincide con ALGUNO de los campos
    return (
      titulo.includes(termino) ||
      autor.includes(termino) ||
      anio.includes(termino) ||
      sala.includes(termino) ||
      estado.includes(termino) ||
      ubicacion.includes(termino)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* 🔍 Barra de Búsqueda */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full p-3 pl-10 text-sm text-slate-800 border border-slate-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Buscar por título, autor, año, sala, conservación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {objetosFiltrados.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          {busqueda === "" 
            ? "No hay piezas registradas en el museo todavía." 
            : `No se encontraron resultados para "${busqueda}".`}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600 text-sm">ID</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Título</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Autor</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Año</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Sala Asignada</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Ubicación</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-center">Estado de conservacion</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {objetosFiltrados.map((obj: any) => (
                <tr key={obj.id_objeto} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-500 text-sm">{obj.id_objeto}</td>
                  <td className="p-4 font-bold text-slate-800">{obj.titulo}</td>
                  <td className="p-4 text-slate-600 text-sm">{obj.autor || "Desconocido"}</td>
                  <td className="p-4 text-slate-600 text-sm font-medium">{obj.anio || "N/A"}</td>
                  <td className="p-4">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md border border-indigo-100 text-xs font-bold">
                      {obj.sala?.nombre || "Sin Sala"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-xs font-medium">
                    {obj.sala?.ubicacion || "No especificada"}
                  </td>
                  <td className="p-4 text-slate-500 text-xs font-medium text-center">
                    {obj.estado_conservacion || "No especificada"}
                  </td>
                  <td className="p-4 text-center space-x-4 flex justify-center items-center">
                    <Link 
                      href={`/dashboard/objetos/editar/${obj.id_objeto}`} 
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                    >
                      Editar
                    </Link>
                    <BotonEliminarObjeto idObjeto={obj.id_objeto} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}