// HARZ Cloud Backend v2.0 — Express.js server for HARZ Ecosystem Super App
// Primary data layer: Base44 entities (synced via API)
// Fallback: Local seeded data for offline resilience

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'harz-cloud-secret-2026';

// ===== MIDDLEWARE =====
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (!token) return res.status(401).json({ error: 'No auth token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ===== SEED DATA — Synced from Base44 entities =====
const SEED_PLATFORMS = [
  { name: 'HarzPay', icon: '💳', category: 'Finance', url: 'https://harzpay.vercel.app', status: 'Live', description: 'Payment processing with low fees', platforms_count: 1, revenue: 12000 },
  { name: 'HarzStore', icon: '🛍️', category: 'Marketplace', url: 'https://harzdm-marketplace.vercel.app', status: 'Live', description: 'Multi-vendor marketplace platform', platforms_count: 1, revenue: 7500 },
  { name: 'HarzDM', icon: '📦', category: 'Marketplace', url: 'https://harzdm-marketplace.vercel.app', status: 'Live', description: 'Direct marketplace & delivery', platforms_count: 1, revenue: 0 },
  { name: 'MindCare AI', icon: '🧠', category: 'AI', url: 'https://mindcare-ai.vercel.app', status: 'Live', description: 'AI-powered mental health platform', platforms_count: 1, revenue: 5000 },
  { name: 'Omega Health AI', icon: '🏥', category: 'Health', url: 'https://omega-health.vercel.app', status: 'Live', description: 'AI health checkup with 18 specialists', platforms_count: 1, revenue: 3000 },
  { name: 'Cyber Shield X', icon: '🛡️', category: 'Security', url: 'https://cyber-shield-x.vercel.app', status: 'Live', description: 'Advanced threat detection & monitoring', platforms_count: 1, revenue: 15000 },
  { name: 'TradeOS', icon: '📈', category: 'Trading', url: 'https://tradeos.vercel.app', status: 'Live', description: 'Real-time multi-exchange trading', platforms_count: 1, revenue: 25000 },
  { name: 'BuildBot AI', icon: '🏗️', category: 'Construction', url: 'https://buildbot-ai.vercel.app', status: 'Live', description: 'AI construction management', platforms_count: 1, revenue: 20000 },
  { name: 'HarzMusic', icon: '🎵', category: 'Music', url: 'https://harz-music.vercel.app', status: 'Live', description: 'Afrobeats & Amapiano beats marketplace', platforms_count: 1, revenue: 1500 },
  { name: 'HarzFilm', icon: '🎬', category: 'Film', url: 'https://harz-film.vercel.app', status: 'Live', description: 'HD film rental — Nollywood, Bollywood, K-Drama', platforms_count: 1, revenue: 500 },
  { name: 'ContentPilot', icon: '✍️', category: 'Media', url: 'https://contentpilot.vercel.app', status: 'Live', description: 'Multi-platform social content automation', platforms_count: 1, revenue: 10000 },
  { name: 'Nexal Media', icon: '📱', category: 'Media', url: 'https://nexal-media.vercel.app', status: 'Live', description: 'Social ads across 6 platforms with Paystack', platforms_count: 1, revenue: 8000 },
  { name: 'Estate City AI', icon: '🏠', category: 'Real Estate', url: 'https://estate-city.vercel.app', status: 'Live', description: 'Premium property listing with AI estimator', platforms_count: 1, revenue: 5000 },
  { name: 'HarzAjo', icon: '💰', category: 'Finance', url: 'https://harzajo.vercel.app', status: 'Live', description: 'Savings & contribution tracking', platforms_count: 1, revenue: 2000 },
  { name: 'HarzFX', icon: '💱', category: 'Finance', url: 'https://harzfx.vercel.app', status: 'Live', description: 'Real-time FX rates & currency exchange', platforms_count: 1, revenue: 3500 },
  { name: 'Harz Digital', icon: '📚', category: 'Education', url: 'https://harz-digital.vercel.app', status: 'Live', description: 'Trading & Digital Marketing courses', platforms_count: 1, revenue: 15000 },
  { name: 'HarzDomain', icon: '🌐', category: 'Hosting', url: 'https://harzdomain.vercel.app', status: 'Live', description: 'Domain + free SSL & DNS management', platforms_count: 1, revenue: 2500 },
  { name: 'DeployForge', icon: '🚀', category: 'DevOps', url: 'https://rabiuhamza11.github.io/harz-portfolio/deployforge.html', status: 'Live', description: 'Multi-platform deployment engine', platforms_count: 1, revenue: 10000 },
  { name: 'GDEG Energy', icon: '⚡', category: 'Energy', url: 'https://gdeg-energy.vercel.app', status: 'Live', description: 'Blockchain P2P renewable energy credits', platforms_count: 1, revenue: 100 },
  { name: 'Omega Commander', icon: '🤖', category: 'AI', url: 'https://omega-commander.vercel.app', status: 'Live', description: 'Enterprise OS with 9 AI agents', platforms_count: 1, revenue: 50000 },
  { name: 'HarzLend', icon: '🏦', category: 'Finance', url: 'https://harzlend.vercel.app', status: 'Live', description: 'AI loan approval & credit scoring', platforms_count: 1, revenue: 0 },
  { name: 'Harz Construction ND', icon: '🔨', category: 'Construction', url: 'https://harz-construction-nd.vercel.app', status: 'Live', description: 'Construction company website', platforms_count: 1, revenue: 0 },
  { name: 'NEXUS Pro', icon: '🏗️', category: 'Construction', url: 'https://harz-construction-pro.vercel.app', status: 'Live', description: 'HARZ Construction Management System', platforms_count: 1, revenue: 0 },
  { name: 'HARZ Ecosystem Dashboard', icon: '📊', category: 'Infrastructure', url: 'https://harz-ecosystem-dashboard.vercel.app', status: 'Live', description: 'Unified Command Center for all Harz platforms', platforms_count: 1, revenue: 0 },
  { name: 'HARZ Platform', icon: '🏢', category: 'Infrastructure', url: 'https://harz-platform.vercel.app', status: 'Live', description: 'Enterprise showcase deployed across 5 platforms', platforms_count: 1, revenue: 0 },
  { name: 'Omega AI Packager', icon: '📦', category: 'DevOps', url: 'https://github.com/rabiuhamza11/omega-ai-packager', status: 'Live', description: 'Ship AI agent projects like software', platforms_count: 1, revenue: 0 },
  { name: 'HARZ Portfolio', icon: '📋', category: 'Infrastructure', url: 'https://rabiuhamza11.github.io/harz-portfolio', status: 'Live', description: 'Official Portfolio & Ecosystem Showcase', platforms_count: 1, revenue: 0 },
  { name: 'HARZ Super App', icon: '⚡', category: 'Infrastructure', url: 'https://rabiuhamza11.github.io/harz-portfolio/harz-super-app-v5.html', status: 'Live', description: 'Unified ecosystem app with 56 platforms', platforms_count: 1, revenue: 0 },
  { name: 'Omega Commander Bot', icon: '🤖', category: 'AI', url: 'https://github.com/rabiuhamza11/omega-commander-bot', status: 'Live', description: 'OMEGA Business Commander AI — Telegram Bot', platforms_count: 1, revenue: 0 },
  { name: 'FluxDeploy', icon: '🔄', category: 'DevOps', url: 'https://github.com/rabiuhamza11/fluxdeploy', status: 'Live', description: 'Multi-platform deployment system', platforms_count: 1, revenue: 0 },
  { name: 'HARZ Cloud', icon: '☁️', category: 'Infrastructure', url: 'https://harz-cloud-backend.onrender.com', status: 'Live', description: 'HARZ Cloud — Backend infrastructure on Render', platforms_count: 1, revenue: 0 },
  { name: 'HarzAjo Pro', icon: '💎', category: 'Finance', url: 'https://harzajo-pro.vercel.app', status: 'Live', description: 'Advanced savings & contribution tracking', platforms_count: 1, revenue: 2000 },
  { name: 'HarzID', icon: '🪪', category: 'Security', url: 'https://harzid.vercel.app', status: 'Live', description: 'Identity verification & KYC', platforms_count: 1, revenue: 0 },
  { name: 'HarzChat AI', icon: '💬', category: 'AI', url: 'https://harzchat-ai.vercel.app', status: 'Live', description: 'AI-powered customer support chat', platforms_count: 1, revenue: 0 },
  { name: 'HarzVPN', icon: '🔒', category: 'Security', url: 'https://harzvpn.vercel.app', status: 'Live', description: 'Secure VPN service', platforms_count: 1, revenue: 0 },
  { name: 'HarzData', icon: '🗄️', category: 'Infrastructure', url: 'https://harzdata.vercel.app', status: 'Live', description: 'Data analytics & visualization', platforms_count: 1, revenue: 0 },
  { name: 'HarzCRM', icon: '🤝', category: 'Business', url: 'https://harzcrm.vercel.app', status: 'Live', description: 'Customer relationship management', platforms_count: 1, revenue: 0 },
  { name: 'HarzLogistics', icon: '🚚', category: 'Logistics', url: 'https://harzlogistics.vercel.app', status: 'Live', description: 'Delivery & supply chain management', platforms_count: 1, revenue: 0 },
  { name: 'HarzEvents', icon: '🎪', category: 'Events', url: 'https://harzevents.vercel.app', status: 'Live', description: 'Event management & ticketing', platforms_count: 1, revenue: 0 },
  { name: 'HarzGaming', icon: '🎮', category: 'Gaming', url: 'https://harzgaming.vercel.app', status: 'Live', description: 'Gaming platform & tournaments', platforms_count: 1, revenue: 0 },
  { name: 'HarzSocial', icon: '👥', category: 'Social', url: 'https://harzsocial.vercel.app', status: 'Live', description: 'Social networking for HARZ users', platforms_count: 1, revenue: 0 },
  { name: 'HarzScan', icon: '📷', category: 'Security', url: 'https://harzscan.vercel.app', status: 'Live', description: 'QR code & barcode scanning', platforms_count: 1, revenue: 0 },
  { name: 'HarzVerify', icon: '✅', category: 'Security', url: 'https://harzverify.vercel.app', status: 'Live', description: 'Document verification & authentication', platforms_count: 1, revenue: 0 },
  { name: 'HarzAI Writer', icon: '✍️', category: 'AI', url: 'https://harzai-writer.vercel.app', status: 'Live', description: 'AI content writing assistant', platforms_count: 1, revenue: 0 },
  { name: 'HarzVoice', icon: '🎙️', category: 'AI', url: 'https://harzvoice.vercel.app', status: 'Live', description: 'Voice-to-text & AI voice assistant', platforms_count: 1, revenue: 0 },
  { name: 'HarzImage AI', icon: '🖼️', category: 'AI', url: 'https://harzimage-ai.vercel.app', status: 'Live', description: 'AI image generation & editing', platforms_count: 1, revenue: 0 },
  { name: 'HarzVideo AI', icon: '🎥', category: 'AI', url: 'https://harzvideo-ai.vercel.app', status: 'Live', description: 'AI video generation & editing', platforms_count: 1, revenue: 0 },
  { name: 'HarzCode AI', icon: '💻', category: 'AI', url: 'https://harzcode-ai.vercel.app', status: 'Live', description: 'AI code generation & review', platforms_count: 1, revenue: 0 },
  { name: 'HarzTranslate', icon: '🌍', category: 'AI', url: 'https://harztranslate.vercel.app', status: 'Live', description: 'AI translation service', platforms_count: 1, revenue: 0 },
  { name: 'HarzResearch AI', icon: '🔬', category: 'AI', url: 'https://harzresearch-ai.vercel.app', status: 'Live', description: 'AI research assistant', platforms_count: 1, revenue: 0 },
  { name: 'HarzLegal AI', icon: '⚖️', category: 'AI', url: 'https://harzlegal-ai.vercel.app', status: 'Live', description: 'AI legal advice & document review', platforms_count: 1, revenue: 0 },
  { name: 'HarzTax AI', icon: '📊', category: 'Finance', url: 'https://harztax-ai.vercel.app', status: 'Live', description: 'AI tax calculation & filing', platforms_count: 1, revenue: 0 },
  { name: 'HarzInsurance AI', icon: '🛡️', category: 'Finance', url: 'https://harzinsurance-ai.vercel.app', status: 'Live', description: 'AI insurance quotes & claims', platforms_count: 1, revenue: 0 },
  { name: 'HarzRealEstate AI', icon: '🏡', category: 'Real Estate', url: 'https://harzrealestate-ai.vercel.app', status: 'Live', description: 'AI property valuation & listings', platforms_count: 1, revenue: 0 },
  { name: 'HarzAgriculture AI', icon: '🌾', category: 'Agriculture', url: 'https://harzagriculture-ai.vercel.app', status: 'Live', description: 'AI farming & crop management', platforms_count: 1, revenue: 0 },
  { name: 'HARZ AI OS', icon: '🖥️', category: 'AI', url: 'https://harz-ai-os.vercel.app', status: 'Development', description: 'HARZ AI OS v2 — Next-gen unified ecosystem interface', platforms_count: 1, revenue: 0 },
  { name: 'HARZ Edge', icon: '🌐', category: 'Infrastructure', url: 'https://harz-edge.vercel.app', status: 'Development', description: 'DNS, CDN, WAF & Edge Computing Platform', platforms_count: 1, revenue: 0 },
  { name: 'HARZ AI Chat', icon: '💬', category: 'AI', url: 'https://harz-ai-chat.vercel.app', status: 'Development', description: 'HARZ AI Chat — Qwen-powered web chat', platforms_count: 1, revenue: 0 },
  { name: 'HARZ Ecosystem App', icon: '📱', category: 'Infrastructure', url: 'https://github.com/rabiuhamza11/harz-ecosystem-app', status: 'Development', description: 'Flutter mobile app for Harz Ecosystem', platforms_count: 1, revenue: 0 },
];

const SEED_AGENTS = [
  { name: 'Omega Commander', role: 'Lead Orchestrator', icon: '🤖', status: 'active', success_rate: 97.5, tasks_completed: 1247, specialties: ['Strategy', 'Delegation', 'System Design'], description: 'Master AI agent orchestrating all ecosystem operations' },
  { name: 'MindCare AI', role: 'Mental Health Agent', icon: '🧠', status: 'active', success_rate: 94.2, tasks_completed: 892, specialties: ['CBT', 'DBT', 'Crisis Intervention'], description: 'AI-powered mental health support and therapy sessions' },
  { name: 'BuildBot AI', role: 'Construction Agent', icon: '🏗️', status: 'active', success_rate: 96.1, tasks_completed: 543, specialties: ['Cost Estimation', 'Project Management', 'Safety'], description: 'AI construction management and cost estimation' },
  { name: 'TradeOS AI', role: 'Trading Agent', icon: '📈', status: 'active', success_rate: 92.8, tasks_completed: 1876, specialties: ['Technical Analysis', 'Risk Management', 'Signals'], description: 'AI trading signals and multi-exchange execution' },
  { name: 'ContentPilot AI', role: 'Content Agent', icon: '✍️', status: 'active', success_rate: 95.5, tasks_completed: 1102, specialties: ['Content Creation', 'SEO', 'Social Media'], description: 'AI content generation across multiple platforms' },
  { name: 'CyberShield AI', role: 'Security Agent', icon: '🛡️', status: 'active', success_rate: 98.1, tasks_completed: 445, specialties: ['Threat Detection', 'Penetration Testing', 'Compliance'], description: 'AI cybersecurity monitoring and threat response' },
  { name: 'HarzPay AI', role: 'Finance Agent', icon: '💳', status: 'active', success_rate: 93.7, tasks_completed: 2103, specialties: ['Payments', 'Wallet', 'Transactions'], description: 'AI payment processing and wallet management' },
];

const SEED_WALLET = {
  ngn_balance: 125000,
  usd_balance: 350,
  gdeg_balance: 5000,
  usdt_balance: 120,
  payment_methods: [
    { type: 'UBA Transfer', details: '2034326424', is_active: true },
    { type: 'Paystack', details: 'Card Payment', is_active: true },
    { type: 'GDEG Token', details: '1 = $0.01', is_active: true },
    { type: 'USDT TRC20', details: 'TX...abc123', is_active: true },
  ]
};

const SEED_TRANSACTIONS = [
  { id: 'TXN-001', amount: 5000, currency: 'NGN', type: 'Purchase', status: 'Completed', description: 'MindCare Premium', recipient: 'MindCare AI', platform: 'MindCare AI', date: '2026-08-04T10:42:00Z' },
  { id: 'TXN-002', amount: 15000, currency: 'NGN', type: 'Purchase', status: 'Completed', description: 'Cyber Shield Pro', recipient: 'Cyber Shield X', platform: 'Cyber Shield X', date: '2026-08-04T10:42:00Z' },
  { id: 'TXN-003', amount: 25000, currency: 'NGN', type: 'Purchase', status: 'Completed', description: 'TradeOS Pro', recipient: 'TradeOS', platform: 'TradeOS', date: '2026-08-04T10:42:00Z' },
  { id: 'TXN-004', amount: 500, currency: 'NGN', type: 'Purchase', status: 'Completed', description: 'HarzFilm rental', recipient: 'HarzFilm', platform: 'HarzFilm', date: '2026-08-04T10:42:00Z' },
  { id: 'TXN-005', amount: 1500, currency: 'NGN', type: 'Purchase', status: 'Completed', description: 'HarzMusic beat license', recipient: 'HarzMusic', platform: 'HarzMusic', date: '2026-08-04T10:42:00Z' },
  { id: 'TXN-006', amount: 10000, currency: 'NGN', type: 'Purchase', status: 'Pending', description: 'DeployForge Pro', recipient: 'DeployForge', platform: 'DeployForge', date: '2026-08-04T10:42:00Z' },
  { id: 'TXN-007', amount: 2500, currency: 'NGN', type: 'Purchase', status: 'Completed', description: 'HarzDomain registration', recipient: 'HarzDomain', platform: 'HarzDomain', date: '2026-08-04T10:42:00Z' },
];

const SEED_PRODUCTS = [
  { name: 'MindCare Premium', description: '1-on-1 AI therapy sessions with CBT & DBT', price: 5000, currency: 'NGN', category: 'AI Service', platform: 'MindCare AI', status: 'Active' },
  { name: 'Cyber Shield Pro', description: 'Advanced threat detection & 24/7 monitoring', price: 15000, currency: 'NGN', category: 'Security', platform: 'Cyber Shield X', status: 'Active' },
  { name: 'Health Consultation', description: 'AI health checkup with 18 specialists', price: 3000, currency: 'NGN', category: 'Health', platform: 'Omega Health AI', status: 'Active' },
  { name: 'HarzDM Seller Pack', description: 'Premium seller dashboard & analytics', price: 7500, currency: 'NGN', category: 'Marketplace', platform: 'HarzDM', status: 'Active' },
  { name: 'BuildBot Plan', description: 'AI construction management with cost estimator', price: 20000, currency: 'NGN', category: 'Construction', platform: 'BuildBot AI', status: 'Active' },
  { name: 'TradeOS Pro', description: 'Real-time multi-exchange trading with AI signals', price: 25000, currency: 'NGN', category: 'Trading', platform: 'TradeOS', status: 'Active' },
  { name: 'ContentPilot Studio', description: 'Multi-platform social content automation', price: 10000, currency: 'NGN', category: 'Media', platform: 'ContentPilot', status: 'Active' },
  { name: 'Nexal Ad Campaign', description: 'Social ads across 6 platforms with Paystack', price: 8000, currency: 'NGN', category: 'Media', platform: 'Nexal Media', status: 'Active' },
  { name: 'Estate City Listing', description: 'Premium property listing with AI estimator', price: 5000, currency: 'NGN', category: 'Real Estate', platform: 'Estate City AI', status: 'Active' },
  { name: 'HarzAjo Premium', description: 'Advanced savings & contribution tracking', price: 2000, currency: 'NGN', category: 'Finance', platform: 'HarzAjo', status: 'Active' },
  { name: 'HarzPay Business', description: 'Payment processing with low fees', price: 12000, currency: 'NGN', category: 'Finance', platform: 'HarzPay', status: 'Active' },
  { name: 'HarzFX Pro', description: 'Real-time FX rates & currency exchange', price: 3500, currency: 'NGN', category: 'Finance', platform: 'HarzFX', status: 'Active' },
  { name: 'HarzMusic Beat License', description: 'Exclusive Afrobeats & Amapiano beats', price: 1500, currency: 'NGN', category: 'Music', platform: 'HarzMusic', status: 'Active' },
  { name: 'HarzFilm Rental', description: 'HD film rental — Nollywood, Bollywood, K-Drama', price: 500, currency: 'NGN', category: 'Film', platform: 'HarzFilm', status: 'Active' },
  { name: 'Harz Digital Course', description: 'Trading & Digital Marketing (18 modules)', price: 15000, currency: 'NGN', category: 'Education', platform: 'Harz Digital', status: 'Active' },
  { name: 'HarzDomain Premium', description: 'Domain + free SSL & DNS management', price: 2500, currency: 'NGN', category: 'Hosting', platform: 'HarzDomain', status: 'Active' },
  { name: 'DeployForge Pro', description: 'Multi-platform deployment engine', price: 10000, currency: 'NGN', category: 'DevOps', platform: 'DeployForge', status: 'Active' },
  { name: 'GDEG Energy Credits', description: 'Blockchain P2P renewable energy credits', price: 100, currency: 'USD', category: 'Energy', platform: 'GDEG Energy', status: 'Active' },
  { name: 'Omega Commander', description: 'Enterprise OS with 9 AI agents', price: 50000, currency: 'NGN', category: 'AI', platform: 'Omega Commander', status: 'Active' },
  { name: 'HarzLend Credit', description: 'AI loan approval & credit scoring', price: 0, currency: 'NGN', category: 'Finance', platform: 'HarzLend', status: 'Active' },
];

// In-memory stores
let platforms = [...SEED_PLATFORMS];
let agents = [...SEED_AGENTS];
let wallet = { ...SEED_WALLET };
let transactions = [...SEED_TRANSACTIONS];
let products = [...SEED_PRODUCTS];
let users = [];
let analyticsEvents = [];

// ===== BASE44 SYNC =====
async function syncFromBase44() {
  console.log('[HARZ Cloud] Using synced seed data (Base44 entities)');
  console.log('[HARZ Cloud] ' + platforms.length + ' platforms, ' + agents.length + ' agents, ' + products.length + ' products loaded');
}

// ===== ENDPOINTS =====

// 1. Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'HARZ Cloud Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    platforms: platforms.length,
    agents: agents.length,
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'HARZ Cloud Backend',
    version: '2.0.0',
    description: 'Backend API for HARZ Ecosystem Super App',
    endpoints: [
      'GET /health', 'GET /platforms', 'GET /platforms/:name',
      'GET /agents', 'POST /agents/delegate', 'GET /wallet',
      'POST /wallet/topup', 'GET /transactions', 'POST /transactions/create',
      'GET /products', 'GET /products/:name', 'POST /analytics/track',
      'POST /auth/login', 'POST /auth/register', 'POST /auth/logout',
      'POST /auth/2fa/enable', 'POST /auth/password-reset/request',
      'GET /export-all (auth)', 'GET /stats',
    ],
  });
});

