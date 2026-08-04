"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateCvVariant } from "@/lib/cv/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function GenerateForm() {
  const router = useRouter();
  const [vacancyUrl, setVacancyUrl] = useState("");
  const [vacancyText, setVacancyText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const { id } = await generateCvVariant({ vacancyUrl, vacancyText });
      toast.success("CV getailored");
      router.push(`/admin/variants/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Genereren mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="vacancyUrl">Vacature-URL</Label>
            <Input
              id="vacancyUrl"
              placeholder="https://..."
              value={vacancyUrl}
              onChange={(e) => setVacancyUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vacancyText">Of plak de vacaturetekst</Label>
            <Textarea
              id="vacancyText"
              rows={8}
              placeholder="Plak hier de volledige vacaturetekst als de URL niet werkt (bv. achter een login)."
              value={vacancyText}
              onChange={(e) => setVacancyText(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Bezig met genereren..." : "Genereer getailorde CV"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
