import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function FormDialog({
  trigger,
  title,
  id,
  open,
  setOpen,
  children,
}: {
  trigger: React.ReactElement;
  title: string;
  id: string;
  open: string | null;
  setOpen: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open === id} onOpenChange={(next) => setOpen(next ? id : null)}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
