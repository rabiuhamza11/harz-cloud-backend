// ===== iMessage Bridge Channel =====
// iMessage requires a relay server (e.g., BlueBubbles, or a Mac-based bridge)
// This endpoint receives webhook from the relay and responds

async function sendiMessageMessage(relayUrl, relayToken, to, text) {
  if (!relayUrl) return { error: 'iMessage relay not configured' };
  
  const res = await fetch(`${relayUrl}/api/v1/message/text`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${relayToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ chatGuid: `iMessage;-;${to}`, text })
  });
  return res.json();
}

async function handleiMessageWebhook(req, res, router, agents) {
  // iMessage relay webhook
  const body = req.body;
  
  if (!body || !body.message) return res.status(200).send('OK');
  
  const msg = body.message;
  const from = msg.guid || msg.from;
  const text = msg.text || '';
  
  if (!text) return res.status(200).send('OK');
  
  // Route to agent
  const routing = router.routeMessage(text);
  
  console.log(`iMessage ${from} → ${routing.agent.name} (${routing.language}) [${routing.confidence}]`);
  
  // Format response
  const response = formatiMessageResponse(routing, text);
  
  // Send reply via relay
  if (process.env.IMESSAGE_RELAY_URL && process.env.IMESSAGE_RELAY_TOKEN) {
    await sendiMessageMessage(
      process.env.IMESSAGE_RELAY_URL,
      process.env.IMESSAGE_RELAY_TOKEN,
      from,
      response
    );
  }
  
  // Store conversation
  if (agents.logConversation) {
    agents.logConversation({
      channel: 'imessage',
      from,
      text,
      agent: routing.agent.name,
      response,
      language: routing.language
    });
  }
  
  res.status(200).send('OK');
}

function formatiMessageResponse(routing, userText) {
  const { agent, language } = routing;
  
  let response = '';
  if (language === 'ha') {
    response += `${agent.name} 🌐\n\n`;
    response += `Na karɓi saƙon ku. Ni ${agent.name} ne, ${agent.role}.\n\n`;
    response += `Zan taimaka ku akan: "${userText}"\n`;
  } else {
    response += `${agent.name} 🌐\n\n`;
    response += `I received your message. I'm ${agent.name}, your ${agent.role}.\n\n`;
    response += `I'll help you with: "${userText}"\n`;
  }
  
  if (agent.disclaimer) {
    response += `\n${agent.disclaimer}`;
  }
  
  return response;
}

module.exports = { sendiMessageMessage, handleiMessageWebhook, formatiMessageResponse };
