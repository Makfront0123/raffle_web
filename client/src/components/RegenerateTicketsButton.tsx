import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRaffles } from "@/hook/useRaffles";
import { AuthStore } from "@/store/authStore";

const RegenerateTicketsButton = ({ raffleId }: { raffleId: number }) => {
  const { regenerateTickets } = useRaffles();
  const { token } = AuthStore();
  const [open, setOpen] = useState(false);
  const [digits, setDigits] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    if (!token) return;
    setLoading(true);
    await regenerateTickets(raffleId, digits);
    setOpen(false);

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Regenerar Tickets</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Regenerar Tickets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 my-2">
          <label>Nuevos dígitos:</label>
          <Input
            type="number"
            min={1}
            max={10}
            value={digits}
            onChange={(e) => setDigits(Number(e.target.value))}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleRegenerate} disabled={loading}>
            {loading ? "Generando..." : "Regenerar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegenerateTicketsButton;
