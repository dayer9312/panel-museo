"use client";
import { useRouter } from "next/navigation";

export default function BotonEliminarUsuario({ idUsuario }: { idUsuario: number }) {
  const router = useRouter();

  const eliminar = async () => {
    if (!confirm("¿Seguro que deseas quitar el acceso a este usuario del sistema?")) return;

    // 1. Sacamos el "gafete" (Token) que guardamos al hacer Login
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/usuario/${idUsuario}`, {
        method: "DELETE",
        headers: {
          // 2. Se lo mostramos al guardia del Backend usando el formato Bearer
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (res.ok) {
        alert("Usuario eliminado correctamente.");
        router.refresh(); // Recargamos la tabla
      } else {
        // Si el backend nos rechaza (por ejemplo, si un EDITOR intenta borrar)
        const errorData = await res.json();
        alert(`⚠️ Acceso Denegado: ${errorData.message || 'No tienes permisos de Administrador.'}`);
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <button 
      onClick={eliminar} 
      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg text-sm font-bold transition-colors"
    >
      Eliminar
    </button>
  );
}