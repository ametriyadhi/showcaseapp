import { getSystemSettings } from "@/lib/settings";
import { LoginForm } from "./login-form";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettings();
  return {
    title: `Login | ${settings.appName}`,
    description: settings.appDescription,
  };
}

export default async function LoginPage() {
  const settings = await getSystemSettings();

  return (
    <LoginForm 
      appName={settings.appName} 
      appLogo={settings.appLogo} 
      appDescription={settings.appDescription} 
    />
  );
}
