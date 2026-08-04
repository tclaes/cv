import type { CvData } from "@/types/cv";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExperienceTab } from "@/components/admin/experience-tab";
import { ProjectsTab } from "@/components/admin/projects-tab";
import { CertificationsTab } from "@/components/admin/certifications-tab";
import { SkillsTab } from "@/components/admin/skills-tab";

export function ProfileEditor({ data }: { data: CvData }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Profiel</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Beheer werkervaring, projecten, certificaten en vaardigheden.
      </p>

      <Tabs defaultValue="experience" className="mt-6">
        <TabsList>
          <TabsTrigger value="experience">Ervaring</TabsTrigger>
          <TabsTrigger value="projects">Projecten</TabsTrigger>
          <TabsTrigger value="certifications">Certificaten</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="experience">
          <ExperienceTab jobs={data.experience} />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsTab projects={data.projects} />
        </TabsContent>
        <TabsContent value="certifications">
          <CertificationsTab certifications={data.certifications} />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsTab skills={data.skills} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
