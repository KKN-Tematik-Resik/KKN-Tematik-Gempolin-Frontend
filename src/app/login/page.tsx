import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login Admin | Gempolin Kelurahan Gempolsari",
  description: "Halaman masuk Admin Kelurahan Gempolsari",
};

export default function LoginPage() {
  return <LoginForm />;
}
