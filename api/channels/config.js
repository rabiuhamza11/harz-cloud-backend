// ===== Channel Configuration =====

function getChannelStatus() {
  return {
    whatsapp: {
      name: 'WhatsApp',
      connected: !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
      webhook_url: '/webhooks/whatsapp',
      needs: ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_VERIFY_TOKEN']
    },
    slack: {
      name: 'Slack',
      connected: !!(process.env.SLACK_BOT_TOKEN),
      webhook_url: '/webhooks/slack',
      needs: ['SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET']
    },
    imessage: {
      name: 'iMessage',
      connected: !!(process.env.IMESSAGE_RELAY_URL && process.env.IMESSAGE_RELAY_TOKEN),
      webhook_url: '/webhooks/imessage',
      needs: ['IMESSAGE_RELAY_URL', 'IMESSAGE_RELAY_TOKEN']
    },
    agents: [
      { name: 'Magani', role: 'Health Agent', status: 'ready' },
      { name: 'CyberShield Agent', role: 'Security Agent', status: 'ready' },
      { name: 'Omega Commander', role: 'DevOps Agent', status: 'ready' },
      { name: 'MindCare Agent', role: 'Mental Health Agent', status: 'ready' },
      { name: 'EduWealth Agent', role: 'Education Agent', status: 'ready' },
      { name: 'Health Agent', role: 'General Health Agent', status: 'ready' },
      { name: 'Content Agent', role: 'Content Creation Agent', status: 'ready' }
    ]
  };
}

function getChannelSetupGuide() {
  return {
    whatsapp: {
      title: 'WhatsApp Cloud API Setup',
      steps: [
        '1. Go to https://developers.facebook.com',
        '2. Create a Meta app → Add WhatsApp product',
        '3. Get Phone Number ID and Access Token',
        '4. Set webhook URL: https://harz-cloud-backend.vercel.app/webhooks/whatsapp',
        '5. Set verify token (any string, e.g. "harz_whatsapp_2026")',
        '6. Add env vars: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN'
      ]
    },
    slack: {
      title: 'Slack Bot Setup',
      steps: [
        '1. Go to https://api.slack.com/apps → Create New App',
        '2. Enable Events API → Set request URL: https://harz-cloud-backend.vercel.app/webhooks/slack',
        '3. Subscribe to: message.channels, app_mention',
        '4. Add bot token scopes: chat:write, app_mentions:read',
        '5. Install app to workspace → Get Bot Token (xoxb-...)',
        '6. Add env vars: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET'
      ]
    },
    imessage: {
      title: 'iMessage Bridge Setup',
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
