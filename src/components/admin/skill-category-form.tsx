"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { SkillCategory } from "@/types/cv";
import { skillCategoryFormSchema, parseCsv, type SkillCategoryFormValues } from "@/lib/cv/schemas";
import { saveSkillCategory } from "@/lib/cv/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function toFormValues(group?: SkillCategory): SkillCategoryFormValues {
  if (!group) return { category: "", items: "" };
  return { id: group.id, category: group.category, items: group.items.join(", ") };
}

export function SkillCategoryForm({
  group,
  onSaved,
}: {
  group?: SkillCategory;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SkillCategoryFormValues>({
    resolver: zodResolver(skillCategoryFormSchema),
    defaultValues: toFormValues(group),
  });

  async function onSubmit(values: SkillCategoryFormValues) {
    try {
      const result = await saveSkillCategory({
        id: group?.id,
        category: values.category,
        items: parseCsv(values.items),
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Vaardighedencategorie opgeslagen");
      onSaved();
    } catch {
      toast.error("Opslaan mislukt");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="category">Categorie</Label>
        <Input id="category" {...register("category")} />
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="items">Vaardigheden (komma-gescheiden)</Label>
        <Input id="items" {...register("items")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Bezig..." : "Opslaan"}
      </Button>
    </form>
  );
}
