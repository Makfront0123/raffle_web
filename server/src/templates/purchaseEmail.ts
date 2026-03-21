export const purchaseEmailTemplate = ({
  name,
  raffleTitle,
  tickets,
  total,
  reference,
  prizes,
  endDate,
}: {
  name: string;
  raffleTitle: string;
  tickets: string[];
  total: number;
  reference: string;
  prizes?: { name: string; value: number }[];
  endDate?: Date | string;
}) => {
  const formattedDate = endDate
    ? new Date(endDate).toLocaleDateString()
    : null;

  return `
  <div style="font-family: Arial, sans-serif; background:#f4f4f5; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden;">
      
      <div style="background:#000; color:#fff; padding:20px; text-align:center;">
        <h2>🎉 ¡Compra confirmada!</h2>
      </div>

      <div style="padding:20px;">
        <p>Hola <strong>${name}</strong>,</p>
        <p>Tu compra fue exitosa en:</p>

        <h3 style="margin-bottom:10px;">${raffleTitle}</h3>

        <p><strong>🎫 Tickets:</strong></p>
        <div style="margin-bottom:15px;">
          ${tickets
      .map(
        (t) =>
          `<span style="display:inline-block;background:#eee;padding:6px 10px;border-radius:6px;margin:3px;">#${t}</span>`
      )
      .join("")}
        </div>

        <p><strong>💵 Total:</strong> $${total.toLocaleString()} COP</p>
        <p><strong>🔖 Referencia:</strong> ${reference}</p>

        ${prizes && prizes.length > 0
      ? `
          <hr style="margin:20px 0;" />
          <p><strong>🏆 Premios:</strong></p>
          <ul>
            ${prizes
        .map(
          (p) =>
            `<li>${p.name} - $${Number(p.value).toLocaleString()} COP</li>`
        )
        .join("")}
          </ul>
        `
      : ""
    }

        ${formattedDate
      ? `<p><strong>🗓️ Fecha de cierre:</strong> ${formattedDate}</p>`
      : ""
    }

        <hr style="margin:20px 0;" />

        <p style="font-size:14px;color:#555;">
          Guarda este correo como comprobante de tu compra.
        </p>

        <p style="margin-top:20px;">🍀 ¡Gracias por participar!</p>
      </div>
    </div>
  </div>
  `;
};