"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Certification } from "@/types/cv";
import { certificationFormSchema, type CertificationFormValues } from "@/lib/cv/schemas";
import { saveCertification } from "@/lib/cv/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function toFormValues(cert?: Certification): CertificationFormValues {
  if (!cert) return { title: "", issuer: "", date: "", credentialUrl: "" };
  return {
    id: cert.id,
    title: cert.title,
    issuer: cert.issuer,
    date: cert.date,
    credentialUrl: cert.credentialUrl ?? "",
  };
}

export function CertificationForm({
  certification,
  onSaved,
}: {
  certification?: Certification;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues: toFormValues(certification),
  });

  async function onSubmit(values: CertificationFormValues) {
    try {
      const result = await saveCertification({ ...values, id: certification?.id });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Certificaat opgeslagen");
      onSaved();
    } catch {
      toast.error("Opslaan mislukt");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Titel</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="issuer">Uitgever</Label>
          <Input id="issuer" {...register("issuer")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="date">Datum (YYYY-MM)</Label>
          <Input id="date" {...register("date")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="credentialUrl">Credential URL (optioneel)</Label>
        <Input id="credentialUrl" {...register("credentialUrl")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Bezig..." : "Opslaan"}
      </Button>
    </form>
  );
}
