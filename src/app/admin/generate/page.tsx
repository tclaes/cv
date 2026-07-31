import Link from "next/link";
import { getCvVariants } from "@/lib/cv/data";
import { GenerateForm } from "@/components/admin/generate-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function GenerateCvPage() {
  const variants = await getCvVariants();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">CV genereren</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Plak een vacature-URL of -tekst; Gemini tailort je samenvatting, skills, ATS-score en
        motivatiemail.
      </p>

      <div className="mt-6">
        <GenerateForm />
      </div>

      {variants.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Eerder gegenereerd</h2>
          <div className="space-y-2">
            {variants.map((variant) => (
              <Link key={variant.id} href={`/admin/variants/${variant.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium">
                        {variant.jobTitle} — {variant.company}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(variant.createdAt).toLocaleDateString("nl-BE")}
                      </p>
                    </div>
                    <Badge variant="outline">{variant.atsScore}/100</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