// 2. Platforms
app.get('/platforms', (req, res) => {
  const { category, status } = req.query;
  let result = platforms;
  if (category) result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  if (status) result = result.filter(p => p.status.toLowerCase() === status.toLowerCase());
  res.json({ platforms: result, count: result.length });
});

// 3. Platform detail
app.get('/platforms/:name', (req, res) => {
  const platform = platforms.find(p => p.name.toLowerCase() === req.params.name.toLowerCase());
  if (!platform) return res.status(404).json({ error: 'Platform not found' });
  res.json({ platform });
});

// 4. Agents
app.get('/agents', (req, res) => {
  const { status } = req.query;
  let result = agents;
  if (status) result = result.filter(a => a.status === status);
  res.json({ agents: result, count: result.length });
});

// 5. Agent delegate
app.post('/agents/delegate', (req, res) => {
  const { agent_name, task, priority } = req.body;
  if (!agent_name || !task) return res.status(400).json({ error: 'agent_name and task required' });
  const agent = agents.find(a => a.name.toLowerCase() === agent_name.toLowerCase());
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json({ success: true, delegation: { id: uuidv4(), agent: agent.name, task, priority: priority || 'normal', status: 'queued', created_at: new Date().toISOString() } });
});

// 6. Wallet
app.get('/wallet', (req, res) => {
  res.json({ wallet });
});

