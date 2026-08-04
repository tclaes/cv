import { getCvData } from "@/lib/cv/data";
import { formatRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";

export default async function CvPage() {
  const data = await getCvData();
  const { profile, experience, earlierExperience, education, certifications, skills } = data;
  const publicProjects = data.projects.filter((p) => p.visibility === "public");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 print:py-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.headline}</p>
        </div>
        <a href="/api/cv/pdf" download className={buttonVariants({ className: "print:hidden" })}>
          <Download className="mr-2 size-4" />
          Download PDF
        </a>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        {profile.contact.location} · {profile.contact.email}
      </p>

      <Separator className="my-8" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Professionele samenvatting
        </h2>
        <p className="mt-3 text-sm leading-relaxed">{profile.summary}</p>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Werkervaring
        </h2>
        <div className="mt-4 space-y-8">
          {experience.map((job) => (
            <div key={job.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-medium">
                  {job.title} — {job.company}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {formatRange(job.periodStart, job.periodEnd)}
                </span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Eerdere ervaring
        </h2>
        <ul className="mt-4 space-y-1 text-sm">
          {earlierExperience.map((role) => (
            <li key={role.id} className="flex justify-between">
              <span>{role.title}</span>
              <span className="text-muted-foreground">{role.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Relevante projecten
        </h2>
        <div className="mt-4 space-y-5">
          {publicProjects.map((project) => (
            <div key={project.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-medium">
                  {project.title} — {project.employer}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {formatRange(project.periodStart, project.periodEnd)}
                </span>
              </div>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Opleiding &amp; certificaten
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          {education.map((item) => (
            <li key={item.id}>
              <span className="font-medium">{item.title}</span> — {item.institution} (
              {item.period})
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          + {certifications.length} certificaten, zie{" "}
          <a href="/certifications" className="underline">
            volledig overzicht
          </a>
          .
        </p>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Kernvaardigheden
        </h2>
        <div className="mt-4 space-y-3">
          {skills.map((group) => (
            <div key={group.id}>
              <p className="text-xs font-medium text-muted-foreground">{group.category}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Badge key={item} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Talen
        </h2>
        <ul className="mt-4 space-y-1 text-sm">
          {profile.languages.map((lang) => (
            <li key={lang.language} className="flex justify-between">
              <span>{lang.language}</span>
              <span className="text-muted-foreground">{lang.level}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
