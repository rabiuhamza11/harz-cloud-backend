// ===== Conversation Storage — Logs all channel conversations =====

// In-memory store (Vercel serverless — each instance has its own)
// In production, persist to a database (MongoDB, Supabase, etc.)
const conversations = [];

function logConversation(data) {
  const entry = {
    id: 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    ...data
  };
  conversations.push(entry);
  console.log('Conversation logged:', entry.id, '|', data.channel, '→', data.agent);
  return entry;
}

function getConversations(filters = {}) {
  let results = conversations;
  
  if (filters.channel) results = results.filter(c => c.channel === filters.channel);
  if (filters.agent) results = results.filter(c => c.agent === filters.agent);
  if (filters.from) results = results.filter(c => c.from === filters.from);
  
  return {
    count: results.length,
    conversations: results.slice(-50).reverse() // Last 50, newest first
  };
}

function getConversationStats() {
  const byChannel = {};
  const byAgent = {};
  
  for (const conv of conversations) {
    byChannel[conv.channel] = (byChannel[conv.channel] || 0) + 1;
    byAgent[conv.agent] = (byAgent[conv.agent] || 0) + 1;
  }
  
  return {
    total: conversations.length,
    byChannel,
    byAgent
  };
}

module.exports = { conversations, logConversation, getConversations, getConversationStats };
