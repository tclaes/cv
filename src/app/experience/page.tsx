import { getCvData } from "@/lib/cv/data";
import { formatRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function ExperiencePage() {
  const { experience, earlierExperience, education } = await getCvData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Werkervaring</h1>

      <div className="mt-10 space-y-12">
        {experience.map((job) => (
          <article key={job.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-medium">
                {job.title} — {job.company}
              </h2>
              <p className="text-sm text-muted-foreground">
                {formatRange(job.periodStart, job.periodEnd)}
              </p>
            </div>
            {job.location && (
              <p className="text-sm text-muted-foreground">{job.location}</p>
            )}
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </article>
        ))}
      </div>

      <Separator className="my-12" />

      <section>
        <h2 className="text-lg font-medium">Eerdere ervaring</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {earlierExperience.map((role) => (
            <li key={role.id} className="flex justify-between gap-4">
              <span>{role.title}</span>
              <span>{role.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <Separator className="my-12" />

      <section>
        <h2 className="text-lg font-medium">Opleiding &amp; certificaten</h2>
        <ul className="mt-4 space-y-4">
          {education.map((item) => (
            <li key={item.id}>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.institution} · {item.period}
              </p>
              {item.detail && (
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
