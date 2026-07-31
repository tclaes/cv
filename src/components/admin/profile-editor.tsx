"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CvData, Job, Project, Certification, SkillCategory } from "@/types/cv";
import { deleteJob, deleteProject, deleteCertification, deleteSkillCategory } from "@/lib/cv/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JobForm } from "@/components/admin/job-form";
import { ProjectForm } from "@/components/admin/project-form";
import { CertificationForm } from "@/components/admin/certification-form";
import { SkillCategoryForm } from "@/components/admin/skill-category-form";

export function ProfileEditor({ data }: { data: CvData }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Profiel</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Beheer werkervaring, projecten, certificaten en vaardigheden.
      </p>

      <Tabs defaultValue="experience" className="mt-6">
        <TabsList>
          <TabsTrigger value="experience">Ervaring</TabsTrigger>
          <TabsTrigger value="projects">Projecten</TabsTrigger>
          <TabsTrigger value="certifications">Certificaten</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="experience">
          <ExperienceTab jobs={data.experience} />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsTab projects={data.projects} />
        </TabsContent>
        <TabsContent value="certifications">
          <CertificationsTab certifications={data.certifications} />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsTab skills={data.skills} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ExperienceTab({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Deze werkervaring verwijderen?")) return;
    try {
      await deleteJob(id);
      toast.success("Verwijderd");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verwijderen mislukt");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <AddButton label="+ Nieuwe werkervaring" id="new" open={open} setOpen={setOpen}>
        <JobForm onSaved={() => { setOpen(null); router.refresh(); }} />
      </AddButton>

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
              <EditButton id={job.id} open={open} setOpen={setOpen}>
                <JobForm job={job} onSaved={() => { setOpen(null); router.refresh(); }} />
              </EditButton>
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

function ProjectsTab({ projects }: { projects: Project[] }) {
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

function CertificationsTab({ certifications }: { certifications: Certification[] }) {
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

function SkillsTab({ skills }: { skills: SkillCategory[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  async function handleDelete(category: string) {
    if (!confirm("Deze categorie verwijderen?")) return;
    try {
      await deleteSkillCategory(category);
      toast.success("Verwijderd");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verwijderen mislukt");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <AddButton label="+ Nieuwe categorie" id="new" open={open} setOpen={setOpen}>
        <SkillCategoryForm onSaved={() => { setOpen(null); router.refresh(); }} />
      </AddButton>

      {skills.map((group) => (
        <Card key={group.category}>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium">{group.category}</p>
              <p className="text-xs text-muted-foreground">{group.items.join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <EditButton id={group.category} open={open} setOpen={setOpen}>
                <SkillCategoryForm
                  group={group}
                  onSaved={() => { setOpen(null); router.refresh(); }}
                />
              </EditButton>
              <Button variant="outline" size="sm" onClick={() => handleDelete(group.category)}>
                Verwijder
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AddButton({
  label,
  id,
  open,
  setOpen,
  children,
}: {
  label: string;
  id: string;
  open: string | null;
  setOpen: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open === id} onOpenChange={(next) => setOpen(next ? id : null)}>
      <DialogTrigger render={<Button variant="outline">{label}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function EditButton({
  id,
  open,
  setOpen,
  children,
}: {
  id: string;
  open: string | null;
  setOpen: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open === id} onOpenChange={(next) => setOpen(next ? id : null)}>
      <DialogTrigger render={<Button size="sm">Bewerk</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bewerken</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
