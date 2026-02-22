import Link from "next/link";
import BotonEliminarObjeto from "./BotonEliminarObjeto";

export default async function ObjetosPage() {
  // Pedimos todos los objetos al backend (gracias a Prisma, esto ya incluye los datos de la sala)
  const respuesta = await fetch('http://localhost:3000/objeto', { cache: 'no-store' });
  const objetos = await respuesta.json();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Piezas y Objetos</h2>
        <Link 
          href="/dashboard/objetos/nuevo" 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          + Registrar Objeto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {objetos.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No hay piezas registradas en el museo todavía.
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
                </tr>
              </thead>
              <tbody>
                {objetos.map((obj: any) => (
                  <tr key={obj.id_objeto} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-500 text-sm">{obj.id_objeto}</td>
                    
                    {/* Título Principal */}
                    <td className="p-4 font-bold text-slate-800">{obj.titulo}</td>
                    
                    {/* Autor */}
                    <td className="p-4 text-slate-600 text-sm">{obj.autor || "Desconocido"}</td>
                    
                    {/* Año exacto */}
                    <td className="p-4 text-slate-600 text-sm font-medium">{obj.anio || "N/A"}</td>
                    
                    {/* Nombre de la Sala con un diseño de etiqueta */}
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md border border-indigo-100 text-xs font-bold">
                        {obj.sala?.nombre || "Sin Sala"}
                      </span>
                    </td>
                    
                    {/* Ubicación física dentro del museo */}
                    <td className="p-4 text-slate-500 text-xs font-medium">
                      {obj.sala?.ubicacion || "No especificada"}
                    </td>

                    <td className="p-4 text-slate-500 text-xs font-medium">
                      {obj.estado_conservacion || "No especificada"}
                    </td>

                    <td className="p-4 text-center space-x-4">
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
    </div>
  );
}