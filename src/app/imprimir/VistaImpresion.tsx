"use client";
import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function VistaImpresion({ qrs }: { qrs: any[] }) {
  useEffect(() => {
    // Abre el cuadro de diálogo de impresión automáticamente tras cargar
    setTimeout(() => {
      window.print();
    }, 800);
  }, []);

  return (
    <div className="bg-white text-black min-h-screen p-4">
      
      {/* 🪄 MAGIA CSS PARA IMPRESORA */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 15mm; } /* Forza un margen limpio en la hoja física */
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}} />

      {/* Botones de control (Desaparecen al imprimir) */}
      <div className="no-print flex justify-center gap-4 mb-8 p-4 bg-slate-100 rounded-lg">
        <button 
          onClick={() => window.print()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm"
        >
          🖨️ Volver a Imprimir
        </button>
        <button 
          onClick={() => window.close()} 
          className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-2 px-6 rounded-lg shadow-sm"
        >
          Cerrar Pestaña
        </button>
      </div>

      {/* Grid de impresión (2 columnas perfectas) */}
      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
        {qrs.map((qr) => (
          <div 
            key={qr.id_qr} 
            // break-inside-avoid evita que el cuadro se parta en dos páginas
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-400 rounded-xl text-center"
            style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
          >
            {/* Cabecera */}
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Casa de la Libertad
            </p>
            
            {/* Título de la Pieza */}
            <h3 className="text-lg font-bold text-slate-900 mb-4 min-h-[56px] flex items-center justify-center">
              {qr.objeto?.titulo || "Pieza sin título"}
            </h3>
            
            {/* Código QR */}
            <div className="mb-4 bg-white p-2">
              <QRCodeSVG value={qr.codigo} size={180} />
            </div>
            
            {/* Código en texto */}
            <p className="text-sm font-mono font-bold text-slate-800 bg-slate-100 px-4 py-1 rounded">
              {qr.codigo}
            </p>
          </div>
        ))}
      </div>
      
    </div>
  );
}