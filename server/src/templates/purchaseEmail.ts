export const purchaseEmailTemplate = ({
    name,
    raffleTitle,
    tickets,
    total,
    reference,
}: {
    name: string;
    raffleTitle: string;
    tickets: string[];
    total: number;
    reference: string;
}) => {
    return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f5; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px;">
        <div style="background:#000; color:#fff; padding:20px; text-align:center;">
          <h2>🎉 ¡Compra confirmada!</h2>
        </div>

        <div style="padding:20px;">
          <p>Hola <strong>${name}</strong>,</p>
          <p>Tu compra fue exitosa en:</p>
          <h3>${raffleTitle}</h3>

          <p><strong>💵 Total:</strong> $${total}</p>
          <p><strong>🔖 Ref:</strong> ${reference}</p>

          <div>
            ${tickets.map(t => `<span>#${t}</span>`).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
};