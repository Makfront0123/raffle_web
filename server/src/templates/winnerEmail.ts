export const winnerEmailTemplate = ({
    name,
    raffleTitle,
    prizeName,
    ticketNumber,
}: {
    name: string;
    raffleTitle: string;
    prizeName: string;
    ticketNumber: string;
}) => {
    return `
  <div style="font-family: Arial, sans-serif; background:#f4f4f5; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden;">

      <!-- HEADER -->
      <div style="background:#16a34a; color:#fff; padding:25px; text-align:center;">
        <h1 style="margin:0;">🎉 ¡GANASTE! 🎉</h1>
      </div>

      <!-- BODY -->
      <div style="padding:25px; color:#333; text-align:center;">
        
        <h2 style="margin-bottom:10px;">
          ¡Felicidades ${name}! 🏆
        </h2>

        <p style="font-size:16px;">
          Eres el ganador de la rifa:
        </p>

        <h3 style="color:#000; margin:10px 0 20px;">
          ${raffleTitle}
        </h3>

        <!-- CARD -->
        <div style="
          background:#fafafa;
          border-radius:10px;
          padding:20px;
          margin:20px 0;
        ">
          <p style="margin:5px 0;">
            <strong>🏆 Premio:</strong><br/>
            ${prizeName}
          </p>

          <p style="margin:10px 0;">
            <strong>🎫 Ticket ganador:</strong><br/>
            <span style="
              display:inline-block;
              background:#facc15;
              color:#000;
              padding:8px 14px;
              border-radius:8px;
              font-weight:bold;
              font-size:16px;
              margin-top:5px;
            ">
              #${ticketNumber}
            </span>
          </p>
        </div>

        <!-- INFO -->
        <p style="font-size:14px; color:#555;">
          Nos pondremos en contacto contigo pronto para coordinar la entrega de tu premio.
        </p>

        <p style="margin-top:20px;">
          🍀 Gracias por participar
        </p>

      </div>

      <!-- FOOTER -->
      <div style="background:#fafafa; padding:15px; text-align:center; font-size:12px; color:#777;">
        <p>Este es un mensaje automático, por favor no responder.</p>
      </div>

    </div>

  </div>
  `;
};