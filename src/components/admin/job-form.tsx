"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Job } from "@/types/cv";
import { jobFormSchema, parseBullets, parseCsv, type JobFormValues } from "@/lib/cv/schemas";
import { saveJob } from "@/lib/cv/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function toFormValues(job?: Job): JobFormValues {
  if (!job) {
    return {
      title: "",
      company: "",
      location: "",
      periodStart: "",
      periodEnd: "",
      bullets: "",
      skills: "",
    };
  }
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location ?? "",
    periodStart: job.periodStart,
    periodEnd: job.periodEnd,
    bullets: job.bullets.join("\n"),
    skills: job.skills.join(", "),
  };
}

export function JobForm({ job, onSaved }: { job?: Job; onSaved: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: toFormValues(job),
  });

  async function onSubmit(values: JobFormValues) {
    try {
      const result = await saveJob({
        ...values,
        id: job?.id,
        bullets: parseBullets(values.bullets),
        skills: parseCsv(values.skills),
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Werkervaring opgeslagen");
      onSaved();
    } catch {
      toast.error("Opslaan mislukt");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Functietitel</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Bedrijf</Label>
          <Input id="company" {...register("company")} />
          {errors.company && (
            <p className="text-xs text-destructive">{errors.company.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="location">Locatie</Label>
          <Input id="location" {...register("location")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="periodStart">Start (YYYY-MM)</Label>
          <Input id="periodStart" placeholder="2021-08" {...register("periodStart")} />
          {errors.periodStart && (
            <p className="text-xs text-destructive">{errors.periodStart.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="periodEnd">Einde (YYYY-MM of &quot;heden&quot;)</Label>
          <Input id="periodEnd" placeholder="heden" {...register("periodEnd")} />
          {errors.periodEnd && (
            <p className="text-xs text-destructive">{errors.periodEnd.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bullets">Bullets (één per regel)</Label>
        <Textarea id="bullets" rows={5} {...register("bullets")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="skills">Skills (komma-gescheiden)</Label>
        <Input id="skills" {...register("skills")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Bezig..." : "Opslaan"}
      </Button>
    </form>
  );
}
