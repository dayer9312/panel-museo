import Link from "next/link";
import BotonEliminarUsuario from "./BotonEliminarUsuario";

export default async function UsuariosPage() {
  let usuarios = [];
  try {
    const respuesta = await fetch('http://localhost:3000/usuario', { cache: 'no-store' });
    if (respuesta.ok) usuarios = await respuesta.json();
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Equipo Administrativo</h2>
          <p className="text-slate-500 mt-1">Gestiona los accesos de Monkey Studio al panel del museo.</p>
        </div>
        <Link href="/dashboard/usuarios/nuevo" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
          + Nuevo Usuario
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {usuarios.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No hay usuarios registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">Nombre Completo</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Correo Electrónico</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Rol</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u: any) => (
                  <tr key={u.id_usuario} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-700">{u.nombre} {u.apellido}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                        {u.correo} 
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.rol === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-4">
                      <Link href={`/dashboard/usuarios/editar/${u.id_usuario}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">Editar</Link>
                      <BotonEliminarUsuario idUsuario={u.id_usuario} />
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