import { getPublicProjects } from "@/lib/cv/data";
import { formatRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Projecten</h1>
      <p className="mt-2 text-muted-foreground">
        Een overzicht van projecten waar ik aan heb bijgedragen.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="text-base">{project.title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {project.employer}
                {formatRange(project.periodStart, project.periodEnd) &&
                  ` · ${formatRange(project.periodStart, project.periodEnd)}`}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
