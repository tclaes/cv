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
    // Best-effort: the server session is already gone, so don't let a client-side
    // Firebase cleanup failure block the redirect.
    await signOut(getClientAuth()).catch(() => {});
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
      Uitloggen
    </Button>
  );
}
