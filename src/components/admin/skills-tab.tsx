"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { SkillCategory } from "@/types/cv";
import { deleteSkillCategory } from "@/lib/cv/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkillCategoryForm } from "@/components/admin/skill-category-form";
import { FormDialog } from "@/components/admin/form-dialog";

export function SkillsTab({ skills }: { skills: SkillCategory[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Deze categorie verwijderen?")) return;
    try {
      const result = await deleteSkillCategory(id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Verwijderd");
      router.refresh();
    } catch {
      toast.error("Verwijderen mislukt");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <FormDialog
        trigger={<Button variant="outline">+ Nieuwe categorie</Button>}
        title="+ Nieuwe categorie"
        id="new"
        open={open}
        setOpen={setOpen}
      >
        <SkillCategoryForm onSaved={() => { setOpen(null); router.refresh(); }} />
      </FormDialog>

      {skills.map((group) => (
        <Card key={group.id}>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium">{group.category}</p>
              <p className="text-xs text-muted-foreground">{group.items.join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <FormDialog
                trigger={<Button size="sm">Bewerk</Button>}
                title="Bewerken"
                id={group.id}
                open={open}
                setOpen={setOpen}
              >
                <SkillCategoryForm
                  group={group}
                  onSaved={() => { setOpen(null); router.refresh(); }}
                />
              </FormDialog>
              <Button variant="outline" size="sm" onClick={() => handleDelete(group.id)}>
                Verwijder
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
