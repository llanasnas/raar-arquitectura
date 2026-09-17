import { redirect } from "next/navigation";

// La propuesta C es la portada desde el 17/09/2026: esta ruta solo conserva el enlace.
export default function HomeCPage() {
  redirect("/");
}
