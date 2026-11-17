import type { Metadata } from "next";
import SignInForm from "./sign-in-form";

export const metadata: Metadata = {
  title: "Login Admin | Gempolin Kelurahan Gempolsari",
  description: "Login Admin Kelurahan Gempolsari",
};

export default function SignInPage() {
  return <SignInForm />;
}
