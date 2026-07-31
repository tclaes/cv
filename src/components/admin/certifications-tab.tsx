"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Certification } from "@/types/cv";
import { deleteCertification } from "@/lib/cv/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CertificationForm } from "@/components/admin/certification-form";
import { AddButton } from "@/components/admin/add-button";
import { EditButton } from "@/components/admin/edit-button";

export function CertificationsTab({ certifications }: { certifications: Certification[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Dit certificaat verwijderen?")) return;
    try {
      await deleteCertification(id);
      toast.success("Verwijderd");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verwijderen mislukt");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <AddButton label="+ Nieuw certificaat" id="new" open={open} setOpen={setOpen}>
        <CertificationForm onSaved={() => { setOpen(null); router.refresh(); }} />
      </AddButton>

      {certifications.map((cert) => (
        <Card key={cert.id}>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium">{cert.title}</p>
              <p className="text-xs text-muted-foreground">
                {cert.issuer} · {cert.date}
              </p>
            </div>
            <div className="flex gap-2">
              <EditButton id={cert.id} open={open} setOpen={setOpen}>
                <CertificationForm
                  certification={cert}
                  onSaved={() => { setOpen(null); router.refresh(); }}
                />
              </EditButton>
              <Button variant="outline" size="sm" onClick={() => handleDelete(cert.id)}>
                Verwijder
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
