import Link from "next/link";
import TablaObjetos from "./TablaObjetos"; // 👈 Asegúrate de que la ruta sea la correcta según dónde lo guardaste

export default async function ObjetosPage() {
  // Pedimos todos los objetos al backend (gracias a Prisma, esto ya incluye los datos de la sala)
  const respuesta = await fetch('http://localhost:3001/objeto', { cache: 'no-store' });
  const objetos = await respuesta.json();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Piezas y Objetos</h2>
        <Link 
          href="/dashboard/objetos/nuevo" 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          + Registrar Objeto
        </Link>
      </div>
      <TablaObjetos objetos={objetos} />
      
    </div>
  );
}