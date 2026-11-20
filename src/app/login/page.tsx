import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Akses Petugas | Gempolin Kelurahan Gempolsari",
  description: "Portal masuk petugas Kelurahan Gempolsari",
};

export default function LoginPage() {
  return <LoginForm />;
}
