import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
    // CORS configuration
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = request.body;

        // Validate required fields
        if (!data.email || !data.firstName) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        const {
            firstName, lastName, email, phone, address,
            motivation, propertyType, condition, energyClass,
            surface, rooms, bathrooms, floor, hasElevator, extraSpaces,
            leadScore, leadCategory,
            landingPageUrl, utmSource
        } = data;

        // Send email via Resend
        const { data: emailData, error } = await resend.emails.send({
            from: 'Valutazione Immobiliare <onboarding@resend.dev>', // Default Resend testing domain
            to: ['fracop98@gmail.com'],
            subject: `🔥 Nuovo Lead ${leadCategory}: ${firstName} ${lastName} (${leadScore} pt)`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
            .header { background-color: #f8fafc; padding: 20px; text-align: center; border-bottom: 1px solid #eee; }
            .score-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; color: white; font-weight: bold; }
            .hot { background-color: #ef4444; }
            .warm { background-color: #f97316; }
            .qualified { background-color: #eab308; }
            .cold { background-color: #3b82f6; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }
            .grid { display: table; width: 100%; }
            .row { display: table-row; }
            .label { display: table-cell; font-weight: 600; color: #64748b; padding: 4px 12px 4px 0; width: 40%; }
            .value { display: table-cell; color: #0f172a; padding: 4px 0; }
            .footer { margin-top: 32px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nuova Richiesta Valutazione</h1>
              <div class="score-badge ${leadCategory === 'hot_lead' ? 'hot' : leadCategory === 'warm_lead' ? 'warm' : leadCategory === 'qualified_lead' ? 'qualified' : 'cold'}">
                Punteggio: ${leadScore}/100 • ${leadCategory.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            <div class="section">
              <div class="section-title">👤 Contatto</div>
              <div class="grid">
                <div class="row"><div class="label">Nome:</div><div class="value">${firstName} ${lastName}</div></div>
                <div class="row"><div class="label">Email:</div><div class="value"><a href="mailto:${email}">${email}</a></div></div>
                <div class="row"><div class="label">Telefono:</div><div class="value"><a href="tel:${phone}">${phone}</a></div></div>
                <div class="row"><div class="label">Indirizzo:</div><div class="value">${address}</div></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">🏠 Immobile</div>
              <div class="grid">
                <div class="row"><div class="label">Motivazione:</div><div class="value"><strong>${motivation}</strong></div></div>
                <div class="row"><div class="label">Tipologia:</div><div class="value">${propertyType}</div></div>
                <div class="row"><div class="label">Superficie:</div><div class="value">${surface} mq</div></div>
                <div class="row"><div class="label">Locali:</div><div class="value">${rooms} (Bagni: ${bathrooms})</div></div>
                <div class="row"><div class="label">Piano:</div><div class="value">${floor} (Ascensore: ${hasElevator})</div></div>
                <div class="row"><div class="label">Condizione:</div><div class="value">${condition}</div></div>
                <div class="row"><div class="label">Classe En.:</div><div class="value">${energyClass}</div></div>
                <div class="row"><div class="label">Extra:</div><div class="value">${extraSpaces}</div></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📊 Provenienza</div>
              <div class="grid">
                <div class="row"><div class="label">Landing Page:</div><div class="value">${landingPageUrl}</div></div>
                <div class="row"><div class="label">Source:</div><div class="value">${utmSource} / ${utmSource}</div></div>
              </div>
            </div>

            <div class="footer">
              Inviato da ValutaCasa Landing Page • ${new Date().toLocaleString()}
            </div>
          </div>
        </body>
        </html>
      `
        });

        if (error) {
            console.error('Resend Error:', error);
            return response.status(400).json(error);
        }

        return response.status(200).json(emailData);
    } catch (err) {
        console.error('Server Error:', err);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
