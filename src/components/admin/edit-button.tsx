import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function EditButton({
  id,
  open,
  setOpen,
  children,
}: {
  id: string;
  open: string | null;
  setOpen: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open === id} onOpenChange={(next) => setOpen(next ? id : null)}>
      <DialogTrigger render={<Button size="sm">Bewerk</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bewerken</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
