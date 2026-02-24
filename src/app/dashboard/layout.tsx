"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  HiOutlineHome, 
  HiOutlineLibrary, 
  HiOutlineCube, 
  HiOutlinePhotograph, 
  HiOutlineQrcode, 
  HiOutlineUsers,
  HiOutlineLogout
} from "react-icons/hi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const router = useRouter();
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>("Admin");
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    // 1. Buscamos el token y los datos en el bolsillo (localStorage)
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");

    // 2. Si no hay token, lo mandamos directo al Login
    if (!token) {
      router.push("/login");
    } else {
      // 3. Si todo está en orden, lo dejamos pasar
      setUserRole(role);
      setUserName(name);
      setVerificando(false);
    }
  }, [router]);

  // Pantalla de carga mientras el guardia revisa el gafete
  if (verificando) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Verificando seguridad...</p>
        </div>
      </div>
    );
  }

  // Función para saber si el enlace está activo
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { name: "Inicio", href: "/dashboard", icon: HiOutlineHome },
    { name: "Salas", href: "/dashboard/salas", icon: HiOutlineLibrary },
    { name: "Objetos y Piezas", href: "/dashboard/objetos", icon: HiOutlineCube },
    { name: "Multimedia", href: "/dashboard/multimedia", icon: HiOutlinePhotograph },
    { name: "Códigos QR", href: "/dashboard/qr", icon: HiOutlineQrcode },
    { name: "Usuarios", href: "/dashboard/usuarios", icon: HiOutlineUsers },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* ================= SIDEBAR MODERNO ================= */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl">
        
        {/* Logo con Branding de Monkey Studio */}
        <div className="h-20 flex flex-col items-center justify-center border-b border-slate-800 px-4">
          <h1 className="text-white text-lg font-black tracking-tighter">
            CASA DE LA <span className="text-indigo-500">LIBERTAD</span>
          </h1>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
            Museo de la Casa de la Libertad
          </span>
        </div>

        {/* Navegación Estilizada */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.href) 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
                : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className={`text-xl ${isActive(item.href) ? "text-white" : "text-slate-500 group-hover:text-indigo-400"}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Perfil de Usuario y Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              window.location.href = "/login";
            }}
            className="flex items-center justify-center space-x-2 w-full bg-slate-800 hover:bg-red-600/20 hover:text-red-500 text-slate-400 font-bold py-3 px-4 rounded-xl transition-all duration-300 group"
          >
            <HiOutlineLogout className="text-xl group-hover:scale-110 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ================= ÁREA DE CONTENIDO ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Superior (Opcional, para dar aire) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
            <div className="text-slate-400 text-sm">
                Panel Administrativo &gt; <span className="text-slate-800 font-medium capitalize">{pathname.split('/').pop() || 'Inicio'}</span>
            </div>
            <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    {userName?.charAt(0) || 'U'}
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}