// ===== Slack Bot API Channel =====

async function sendSlackMessage(token, channel, text) {
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ channel, text })
  });
  return res.json();
}

async function handleSlackWebhook(req, res, router, agents) {
  // Slack URL verification
  if (req.body.type === 'url_verification') {
    return res.status(200).json({ challenge: req.body.challenge });
  }
  
  // Handle Events API
  const event = req.body.event;
  if (!event) return res.status(200).send('OK');
  
  // Ignore bot messages
  if (event.bot_id) return res.status(200).send('OK');
  
  if (event.type === 'message' || event.type === 'app_mention') {
    const text = event.text || '';
    const channel = event.channel;
    const user = event.user;
    
    // Remove bot mention
    const cleanText = text.replace(/<@[^>]+>/g, '').trim();
    
    // Route to agent
    const routing = router.routeMessage(cleanText);
    
    console.log(`Slack ${channel}/${user} → ${routing.agent.name} (${routing.language}) [${routing.confidence}]`);
    
    // Format response
    const response = formatSlackResponse(routing, cleanText);
    
    // Send reply
    if (process.env.SLACK_BOT_TOKEN) {
      await sendSlackMessage(process.env.SLACK_BOT_TOKEN, channel, response);
    }
    
    // Store conversation
    if (agents.logConversation) {
      agents.logConversation({
        channel: 'slack',
        from: user,
        channel_id: channel,
        text: cleanText,
        agent: routing.agent.name,
        response,
        language: routing.language
      });
    }
  }
  
  res.status(200).send('OK');
}

function formatSlackResponse(routing, userText) {
  const { agent, language } = routing;
  const emoji = {
    magani: '🏥',
    cybershield: '🛡️',
    omega: '⚙️',
    mindcare: '🧠',
    eduwealth: '📚',
    health: '💪',
    content: '✍️'
  };
  
  const icon = emoji[routing.agentKey] || '🤖';
  
  let response = `${icon} *${agent.name}* (${agent.role})\n\n`;
  
  if (language === 'ha') {
    response += `Na karɓi saƙon ku. Ni ${agent.name} ne.\n`;
    response += `Saƙonku: "${userText}"\n\n`;
    response += `Zan taimaka ku akan wannan.`;
  } else {
    response += `I received your message. I'm ${agent.name}.\n`;
    response += `Your message: "${userText}"\n\n`;
    response += `I'll help you with this.`;
  }
  
  if (agent.disclaimer) {
    response += `\n\n${agent.disclaimer}`;
  }
  
  return response;
}

module.exports = { sendSlackMessage, handleSlackWebhook, formatSlackResponse };