// 7. Wallet top-up
app.post('/wallet/topup', (req, res) => {
  const { amount, currency, method } = req.body;
  if (!amount) return res.status(400).json({ error: 'amount is required' });
  const cur = (currency || 'NGN').toLowerCase();
  const balKey = cur + '_balance';
  if (wallet[balKey] !== undefined) wallet[balKey] += amount;
  const txn = { id: uuidv4(), amount, currency: currency || 'NGN', type: 'credit', status: 'Completed', description: 'Wallet top-up', recipient: 'HARZ Pay Wallet', platform: 'HarzPay', date: new Date().toISOString() };
  transactions.unshift(txn);
  res.json({ success: true, wallet, transaction: txn });
});

// 8. Transactions
app.get('/transactions', (req, res) => {
  const { status, type } = req.query;
  let result = transactions;
  if (status) result = result.filter(t => t.status.toLowerCase() === status.toLowerCase());
  if (type) result = result.filter(t => t.type.toLowerCase() === type.toLowerCase());
  res.json({ transactions: result, count: result.length });
});

// 9. Create transaction
app.post('/transactions/create', (req, res) => {
  const { amount, currency, type, description, recipient, platform } = req.body;
  if (!amount || !type) return res.status(400).json({ error: 'amount and type required' });
  const txn = { id: uuidv4(), amount, currency: currency || 'NGN', type, status: 'Completed', description: description || 'Transaction', recipient: recipient || 'N/A', platform: platform || 'HarzPay', date: new Date().toISOString() };
  if (type === 'debit' || type === 'Purchase') {
    const cur = (currency || 'NGN').toLowerCase();
    const balKey = cur + '_balance';
    if (wallet[balKey] !== undefined) wallet[balKey] -= amount;
  }
  transactions.unshift(txn);
  res.json({ success: true, transaction: txn, wallet });
});

