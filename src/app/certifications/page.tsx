import { getCvData } from "@/lib/cv/data";
import { formatPeriod } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

export default async function CertificationsPage() {
  const { certifications } = await getCvData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Certificaten</h1>
      <p className="mt-2 text-muted-foreground">
        {certifications.length} certificaten en cursussen, gesynct vanuit LinkedIn.
      </p>

      <div className="mt-10 space-y-3">
        {certifications.map((cert) => (
          <Card key={cert.id}>
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium">{cert.title}</p>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              </div>
              {cert.date && (
                <p className="shrink-0 text-sm text-muted-foreground">
                  {formatPeriod(cert.date)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
