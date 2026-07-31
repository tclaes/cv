"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { SkillCategory } from "@/types/cv";
import { deleteSkillCategory } from "@/lib/cv/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkillCategoryForm } from "@/components/admin/skill-category-form";
import { AddButton } from "@/components/admin/add-button";
import { EditButton } from "@/components/admin/edit-button";

export function SkillsTab({ skills }: { skills: SkillCategory[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  async function handleDelete(category: string) {
    if (!confirm("Deze categorie verwijderen?")) return;
    try {
      await deleteSkillCategory(category);
      toast.success("Verwijderd");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verwijderen mislukt");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <AddButton label="+ Nieuwe categorie" id="new" open={open} setOpen={setOpen}>
        <SkillCategoryForm onSaved={() => { setOpen(null); router.refresh(); }} />
      </AddButton>

      {skills.map((group) => (
        <Card key={group.category}>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium">{group.category}</p>
              <p className="text-xs text-muted-foreground">{group.items.join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <EditButton id={group.category} open={open} setOpen={setOpen}>
                <SkillCategoryForm
                  group={group}
                  onSaved={() => { setOpen(null); router.refresh(); }}
                />
              </EditButton>
              <Button variant="outline" size="sm" onClick={() => handleDelete(group.category)}>
                Verwijder
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
