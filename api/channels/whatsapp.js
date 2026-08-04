// ===== WhatsApp Cloud API Channel =====

async function sendWhatsAppMessage(phoneNumberId, token, to, text) {
  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
  const body = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: { body: text }
  };
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  return res.json();
}

async function handleWhatsAppWebhook(req, res, router, agents) {
  // WhatsApp verification
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token']) {
    if (req.query['hub.verify_token'] === process.env.WHATSAPP_VERIFY_TOKEN) {
      return res.status(200).send(req.query['hub.challenge']);
    }
    return res.status(403).send('Forbidden');
  }
  
  // Handle incoming messages
  const body = req.body;
  if (!body.entry) return res.status(200).send('OK');
  
  for (const entry of body.entry) {
    for (const change of entry.changes || []) {
      const messages = change.value?.messages || [];
      for (const msg of messages) {
        if (msg.type === 'text') {
          const from = msg.from; // phone number
          const text = msg.text.body;
          const messageId = msg.id;
          
          // Route to agent
          const routing = router.routeMessage(text);
          
          // Log routing decision
          console.log(`WhatsApp ${from} → ${routing.agent.name} (${routing.language}) [${routing.confidence}]`);
          
          // Generate response (simplified — in production, call AI model)
          const response = formatAgentResponse(routing, text);
          
          // Send reply
          if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_TOKEN) {
            await sendWhatsAppMessage(
              process.env.WHATSAPP_PHONE_NUMBER_ID,
              process.env.WHATSAPP_TOKEN,
              from,
              response
            );
          }
          
          // Store conversation in HARZ Cloud
          if (agents.logConversation) {
            agents.logConversation({
              channel: 'whatsapp',
              from,
              text,
              agent: routing.agent.name,
              response,
              language: routing.language
            });
          }
        }
      }
    }
  }
  
  res.status(200).send('OK');
}

function formatAgentResponse(routing, userText) {
  const { agent, language } = routing;
  const prefix = language === 'ha' 
    ? `🌐 ${agent.name}:\n\n` 
    : `🌐 ${agent.name}:\n\n`;
  
  let response = prefix;
  
  if (language === 'ha') {
    response += `Na karɓi saƙon ku. Ni ${agent.name} ne, ${agent.role}.\n\n`;
    response += `Saƙonku: "${userText}"\n\n`;
    response += `Zan taimaka ku akan wannan. `;
  } else {
    response += `I received your message. I'm ${agent.name}, your ${agent.role}.\n\n`;
    response += `Your message: "${userText}"\n\n`;
    response += `I'll help you with this. `;
  }
  
  if (agent.disclaimer) {
    response += `\n\n${agent.disclaimer}`;
  }
  
  return response;
}

module.exports = { sendWhatsAppMessage, handleWhatsAppWebhook, formatAgentResponse };
