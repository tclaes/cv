import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AddButton({
  label,
  id,
  open,
  setOpen,
  children,
}: {
  label: string;
  id: string;
  open: string | null;
  setOpen: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open === id} onOpenChange={(next) => setOpen(next ? id : null)}>
      <DialogTrigger render={<Button variant="outline">{label}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
