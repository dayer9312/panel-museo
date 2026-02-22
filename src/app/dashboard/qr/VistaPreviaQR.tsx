"use client";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function VistaPreviaQR({ valor, titulo }: { valor: string; titulo: string }) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <>
      <button onClick={() => setMostrar(true)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
        Ver/Imprimir QR
      </button>

      {mostrar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <h3 className="text-xl font-bold mb-2">{titulo}</h3>
            <p className="text-slate-500 mb-6 font-mono text-sm">{valor}</p>
            
            <div className="bg-white p-4 border-4 border-slate-100 rounded-xl inline-block mb-6">
              <QRCodeSVG value={valor} size={200} />
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => window.print()} className="bg-blue-600 text-white font-bold py-2 rounded-lg">
                Imprimir QR
              </button>
              <button onClick={() => setMostrar(false)} className="text-slate-500 hover:text-slate-800 font-medium">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}