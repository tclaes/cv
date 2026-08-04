"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/cv/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/admin/form-dialog";

export function EntityTab<T>({
  items,
  getKey,
  addLabel,
  confirmText,
  onDelete,
  renderSummary,
  renderForm,
}: {
  items: T[];
  getKey: (item: T) => string;
  addLabel: string;
  confirmText: string;
  onDelete: (id: string) => Promise<ActionResult>;
  renderSummary: (item: T) => ReactNode;
  renderForm: (item: T | undefined, onSaved: () => void) => ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  function handleSaved() {
    setOpen(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm(confirmText)) return;
    try {
      const result = await onDelete(id);
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
        trigger={<Button variant="outline">{addLabel}</Button>}
        title={addLabel}
        id="new"
        open={open}
        setOpen={setOpen}
      >
        {renderForm(undefined, handleSaved)}
      </FormDialog>

      {items.map((item) => {
        const key = getKey(item);
        return (
          <Card key={key}>
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div>{renderSummary(item)}</div>
              <div className="flex gap-2">
                <FormDialog
                  trigger={<Button size="sm">Bewerk</Button>}
                  title="Bewerken"
                  id={key}
                  open={open}
                  setOpen={setOpen}
                >
                  {renderForm(item, handleSaved)}
                </FormDialog>
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)}>
                  Verwijder
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
