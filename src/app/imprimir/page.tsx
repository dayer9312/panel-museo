import VistaImpresion from "./VistaImpresion";

export default async function ImprimirTodosPage() {
  // Solicitamos todos los códigos QR al backend
  const respuesta = await fetch('http://localhost:3001/codigo-qr', { cache: 'no-store' });
  const qrs = await respuesta.json();

  return <VistaImpresion qrs={qrs} />;
}