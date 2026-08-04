import { notFound } from "next/navigation";
import { getCvVariant } from "@/lib/cv/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const statusLabel: Record<string, string> = {
  strong: "Sterk",
  partial: "Deels",
  missing: "Ontbreekt",
};

export default async function CvVariantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const variant = await getCvVariant(id);
  if (!variant) notFound();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {variant.jobTitle} — {variant.company}
          </h1>
          {variant.vacancyUrl && (
            <a
              href={variant.vacancyUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              {variant.vacancyUrl}
            </a>
          )}
        </div>
        <Badge className="text-base">{variant.atsScore}/100</Badge>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Getailorde samenvatting</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {variant.sections.tailoredSummary}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm">Top skills voor deze vacature</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {variant.sections.tailoredSkills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm">ATS-rapport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            {variant.atsReport.map((match) => (
              <div
                key={match.keyword}
                className="flex items-center justify-between border-b py-1.5 text-sm last:border-0"
              >
                <span>{match.keyword}</span>
                <div className="flex items-center gap-2">
                  {match.foundIn && (
                    <span className="text-xs text-muted-foreground">{match.foundIn}</span>
                  )}
                  <Badge
                    variant={
                      match.status === "strong"
                        ? "default"
                        : match.status === "partial"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {statusLabel[match.status] ?? match.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm">Motivatiemail</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
            {variant.motivationEmail}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
