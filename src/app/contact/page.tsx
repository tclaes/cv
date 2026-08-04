import { getCvData } from "@/lib/cv/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function ContactPage() {
  const { profile } = await getCvData();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-muted-foreground">
        Op zoek naar een front-end engineer of architect? Laten we praten.
      </p>

      <Card className="mt-10">
        <CardContent className="space-y-4 py-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">E-mail</span>
            <a
              className="text-sm font-medium hover:underline"
              href={`mailto:${profile.contact.email}`}
            >
              {profile.contact.email}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Locatie</span>
            <span className="text-sm font-medium">{profile.contact.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">LinkedIn</span>
            <a
              className="text-sm font-medium hover:underline"
              href={profile.contact.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              {profile.contact.linkedin.replace("https://", "")}
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Button
          nativeButton={false}
          render={<a href={`mailto:${profile.contact.email}`}>Stuur een e-mail</a>}
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
              Bekijk LinkedIn
            </a>
          }
        />
      </div>
    </div>
  );
}
