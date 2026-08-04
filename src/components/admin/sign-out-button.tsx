"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    try {
      const res = await fetch("/api/auth/session", { method: "DELETE" });
      if (!res.ok) {
        toast.error("Uitloggen mislukt. Probeer opnieuw.");
        return;
      }
    } catch {
      toast.error("Uitloggen mislukt. Probeer opnieuw.");
      return;
    }
    await signOut(getClientAuth());
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
      Uitloggen
    </Button>
  );
}