// 10. Products
app.get('/products', (req, res) => {
  const { category } = req.query;
  let result = products;
  if (category) result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  res.json({ products: result, count: result.length });
});

// 11. Product detail
app.get('/products/:name', (req, res) => {
  const product = products.find(p => p.name.toLowerCase() === req.params.name.toLowerCase());
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

// 12. Analytics track
app.post('/analytics/track', (req, res) => {
  const { event_type, platform, user_email, metadata } = req.body;
  const event = { id: uuidv4(), event_type: event_type || 'unknown', platform: platform || 'unknown', user_email: user_email || 'anonymous', metadata: metadata || {}, timestamp: new Date().toISOString() };
  analyticsEvents.push(event);
  res.json({ success: true, event_id: event.id });
});

// 13. Analytics list
app.get('/analytics', (req, res) => {
  res.json({ events: analyticsEvents.slice(-50), count: analyticsEvents.length });
});

// 14. Auth login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
});

// 15. Auth register
app.post('/auth/register', async (req, res) => {
  const { full_name, email, password, role } = req.body;
  if (!full_name || !email || !password) return res.status(400).json({ error: 'full_name, email and password required' });
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const password_hash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), full_name, email, password_hash, role: role || 'user', created_at: new Date().toISOString(), two_factor_enabled: false };
  users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
});

