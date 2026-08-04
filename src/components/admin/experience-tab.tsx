"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Job } from "@/types/cv";
import { deleteJob } from "@/lib/cv/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobForm } from "@/components/admin/job-form";
import { FormDialog } from "@/components/admin/form-dialog";

export function ExperienceTab({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Deze werkervaring verwijderen?")) return;
    try {
      const result = await deleteJob(id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Verwijderd");
      router.refresh();
    } catch {
      toast.error("Verwijderen mislukt");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <FormDialog
        trigger={<Button variant="outline">+ Nieuwe werkervaring</Button>}
        title="+ Nieuwe werkervaring"
        id="new"
        open={open}
        setOpen={setOpen}
      >
        <JobForm onSaved={() => { setOpen(null); router.refresh(); }} />
      </FormDialog>

      {jobs.map((job) => (
        <Card key={job.id}>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium">
                {job.title} — {job.company}
              </p>
              <p className="text-xs text-muted-foreground">
                {job.periodStart}–{job.periodEnd}
              </p>
            </div>
            <div className="flex gap-2">
              <FormDialog
                trigger={<Button size="sm">Bewerk</Button>}
                title="Bewerken"
                id={job.id}
                open={open}
                setOpen={setOpen}
              >
                <JobForm job={job} onSaved={() => { setOpen(null); router.refresh(); }} />
              </FormDialog>
              <Button variant="outline" size="sm" onClick={() => handleDelete(job.id)}>
                Verwijder
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
