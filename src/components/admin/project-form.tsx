"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Project } from "@/types/cv";
import {
  projectFormSchema,
  parseBullets,
  parseCsv,
  type ProjectFormValues,
} from "@/lib/cv/schemas";
import { saveProject } from "@/lib/cv/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function toFormValues(project?: Project): ProjectFormValues {
  if (!project) {
    return {
      title: "",
      employer: "",
      periodStart: "",
      periodEnd: "",
      bullets: "",
      tech: "",
      visibility: "public",
    };
  }
  return {
    id: project.id,
    title: project.title,
    employer: project.employer,
    periodStart: project.periodStart,
    periodEnd: project.periodEnd,
    bullets: project.bullets.join("\n"),
    tech: project.tech.join(", "),
    visibility: project.visibility,
  };
}

export function ProjectForm({ project, onSaved }: { project?: Project; onSaved: () => void }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: toFormValues(project),
  });

  async function onSubmit(values: ProjectFormValues) {
    try {
      const result = await saveProject({
        ...values,
        id: project?.id,
        bullets: parseBullets(values.bullets),
        tech: parseCsv(values.tech),
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Project opgeslagen");
      onSaved();
    } catch {
      toast.error("Opslaan mislukt");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Projectnaam</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="employer">Opdrachtgever</Label>
          <Input id="employer" {...register("employer")} />
          {errors.employer && (
            <p className="text-xs text-destructive">{errors.employer.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="periodStart">Start (YYYY-MM)</Label>
          <Input id="periodStart" {...register("periodStart")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="periodEnd">Einde</Label>
          <Input id="periodEnd" {...register("periodEnd")} />
        </div>
        <div className="space-y-1.5">
          <Label>Zichtbaarheid</Label>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue>
                    {(value: string) => (value === "private" ? "Privé" : "Publiek")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Publiek</SelectItem>
                  <SelectItem value="private">Privé</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bullets">Bullets (één per regel)</Label>
        <Textarea id="bullets" rows={4} {...register("bullets")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tech">Tech stack (komma-gescheiden)</Label>
        <Input id="tech" {...register("tech")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Bezig..." : "Opslaan"}
      </Button>
    </form>
  );
}
