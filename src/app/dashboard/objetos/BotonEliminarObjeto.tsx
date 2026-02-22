"use client";
import { useRouter } from "next/navigation";

export default function BotonEliminarObjeto({ idObjeto }: { idObjeto: number }) {
  const router = useRouter();

  const eliminarObjeto = async () => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta pieza del museo?");
    if (confirmacion) {
      try {
        const respuesta = await fetch(`http://localhost:3000/objeto/${idObjeto}`, { method: "DELETE" });
        if (respuesta.ok) {
          router.refresh();
        } else {
          alert("Error al eliminar el objeto.");
        }
      } catch (error) {
        alert("Error de conexión.");
      }
    }
  };

  return (
    <button onClick={eliminarObjeto} className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors cursor-pointer">
      Eliminar
    </button>
  );
}