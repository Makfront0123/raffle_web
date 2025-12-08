"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section className="py-20 bg-black relative">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gold mb-10 text-center drop-shadow-lg">
          Preguntas Frecuentes
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem
            value="item-1"
            className="border border-gold/40 rounded-xl bg-black/50 backdrop-blur-xl"
          >
            <AccordionTrigger className="text-gold text-lg px-4">
              ¿Cómo compro un boleto?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 px-4 pb-4">
              Seleccionas la rifa, eliges tus números y realizas el pago.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border border-gold/40 rounded-xl bg-black/50 backdrop-blur-xl"
          >
            <AccordionTrigger className="text-gold text-lg px-4">
              ¿Cómo sé si gané?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 px-4 pb-4">
              Publicamos los ganadores y recibes un correo automático.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border border-gold/40 rounded-xl bg-black/50 backdrop-blur-xl"
          >
            <AccordionTrigger className="text-gold text-lg px-4">
              ¿El sorteo es legal y transparente?
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 px-4 pb-4">
              Sí, cada sorteo se realiza con auditoría digital y número certificado.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
