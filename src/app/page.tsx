import { redirect } from "next/navigation";

export default function RootPage() {
  // Ahora la puerta principal de la app te manda al login primero
  redirect("/login");
}