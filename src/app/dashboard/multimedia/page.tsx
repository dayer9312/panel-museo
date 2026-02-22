import Link from "next/link";

export default async function MultimediaPage() {
  let archivos = [];
  try {
    const respuesta = await fetch('http://localhost:3000/media', { cache: 'no-store' });
    if (respuesta.ok) {
      archivos = await respuesta.json();
    }
  } catch (error) {
    console.error("Error al cargar multimedia:", error);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Galería Multimedia</h2>
          <p className="text-slate-500 mt-1">Gestiona las fotos y audios de las piezas del museo.</p>
        </div>
        <Link href="/dashboard/multimedia/nuevo" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
          + Subir Archivo
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {archivos.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No hay archivos multimedia registrados todavía.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">Vista Previa</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Tipo</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Descripción</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Pieza Asociada</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {archivos.map((media: any) => {
                  // Lógica inteligente para saber si la URL es de internet o local
                  const urlFinal = media.url?.startsWith("http") 
                    ? media.url 
                    : `http://localhost:3000/${media.url?.replace(/^\//, '')}`;

                  return (
                    // Usamos id_medio exactamente como está en tu BD
                    <tr key={media.id_medio} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        {media.tipo === 'IMAGEN' ? (
                          <div className="w-16 h-16 rounded overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                            <img src={urlFinal} alt="Preview" className="object-cover w-full h-full" />
                          </div>
                        ) : media.tipo === 'AUDIO' ? (
                          <audio controls className="h-8 w-48">
                            <source src={urlFinal} type="audio/mpeg" />
                          </audio>
                        ) : (
                          <span className="text-slate-400 text-xs">Desconocido</span>
                        )}
                      </td>
                      <td className="p-4 font-bold">
                        <span className={`px-3 py-1 rounded-full text-xs ${media.tipo === 'IMAGEN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {media.tipo}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 text-sm truncate max-w-[200px]">
                        {media.descripcion || "Sin descripción"}
                      </td>
                      <td className="p-4 text-slate-600 text-sm">
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md border border-indigo-100 text-xs font-bold">
                          {media.objeto?.titulo || `ID: ${media.id_objeto}`}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors cursor-pointer">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}