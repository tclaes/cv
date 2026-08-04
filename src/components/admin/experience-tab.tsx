"use client";

import type { Job } from "@/types/cv";
import { deleteJob } from "@/lib/cv/actions";
import { EntityTab } from "@/components/admin/entity-tab";
import { JobForm } from "@/components/admin/job-form";

export function ExperienceTab({ jobs }: { jobs: Job[] }) {
  return (
    <EntityTab
      items={jobs}
      getKey={(job) => job.id}
      addLabel="+ Nieuwe werkervaring"
      confirmText="Deze werkervaring verwijderen?"
      onDelete={deleteJob}
      renderSummary={(job) => (
        <>
          <p className="text-sm font-medium">
            {job.title} — {job.company}
          </p>
          <p className="text-xs text-muted-foreground">
            {job.periodStart}–{job.periodEnd}
          </p>
        </>
      )}
      renderForm={(job, onSaved) => <JobForm job={job} onSaved={onSaved} />}
    />
  );
}
