"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProviderFormState } from "@/hook/useProviderLogic";
interface ProvidersFormProps {
  form: ProviderFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => Promise<void>;
  submitLabel?: string;
}

export function ProvidersForm({
  form,
  onChange,
  onSubmit,
  submitLabel = "Guardar"
}: ProvidersFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div>
        <Label>Nombre del Proveedor</Label>
        <Input
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label>Nombre de Contacto</Label>
        <Input
          name="contact_name"
          value={form.contact_name}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          name="contact_email"
          value={form.contact_email}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label>Teléfono</Label>
        <Input
          name="contact_phone"
          value={form.contact_phone}
          onChange={onChange}
          required
        />
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
