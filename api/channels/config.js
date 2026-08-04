// ===== Channel Configuration =====

const { AGENT_DOMAINS } = require('./router');

function getChannelStatus() {
  // Build agents array with intents from router
  const agents = Object.values(AGENT_DOMAINS).map(a => ({
    name: a.name,
    role: a.role,
    status: 'ready',
    intents: a.keywords.slice(0, 5), // Show top 5 keywords as intents
    disclaimer: a.disclaimer
  }));
  
  return {
    whatsapp: {
      name: 'WhatsApp',
      connected: !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
      webhook_url: '/webhooks/whatsapp',
      needs: ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_VERIFY_TOKEN']
    },
    telegram: {
      name: 'Telegram',
      connected: !!(process.env.TELEGRAM_BOT_TOKEN),
      webhook_url: '/webhooks/telegram',
      needs: ['TELEGRAM_BOT_TOKEN']
    },
    slack: {
      name: 'Slack',
      connected: !!(process.env.SLACK_BOT_TOKEN),
      webhook_url: '/webhooks/slack',
      needs: ['SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET']
    },
    twilio: {
      name: 'Twilio WhatsApp',
      connected: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      webhook_url: '/webhooks/twilio',
      needs: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_WHATSAPP_NUMBER']
    },
    maytapi: {
      name: 'Maytapi WhatsApp',
      connected: !!(process.env.MAYTAPI_TOKEN && process.env.MAYTAPI_PRODUCT_ID),
      webhook_url: '/webhooks/maytapi',
      needs: ['MAYTAPI_TOKEN', 'MAYTAPI_PRODUCT_ID', 'MAYTAPI_PHONE_ID']
    },
    imessage: {
      name: 'iMessage',
      connected: !!(process.env.IMESSAGE_RELAY_URL && process.env.IMESSAGE_RELAY_TOKEN),
      webhook_url: '/webhooks/imessage',
      needs: ['IMESSAGE_RELAY_URL', 'IMESSAGE_RELAY_TOKEN']
    },
    agents
  };
}

function getChannelSetupGuide() {
  return {
    whatsapp: {
      title: 'WhatsApp Cloud API (Meta Direct)',
      status: 'blocked',
      note: 'Meta denied direct API access. Use alternative providers below.',
      steps: [
        '1. Go to https://developers.facebook.com',
        '2. Create a Meta app → Add WhatsApp product',
        '3. Get Phone Number ID and Access Token',
        '4. Set webhook URL: https://harz-cloud-backend.vercel.app/webhooks/whatsapp',
        '5. Set verify token (any string, e.g. "harz_whatsapp_2026")',
        '6. Add env vars: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN'
      ]
    },
    telegram: {
      title: 'Telegram Bot (No approval needed — easiest)',
      status: 'ready',
      steps: [
        '1. Open Telegram → Search @BotFather',
        '2. Send /newbot',
        '3. Name: HARZ Cloud Assistant',
        '4. Username: harz_cloud_bot',
        '5. Copy the bot token (123456:ABC-DEF...)',
        '6. Set webhook: POST /api/telegram/setup',
        '7. Add env var: TELEGRAM_BOT_TOKEN'
      ]
    },
    slack: {
      title: 'Slack Bot',
      status: 'ready',
      steps: [
        '1. Go to https://api.slack.com/apps → Create New App',
        '2. Enable Events API → Set request URL: https://harz-cloud-backend.vercel.app/webhooks/slack',
        '3. Subscribe to: message.channels, app_mention',
        '4. Add bot token scopes: chat:write, app_mentions:read',
        '5. Install app to workspace → Get Bot Token (xoxb-...)',
        '6. Add env vars: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET'
      ]
    },
    twilio: {
      title: 'Twilio WhatsApp API (Meta BSP — no direct approval)',
      status: 'ready',
      steps: [
        '1. Go to https://www.twilio.com/console/whatsapp',
        '2. Sign up (free trial available)',
        '3. Get Account SID and Auth Token',
        '4. Enable WhatsApp sandbox or request production access',
        '5. Set webhook: https://harz-cloud-backend.vercel.app/webhooks/twilio',
        '6. Add env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER'
      ]
    },
    maytapi: {
      title: 'Maytapi WhatsApp (Use your own number — no Meta approval)',
      status: 'ready',
      steps: [
        '1. Go to https://www.maytapi.com',
        '2. Sign up and add your WhatsApp number',
        '3. Scan QR code with your WhatsApp',
        '4. Get Product ID, Phone ID, and API Token',
        '5. Set webhook: https://harz-cloud-backend.vercel.app/webhooks/maytapi',
        '6. Add env vars: MAYTAPI_TOKEN, MAYTAPI_PRODUCT_ID, MAYTAPI_PHONE_ID'
      ]
    },
    imessage: {
      title: 'iMessage Bridge (BlueBubbles)',
      status: 'ready',
      steps: [
        '1. Set up BlueBubbles server on a Mac (https://bluebubbles.app)',
        '2. Get server URL and password/token',
        '3. Configure webhook to: https://harz-cloud-backend.vercel.app/webhooks/imessage',
        '4. Add env vars: IMESSAGE_RELAY_URL, IMESSAGE_RELAY_TOKEN',
        'Note: Requires an always-on Mac to relay iMessages'
      ]
    }
  };
}

module.exports = { getChannelStatus, getChannelSetupGuide };
