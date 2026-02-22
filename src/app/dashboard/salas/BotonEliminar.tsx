"use client";
import { useRouter } from "next/navigation";

export default function BotonEliminar({ idSala }: { idSala: number }) {
  const router = useRouter();

  const eliminarSala = async () => {
    // 1. Pedimos confirmación para evitar accidentes
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta sala? Esta acción no se puede deshacer.");
    
    if (confirmacion) {
      try {
        // 2. Disparamos el DELETE a tu backend
        const respuesta = await fetch(`http://localhost:3000/sala/${idSala}`, {
          method: "DELETE",
        });

        if (respuesta.ok) {
          // 3. Refrescamos la página mágicamente
          router.refresh();
        } else {
          alert("Hubo un error al eliminar la sala.");
        }
      } catch (error) {
        alert("Error de conexión con el servidor.");
      }
    }
  };

  return (
    <button 
      onClick={eliminarSala}
      className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors cursor-pointer"
    >
      Eliminar
    </button>
  );
}