import Link from "next/link";
import VistaPreviaQR from "./VistaPreviaQR"; 
import BotonEliminarQR from "./BotonEliminarQR"; 

export default async function QrPage() {
  let codigos = [];
  try {
    const respuesta = await fetch('http://localhost:3000/codigo-qr', { cache: 'no-store' });
    if (respuesta.ok) codigos = await respuesta.json();
  } catch (error) {
    console.error("Error cargando QRs:", error);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Códigos QR</h2>
          <p className="text-slate-500 mt-1">Genera identificadores para las piezas del museo.</p>
        </div>
        <Link href="/dashboard/qr/nuevo" className="bg-slate-800 hover:bg-black text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
          + Generar Nuevo QR
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {codigos.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No hay códigos QR generados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">Código Identificador</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Pieza Asociada</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Estado</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {codigos.map((qr: any) => (
                  <tr key={qr.id_qr} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    
                    {/* 1. Identificador */}
                    <td className="p-4 font-mono font-bold text-blue-600">
                      {qr.codigo}
                    </td>

                    {/* 2. Pieza Asociada (Nombre del objetoMuseologico) */}
                    <td className="p-4 text-slate-700 font-medium">
                      {qr.objeto?.titulo || "Sin pieza asociada"}
                    </td>

                    {/* 3. Estado */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${qr.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {qr.estado}
                      </span>
                    </td>

                    {/* 4. Acciones (Botones bien puestos) */}
                    <td className="p-4 text-center space-x-4">
                      <VistaPreviaQR valor={qr.codigo} titulo={qr.objeto?.titulo} />
                      <BotonEliminarQR idQr={qr.id_qr} /> 
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