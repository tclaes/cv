"use client";

import type { Project } from "@/types/cv";
import { deleteProject } from "@/lib/cv/actions";
import { Badge } from "@/components/ui/badge";
import { EntityTab } from "@/components/admin/entity-tab";
import { ProjectForm } from "@/components/admin/project-form";

export function ProjectsTab({ projects }: { projects: Project[] }) {
  return (
    <EntityTab
      items={projects}
      getKey={(project) => project.id}
      addLabel="+ Nieuw project"
      confirmText="Dit project verwijderen?"
      onDelete={deleteProject}
      renderSummary={(project) => (
        <>
          <p className="flex items-center gap-2 text-sm font-medium">
            {project.title}
            {project.visibility === "private" && (
              <Badge variant="secondary" className="text-xs">
                Privé
              </Badge>
            )}
          </p>
          <p className="text-xs text-muted-foreground">{project.employer}</p>
        </>
      )}
      renderForm={(project, onSaved) => <ProjectForm project={project} onSaved={onSaved} />}
    />
  );
}
