"use client";
import { useRouter } from "next/navigation";

export default function BotonEliminarQR({ idQr }: { idQr: number }) {
  const router = useRouter();

  const eliminar = async () => {
    if (confirm("¿Seguro que deseas eliminar este registro QR?")) {
      try {
        const res = await fetch(`http://localhost:3000/codigo-qr/${idQr}`, {
          method: "DELETE",
        });
        if (res.ok) router.refresh();
      } catch (error) {
        alert("Error al eliminar.");
      }
    }
  };

  return (
    <button onClick={eliminar} className="text-red-600 hover:text-red-800 text-sm font-semibold">
      Eliminar
    </button>
  );
}