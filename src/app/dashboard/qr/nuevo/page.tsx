"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoQrPage() {
  const router = useRouter();
  const [objetos, setObjetos] = useState<any[]>([]);
  const [codigo, setCodigo] = useState("");
  const [idObjeto, setIdObjeto] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/objeto").then(res => res.json()).then(data => {
      setObjetos(data);
      if (data.length > 0) setIdObjeto(data[0].id_objeto.toString());
    });
  }, []);

  const guardarQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const res = await fetch("http://localhost:3000/codigo-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, id_objeto: Number(idObjeto), estado: "ACTIVO" }),
      });
      // ... dentro de la función guardarQR
    if (res.ok) {
    router.push("/dashboard/qr");
    router.refresh();
    } else {
    // ESTO TE DIRÁ EXACTAMENTE QUÉ PASÓ EN EL BACKEND
    const errorServer = await res.json();
    console.error(errorServer);
    alert("⚠️ Error del servidor:\n" + JSON.stringify(errorServer.message || errorServer, null, 2));
    }
    } catch (error) { alert("Error al conectar."); }
    setGuardando(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Nuevo Identificador QR</h2>
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <form onSubmit={guardarQR} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Identificador Único</label>
            <input type="text" required className="w-full px-4 py-2 border rounded-lg" placeholder="Ej: QR-ACTA-1825" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Asociar a Objeto</label>
            <select className="w-full px-4 py-2 border rounded-lg" value={idObjeto} onChange={(e) => setIdObjeto(e.target.value)}>
              {objetos.map(obj => <option key={obj.id_objeto} value={obj.id_objeto}>{obj.titulo}</option>)}
            </select>
          </div>
          <button type="submit" disabled={guardando} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">
            {guardando ? "Generando..." : "Crear Registro QR"}
          </button>
        </form>
      </div>
    </div>
  );
}