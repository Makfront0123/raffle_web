"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProvidersFormProps } from "@/type/Providers";
import { motion } from "framer-motion";

export function ProvidersForm({
  form,
  onChange,
  onSubmit,
  errors,
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
        <p className="text-red-500 text-sm mt-1 min-h-[20px]">
          {errors?.name?.[0] || ""}
        </p>
      </div>

      <div>
        <Label>Nombre de Contacto</Label>
        <Input
          name="contact_name"
          value={form.contact_name}
          onChange={onChange}
          required
        />
        <div className="min-h-[20px] mt-1">
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{
              opacity: errors?.contact_name ? 1 : 0,
              y: errors?.contact_name ? 0 : -4
            }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-sm"
          >
            {errors?.contact_name?.[0] || ""}
          </motion.p>
        </div>
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
        <div className="min-h-[20px] mt-1">
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{
              opacity: errors?.contact_email ? 1 : 0,
              y: errors?.contact_email ? 0 : -4
            }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-sm"
          >
            {errors?.contact_email?.[0] || ""}
          </motion.p>
        </div>
      </div>

      <div>
        <Label>Teléfono</Label>
        <Input
          name="contact_phone"
          value={form.contact_phone}
          onChange={onChange}
          required
        />
        <div className="min-h-[20px] mt-1">
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{
              opacity: errors?.contact_phone ? 1 : 0,
              y: errors?.contact_phone ? 0 : -4
            }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-sm"
          >
            {errors?.contact_phone?.[0] || ""}
          </motion.p>
        </div>
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
