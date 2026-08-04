// ===== HARZ Agent Router — Routes messages to the right agent =====

const AGENT_DOMAINS = {
  magani: {
    name: 'Magani',
    role: 'Health Agent',
    keywords: ['health', 'likita', 'ciwo', 'maganin', 'symptom', 'sick', 'illness', 'fever', 'diagnosis', 'treatment', 'drug', ' prescription', 'dose', 'pain', 'headache', 'cough', 'flu', 'malaria', 'typhoid'],
    systemPrompt: 'You are Magani, a warm but clinical health AI assistant for the HARZ Ecosystem. You provide general health information, symptom assessment, and wellness advice. You NEVER diagnose or prescribe — always recommend seeing a licensed clinician. You speak Hausa and English naturally.',
    disclaimer: '⚠️ Wannan ba shawarar likita ba ce. Tuntuɓi likitan kwarewa don ganin asibiti.'
  },
  cybershield: {
    name: 'CyberShield Agent',
    role: 'Security Agent',
    keywords: ['security', 'breach', 'virus', 'malware', 'hack', 'attack', 'password', 'phishing', 'firewall', 'encryption', 'vulnerability', 'threat', 'cyber', 'secure', 'protect'],
    systemPrompt: 'You are CyberShield, a precise and threat-focused cybersecurity AI agent for the HARZ Ecosystem. You provide security guidance, threat assessment, and hardening recommendations. You are direct and technical. You speak Hausa and English.',
    disclaimer: null
  },
  omega: {
    name: 'Omega Commander',
    role: 'DevOps Agent',
    keywords: ['deploy', 'server', 'ci', 'cd', 'pipeline', 'docker', 'kubernetes', 'vercel', 'github', 'build', 'release', 'rollback', 'uptime', 'status', 'devops', 'infrastructure', 'cloud'],
    systemPrompt: 'You are Omega Commander, a disciplined DevOps AI agent for the HARZ Ecosystem. You handle deployment guidance, infrastructure status, and CI/CD pipeline management. You are ops-minded and cautious with production. You speak Hausa and English.',
    disclaimer: null
  },
  mindcare: {
    name: 'MindCare Agent',
    role: 'Mental Health Agent',
    keywords: ['stress', 'anxiety', 'depression', 'mental', 'mind', 'feeling', 'sad', 'worried', 'panic', 'trauma', 'therapy', 'counseling', 'sleep', 'mood', 'emotion'],
    systemPrompt: 'You are MindCare, a gentle and empathetic mental health AI agent for the HARZ Ecosystem. You provide emotional support, coping strategies, and wellness tips. You NEVER diagnose mental health conditions — always recommend professional help. You speak Hausa and English with warmth.',
    disclaimer: '⚠️ Wannan ba shawarar ƙwararre ba ce akan lafiyar kwakwalwa. Tuntuɓi ƙwararre don taimako.'
  },
  eduwealth: {
    name: 'EduWealth Agent',
    role: 'Education Agent',
    keywords: ['learn', 'course', 'study', 'education', 'school', 'teach', 'tutorial', 'lesson', 'knowledge', 'skill', 'training', 'book', 'read', 'university', 'exam'],
    systemPrompt: 'You are EduWealth, an encouraging and knowledgeable education AI agent for the HARZ Ecosystem. You help with learning paths, study tips, and educational resources. You are patient and motivating. You speak Hausa and English.',
    disclaimer: null
  },
  health: {
    name: 'Health Agent',
    role: 'General Health Agent',
    keywords: ['wellness', 'fitness', 'nutrition', 'diet', 'exercise', 'weight', 'healthy', 'vitamin', 'supplement', 'lifestyle', 'prevent', 'screening'],
    systemPrompt: 'You are the Health Agent, a wellness-focused AI for the HARZ Ecosystem. You provide general wellness, fitness, and nutrition guidance. You promote healthy lifestyles. You speak Hausa and English.',
    disclaimer: '⚠️ Don shawarar likita ta musamman, tuntuɓi ƙwararre.'
  },
  content: {
    name: 'Content Agent',
    role: 'Content Creation Agent',
    keywords: ['write', 'post', 'video', 'content', 'blog', 'article', 'social', 'media', 'caption', 'headline', 'copy', 'marketing', 'brand', 'creative', 'design'],
    systemPrompt: 'You are the Content Agent, a creative and versatile AI content creator for the HARZ Ecosystem. You help with writing, content strategy, social media, and creative direction. You are energetic and imaginative. You speak Hausa and English.',
    disclaimer: null
  }
};

function detectLanguage(text) {
  // Simple Hausa detection
  const hausaWords = ['na', 'ka', 'ki', 'ku', 'mu', 'ya', 'ta', 'da', 'ba', 'ne', 'ke', 'wani', 'wata', 'kuma', 'amma', 'sai', 'ko', 'don', 'ina', 'kana', 'tana', 'suna', 'muna', 'kuna', 'ina', 'me', 'yaya', 'ina', 'zuwa', 'gida', 'aiki', 'kudi', 'lafiya', 'ciwo', 'likita'];
  const words = text.toLowerCase().split(/\s+/);
  let hausaCount = 0;
  for (const word of words) {
    if (hausaWords.includes(word)) hausaCount++;
  }
  return hausaCount >= 2 ? 'ha' : 'en';
}

function routeMessage(text) {
  const lowerText = text.toLowerCase();
  const scores = {};
  
  for (const [key, agent] of Object.entries(AGENT_DOMAINS)) {
    scores[key] = 0;
    for (const keyword of agent.keywords) {
      if (lowerText.includes(keyword)) {
        scores[key]++;
      }
    }
  }
  
  // Find best match
  let bestAgent = null;
  let bestScore = 0;
  for (const [key, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestAgent = key;
    }
  }
  
  // Default to Omega Commander if no match (general assistant)
  if (!bestAgent || bestScore === 0) {
    bestAgent = 'omega';
  }
  
  return {
    agentKey: bestAgent,
    agent: AGENT_DOMAINS[bestAgent],
    confidence: bestScore,
    language: detectLanguage(text),
    allScores: scores
  };
}

module.exports = { AGENT_DOMAINS, detectLanguage, routeMessage };
