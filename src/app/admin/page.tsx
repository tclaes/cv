import { getCvData } from "@/lib/cv/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const { experience, projects, certifications } = await getCvData();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Beheer je profiel en genereer getailorde CV&apos;s per vacature.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Werkervaring</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{experience.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Projecten</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{projects.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Certificaten</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{certifications.length}</CardContent>
        </Card>
      </div>
    </div>
  );
}
