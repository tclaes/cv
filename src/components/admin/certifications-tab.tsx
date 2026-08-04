"use client";

import type { Certification } from "@/types/cv";
import { deleteCertification } from "@/lib/cv/actions";
import { EntityTab } from "@/components/admin/entity-tab";
import { CertificationForm } from "@/components/admin/certification-form";

export function CertificationsTab({ certifications }: { certifications: Certification[] }) {
  return (
    <EntityTab
      items={certifications}
      getKey={(cert) => cert.id}
      addLabel="+ Nieuw certificaat"
      confirmText="Dit certificaat verwijderen?"
      onDelete={deleteCertification}
      renderSummary={(cert) => (
        <>
          <p className="text-sm font-medium">{cert.title}</p>
          <p className="text-xs text-muted-foreground">
            {cert.issuer} · {cert.date}
          </p>
        </>
      )}
      renderForm={(cert, onSaved) => (
        <CertificationForm certification={cert} onSaved={onSaved} />
      )}
    />
  );
}
