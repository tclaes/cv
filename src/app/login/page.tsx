"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getClientAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <Card>
          <CardHeader>
            <CardTitle>Firebase niet geconfigureerd</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Stel de <code>NEXT_PUBLIC_FIREBASE_*</code> en{" "}
            <code>FIREBASE_SERVICE_ACCOUNT_KEY</code> env vars in (zie{" "}
            <code>.env.example</code>) om in te loggen op het admin-gedeelte.
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    let signedIn = false;
    try {
      const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
      signedIn = true;
      const idToken = await credential.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        await signOut(getClientAuth()).catch(() => {});
        setError(
          res.status === 401
            ? "Niet geautoriseerd voor het admin-gedeelte."
            : "Er ging iets mis bij het aanmelden. Probeer opnieuw."
        );
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      if (signedIn) {
        await signOut(getClientAuth()).catch(() => {});
      }
      setError("Inloggen mislukt. Controleer je e-mail en wachtwoord.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <Card>
        <CardHeader>
          <CardTitle>Inloggen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Bezig..." : "Inloggen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
