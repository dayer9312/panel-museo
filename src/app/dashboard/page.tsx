import { 
  HiOutlineChartBar, 
  HiOutlineDeviceMobile, 
  HiOutlineLibrary, 
  HiOutlinePhotograph, 
  HiOutlineQrcode, 
  HiOutlineUsers 
} from "react-icons/hi";

export default async function DashboardPage() {
  // Realizamos todas las consultas en paralelo, incluyendo la nueva de estadísticas
  const [resSalas, resObjetos, resMedia, resUsuarios, resQr, resVisitas] = await Promise.all([
    fetch('http://localhost:3000/sala', { cache: 'no-store' }),
    fetch('http://localhost:3000/objeto', { cache: 'no-store' }),
    fetch('http://localhost:3000/media', { cache: 'no-store' }),
    fetch('http://localhost:3000/usuario', { cache: 'no-store' }),
    fetch('http://localhost:3000/codigo-qr', { cache: 'no-store' }),
    fetch('http://localhost:3000/estadistica-visita', { cache: 'no-store' }),
  ]);

  const salas = await resSalas.json();
  const objetos = await resObjetos.json();
  const media = await resMedia.json();
  const usuarios = await resUsuarios.json();
  const qrs = await resQr.json();
  const visitas = await resVisitas.json();

  // --- LÓGICA DE ESTADÍSTICAS ---
  // Calculamos el conteo de visitas por título de objeto
  const conteoVisitas = visitas.reduce((acc: any, v: any) => {
    const titulo = v.objeto?.titulo || "Pieza Desconocida";
    acc[titulo] = (acc[titulo] || 0) + 1;
    return acc;
  }, {});

  // Ordenamos para obtener el Top 5
  const topObjetos = Object.entries(conteoVisitas)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  const stats = [
    { name: 'Salas', value: salas.length, icon: '🏛️', color: 'bg-blue-500' },
    { name: 'Piezas Museo', value: objetos.length, icon: '🏺', color: 'bg-amber-500' },
    { name: 'Multimedia', value: media.length, icon: '📸', color: 'bg-purple-500' },
    { name: 'Códigos QR', value: qrs.length, icon: '🔳', color: 'bg-slate-800' },
    { name: 'Usuarios', value: usuarios.length, icon: '👥', color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Bienvenido al Panel de Control</h1>
        <p className="text-slate-500">Gestión oficial del Museo Casa de la Libertad - Monkey Studio</p>
      </div>

      {/* Grid de Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{item.name}</p>
              <p className="text-2xl font-bold text-slate-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico de Popularidad (Ranking) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <HiOutlineChartBar className="mr-2 text-indigo-500" />
            Ranking de Piezas (Escaneos en App)
          </h2>
          <div className="space-y-5">
            {topObjetos.length > 0 ? topObjetos.map(([titulo, cantidad]: any) => {
              const porcentaje = (cantidad / visitas.length) * 100;
              return (
                <div key={titulo}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-slate-700">{titulo}</span>
                    <span className="text-indigo-600 font-bold">{cantidad} visitas</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="bg-indigo-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-slate-400 italic">Aún no hay registros de visitas desde la aplicación.</p>
            )}
          </div>
        </div>

        {/* Uso de Dispositivos */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center">
            <HiOutlineDeviceMobile className="mr-2 text-emerald-500" />
            Dispositivos
          </h2>
          <div className="text-center py-6">
             <div className="text-5xl font-extrabold text-slate-800">{visitas.length}</div>
             <p className="text-slate-400 text-sm mt-1 uppercase tracking-tighter">Total Escaneos</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-auto">
             <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Android</span>
                <span className="text-xl font-bold text-indigo-600">
                  {visitas.filter((v: any) => v.dispositivo === 'Android').length}
                </span>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">iOS</span>
                <span className="text-xl font-bold text-rose-500">
                  {visitas.filter((v: any) => v.dispositivo === 'iOS').length}
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Sección Inferior: Accesos Rápidos y Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/dashboard/objetos/nuevo" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 text-center">
              <span className="block text-2xl mb-1">🏺</span>
              <span className="text-sm font-bold text-slate-700">Registrar Objeto</span>
            </a>
            <a href="/dashboard/multimedia/nuevo" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 text-center">
              <span className="block text-2xl mb-1">📸</span>
              <span className="text-sm font-bold text-slate-700">Subir Multimedia</span>
            </a>
            <a href="/dashboard/qr/nuevo" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 text-center">
              <span className="block text-2xl mb-1">🔳</span>
              <span className="text-sm font-bold text-slate-700">Generar QR</span>
            </a>
            <a href="/dashboard/usuarios/nuevo" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 text-center">
              <span className="block text-2xl mb-1">👤</span>
              <span className="text-sm font-bold text-slate-700">Nuevo Usuario</span>
            </a>
          </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl shadow-lg text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            Estado del Servidor
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">Base de Datos</span>
              <span className="text-green-400 font-mono text-sm">Conectada</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700">
              <span className="text-slate-400">Backend (NestJS)</span>
              <span className="text-green-400 font-mono text-sm">En línea</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">App Guía Virtual</span>
              <span className="text-blue-400 font-mono text-sm">v1.0.0</span>
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-500 italic text-center">
            © 2026 Dayer Labrandero - Casa de la Libertad
          </p>
        </div>
      </div>
    </div>
  );
}