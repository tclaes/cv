"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Project } from "@/types/cv";
import { deleteProject } from "@/lib/cv/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/components/admin/project-form";
import { AddButton } from "@/components/admin/add-button";
import { EditButton } from "@/components/admin/edit-button";

export function ProjectsTab({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Dit project verwijderen?")) return;
    try {
      await deleteProject(id);
      toast.success("Verwijderd");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verwijderen mislukt");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <AddButton label="+ Nieuw project" id="new" open={open} setOpen={setOpen}>
        <ProjectForm onSaved={() => { setOpen(null); router.refresh(); }} />
      </AddButton>

      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                {project.title}
                {project.visibility === "private" && (
                  <Badge variant="secondary" className="text-xs">
                    Privé
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground">{project.employer}</p>
            </div>
            <div className="flex gap-2">
              <EditButton id={project.id} open={open} setOpen={setOpen}>
                <ProjectForm
                  project={project}
                  onSaved={() => { setOpen(null); router.refresh(); }}
                />
              </EditButton>
              <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
                Verwijder
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
