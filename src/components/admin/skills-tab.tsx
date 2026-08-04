"use client";

import type { SkillCategory } from "@/types/cv";
import { deleteSkillCategory } from "@/lib/cv/actions";
import { EntityTab } from "@/components/admin/entity-tab";
import { SkillCategoryForm } from "@/components/admin/skill-category-form";

export function SkillsTab({ skills }: { skills: SkillCategory[] }) {
  return (
    <EntityTab
      items={skills}
      getKey={(group) => group.id}
      addLabel="+ Nieuwe categorie"
      confirmText="Deze categorie verwijderen?"
      onDelete={deleteSkillCategory}
      renderSummary={(group) => (
        <>
          <p className="text-sm font-medium">{group.category}</p>
          <p className="text-xs text-muted-foreground">{group.items.join(", ")}</p>
        </>
      )}
      renderForm={(group, onSaved) => <SkillCategoryForm group={group} onSaved={onSaved} />}
    />
  );
}
