import { redirect } from "next/navigation";

export default function Home() {
  // straight to dashboard
  redirect("/dashboard");
}
