import Link from "next/link";
import BotonEliminar from "./BotonEliminar"; // <--- Importamos tu nuevo botón

export default async function SalasPage() {
  const respuesta = await fetch('http://localhost:3000/sala', { cache: 'no-store' });
  const salas = await respuesta.json();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Gestión de Salas</h2>
        <Link href="/dashboard/salas/nueva" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
          + Nueva Sala
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {salas.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No hay salas registradas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">ID</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Nombre</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Descripción</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-center">Orden</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {salas.map((sala: any) => (
                  <tr key={sala.id_sala} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-500 text-sm">{sala.id_sala}</td>
                    <td className="p-4 font-bold text-slate-800">{sala.nombre}</td>
                    <td className="p-4 text-slate-600 text-sm truncate max-w-xs">{sala.descripcion}</td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                        {sala.orden_recorrido}
                      </span>
                    </td>
                    
                    {/* ===== AQUÍ ESTÁ LA MAGIA ===== */}
                    <td className="p-4 text-center space-x-4">
                      {/* El botón Editar usa la ruta dinámica con el ID de la sala */}
                      <Link 
                        href={`/dashboard/salas/editar/${sala.id_sala}`} 
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                      >
                        Editar
                      </Link>

                      {/* Tu componente cliente que maneja el click de eliminar */}
                      <BotonEliminar idSala={sala.id_sala} />
                    </td>
                    {/* ============================== */}

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