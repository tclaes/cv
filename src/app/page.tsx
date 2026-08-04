import Link from "next/link";
import { getCvData } from "@/lib/cv/data";
import { computeYearsSince, formatRange } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const { profile, experience, projects, certifications } = await getCvData();

  const yearsExperience = computeYearsSince(
    experience[experience.length - 1]?.periodStart ?? "2017-08"
  );
  const publicProjects = projects.filter((p) => p.visibility === "public");
  const topSkills = [
    "Angular",
    "TypeScript",
    "React",
    "RxJS",
    "Svelte",
    "Design Systems",
    "Accessibility (WCAG)",
    "Nx Monorepo",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="flex flex-col gap-6 py-16 sm:py-24">
        <Badge variant="secondary" className="w-fit">
          {profile.contact.location} · Actief op zoek naar een volgende uitdaging
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {profile.name}
        </h1>
        <p className="text-xl text-muted-foreground">{profile.headline}</p>
        <p className="max-w-2xl text-muted-foreground">{profile.summary}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/cv" className={buttonVariants({ size: "lg" })}>
            Bekijk CV
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Neem contact op
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 pb-16 sm:grid-cols-4">
        {[
          { label: "Jaar ervaring", value: `${yearsExperience}+` },
          { label: "Projecten", value: `${publicProjects.length}` },
          { label: "Certificaten", value: `${certifications.length}` },
          { label: "Talen", value: `${profile.languages.length}` },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-semibold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="pb-16">
        <h2 className="mb-4 text-lg font-medium">Kernvaardigheden</h2>
        <div className="flex flex-wrap gap-2">
          {topSkills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recente projecten</h2>
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
            Alle projecten →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {publicProjects.slice(0, 3).map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="text-base">{project.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {project.employer} · {formatRange(project.periodStart, project.periodEnd)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {project.bullets[0]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