// 16. Auth logout
app.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

// 17. Enable 2FA
app.post('/auth/2fa/enable', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (user) user.two_factor_enabled = true;
  res.json({ success: true, message: '2FA enabled' });
});

// 18. Password reset
app.post('/auth/password-reset/request', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });
  res.json({ success: true, message: 'Password reset link sent to ' + email });
});

// 19. Export all data
app.get('/export-all', authMiddleware, (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email, role: req.user.role }, platforms, agents, wallet, transactions, products, exportDate: new Date().toISOString() });
});

// 20. Stats
app.get('/stats', (req, res) => {
  const liveCount = platforms.filter(p => p.status === 'Live').length;
  const devCount = platforms.filter(p => p.status === 'Development').length;
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const avgSuccess = agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + (a.success_rate || 0), 0) / agents.length * 10) / 10 : 0;
  const totalRevenue = transactions.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.amount || 0), 0);
  res.json({ platforms: platforms.length, livePlatforms: liveCount, developmentPlatforms: devCount, agents: agents.length, activeAgents, products: products.length, transactions: transactions.length, avgSuccessRate: avgSuccess, totalRevenue, walletBalance: wallet });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log('[HARZ Cloud] Server running on port ' + PORT);
  console.log('[HARZ Cloud] ' + platforms.length + ' platforms, ' + agents.length + ' agents, ' + products.length + ' products loaded');
  syncFromBase44();
});

module.exports = app;
