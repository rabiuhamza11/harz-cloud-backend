// HARZ Cloud Backend v3.0 — Full Ecosystem API
// All data stored locally — NO Base44 dependency
// Owner: Ahmad Adamu (Rabiu Hamza) — Harz Technology Group

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'harz-cloud-v3-2026';

// ===== MIDDLEWARE =====
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(new Date().toISOString() + ' ' + req.method + ' ' + req.url);
  next();
});

function authRequired(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (!token) return res.status(401).json({ error: 'Auth required' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch(e) { return res.status(401).json({ error: 'Invalid token' }); }
}

// ===== DATA STORE =====
const DATA = {
  "platforms": [
    {
      "name": "HarzPay",
      "icon": "\ud83d\udcb3",
      "category": "Finance",
      "url": "https://harzpay.vercel.app",
      "status": "Live",
      "description": "Payment processing with low fees",
      "revenue": 12000
    },
    {
      "name": "HarzStore",
      "icon": "\ud83d\udecd\ufe0f",
      "category": "Marketplace",
      "url": "https://harz-store.vercel.app",
      "status": "Live",
      "description": "Multi-vendor marketplace platform",
      "revenue": 7500
    },
    {
      "name": "HarzDM",
      "icon": "\ud83d\uded2",
      "category": "Marketplace",
      "url": "https://harzdm-marketplace.vercel.app",
      "status": "Live",
      "description": "Direct marketplace & delivery",
      "revenue": 0
    },
    {
      "name": "MindCare AI",
      "icon": "\ud83e\udde0",
      "category": "AI",
      "url": "https://mindcare-ai.vercel.app",
      "status": "Live",
      "description": "AI-powered mental health platform",
      "revenue": 5000
    },
    {
      "name": "Omega Health AI",
      "icon": "\ud83c\udfe5",
      "category": "Health",
      "url": "https://omega-health-ai.vercel.app",
      "status": "Live",
      "description": "AI health checkup with 18 specialists",
      "revenue": 3000
    },
    {
      "name": "Cyber Shield X",
      "icon": "\ud83d\udee1\ufe0f",
      "category": "Security",
      "url": "https://cyber-shield-x.vercel.app",
      "status": "Live",
      "description": "Advanced threat detection & monitoring",
      "revenue": 15000
    },
    {
      "name": "TradeOS",
      "icon": "\ud83d\udcc8",
      "category": "Trading",
      "url": "https://tradeos.vercel.app",
      "status": "Live",
      "description": "Real-time multi-exchange trading",
      "revenue": 25000
    },
    {
      "name": "BuildBot AI",
      "icon": "\ud83c\udfd7\ufe0f",
      "category": "Construction",
      "url": "https://buildbot-ai-harz.vercel.app",
      "status": "Live",
      "description": "AI construction management",
      "revenue": 20000
    },
    {
      "name": "HarzMusic",
      "icon": "\ud83c\udfb5",
      "category": "Music",
      "url": "https://harz-music.vercel.app",
      "status": "Live",
      "description": "Afrobeats & Amapiano beats marketplace",
      "revenue": 1500
    },
    {
      "name": "HarzFilm",
      "icon": "\ud83c\udfac",
      "category": "Film",
      "url": "https://harz-film.vercel.app",
      "status": "Live",
      "description": "HD film rental \u2014 Nollywood, Bollywood, K-Drama",
      "revenue": 500
    },
    {
      "name": "ContentPilot",
      "icon": "\ud83d\udcdd",
      "category": "Media",
      "url": "https://contentpilot-ai.vercel.app",
      "status": "Live",
      "description": "Multi-platform social content automation",
      "revenue": 10000
    },
    {
      "name": "Nexal Media",
      "icon": "\ud83d\udcf1",
      "category": "Media",
      "url": "https://nexal-media.vercel.app",
      "status": "Live",
      "description": "Social ads across 6 platforms with Paystack",
      "revenue": 8000
    },
    {
      "name": "Estate City AI",
      "icon": "\ud83c\udfe0",
      "category": "Real Estate",
      "url": "https://abuja-estate-city-ai.vercel.app",
      "status": "Live",
      "description": "Premium property listing with AI estimator",
      "revenue": 5000
    },
    {
      "name": "HarzAjo",
      "icon": "\ud83d\udcb0",
      "category": "Finance",
      "url": "https://harzajo.vercel.app",
      "status": "Live",
      "description": "Savings & contribution tracking",
      "revenue": 2000
    },
    {
      "name": "HarzFX",
      "icon": "\ud83d\udcb1",
      "category": "Finance",
      "url": "https://harzfx.vercel.app",
      "status": "Live",
      "description": "Real-time FX rates & currency exchange",
      "revenue": 3500
    },
    {
      "name": "Harz Digital",
      "icon": "\ud83d\udcda",
      "category": "Education",
      "url": "https://harz-digital.vercel.app",
      "status": "Live",
      "description": "Trading & Digital Marketing courses",
      "revenue": 15000
    },
    {
      "name": "HarzDomain",
      "icon": "\ud83c\udf10",
      "category": "Hosting",
      "url": "https://harzdomain.vercel.app",
      "status": "Live",
      "description": "Domain + free SSL & DNS management",
      "revenue": 2500
    },
    {
      "name": "DeployForge",
      "icon": "\ud83d\ude80",
      "category": "DevOps",
      "url": "https://deployforge-harz.vercel.app",
      "status": "Live",
      "description": "Multi-platform deployment engine",
      "revenue": 10000
    },
    {
      "name": "GDEG Energy",
      "icon": "\u26a1",
      "category": "Energy",
      "url": "https://gdeg.vercel.app",
      "status": "Live",
      "description": "Blockchain P2P renewable energy credits",
      "revenue": 100
    },
    {
      "name": "Omega Commander",
      "icon": "\ud83e\udd16",
      "category": "AI",
      "url": "https://omega-commander-ai.vercel.app",
      "status": "Live",
      "description": "Enterprise OS with 9 AI agents",
      "revenue": 50000
    },
    {
      "name": "HarzLend",
      "icon": "\ud83c\udfe6",
      "category": "Finance",
      "url": "https://harzlend.vercel.app",
      "status": "Live",
      "description": "AI loan approval & credit scoring",
      "revenue": 0
    },
    {
      "name": "Harz Construction",
      "icon": "\ud83d\udd28",
      "category": "Construction",
      "url": "https://harz-construction-nd.vercel.app",
      "status": "Live",
      "description": "Construction company website",
      "revenue": 0
    },
    {
      "name": "NEXUS Pro",
      "icon": "\ud83c\udfd7\ufe0f",
      "category": "Construction",
      "url": "https://harz-construction-pro.vercel.app",
      "status": "Live",
      "description": "HARZ Construction Management System",
      "revenue": 0
    },
    {
      "name": "HARZ Ecosystem Dashboard",
      "icon": "\ud83d\udcca",
      "category": "Infrastructure",
      "url": "https://harz-ecosystem-dashboard.vercel.app",
      "status": "Live",
      "description": "Unified Command Center",
      "revenue": 0
    },
    {
      "name": "HARZ Platform",
      "icon": "\ud83c\udfe2",
      "category": "Infrastructure",
      "url": "https://harz-platform.vercel.app",
      "status": "Live",
      "description": "Enterprise showcase across 5 platforms",
      "revenue": 0
    },
    {
      "name": "Omega AI Packager",
      "icon": "\ud83d\udce6",
      "category": "DevOps",
      "url": "https://github.com/rabiuhamza11/omega-ai-packager",
      "status": "Live",
      "description": "Ship AI agent projects like software",
      "revenue": 0
    },
    {
      "name": "HARZ Portfolio",
      "icon": "\ud83d\udccb",
      "category": "Infrastructure",
      "url": "https://rabiuhamza11.github.io/harz-portfolio",
      "status": "Live",
      "description": "Official Portfolio & Ecosystem Showcase",
      "revenue": 0
    },
    {
      "name": "HARZ Super App",
      "icon": "\u26a1",
      "category": "Infrastructure",
      "url": "https://rabiuhamza11.github.io/harz-portfolio/harz-super-app-v5.html",
      "status": "Live",
      "description": "Unified ecosystem app with 57+ platforms",
      "revenue": 0
    },
    {
      "name": "Omega Commander Bot",
      "icon": "\ud83e\udd16",
      "category": "AI",
      "url": "https://github.com/rabiuhamza11/omega-commander-bot",
      "status": "Live",
      "description": "Telegram Bot",
      "revenue": 0
    },
    {
      "name": "FluxDeploy",
      "icon": "\ud83d\udd04",
      "category": "DevOps",
      "url": "https://github.com/rabiuhamza11/fluxdeploy-test",
      "status": "Live",
      "description": "Multi-platform deployment system",
      "revenue": 0
    },
    {
      "name": "HARZ Cloud",
      "icon": "\u2601\ufe0f",
      "category": "Infrastructure",
      "url": "https://harz-cloud-backend.onrender.com",
      "status": "Live",
      "description": "HARZ Cloud Backend v3.0 \u2014 Full ecosystem API",
      "revenue": 0
    },
    {
      "name": "HarzGit",
      "icon": "\ud83d\udce6",
      "category": "DevOps",
      "url": "https://rabiuhamza11.github.io/harz-portfolio/harzgit.html",
      "status": "Live",
      "description": "GitHub-like code hosting for HARZ Ecosystem",
      "revenue": 0
    },
    {
      "name": "HARZ Edge",
      "icon": "\ud83c\udf10",
      "category": "Infrastructure",
      "url": "https://harz-edge.vercel.app",
      "status": "Development",
      "description": "DNS, CDN, WAF & Edge Computing Platform",
      "revenue": 0
    },
    {
      "name": "HARZ AI OS",
      "icon": "\ud83d\udda5\ufe0f",
      "category": "AI",
      "url": "https://harz-ai-os.vercel.app",
      "status": "Development",
      "description": "Next-gen unified ecosystem interface",
      "revenue": 0
    },
    {
      "name": "HARZ AI Chat",
      "icon": "\ud83d\udcac",
      "category": "AI",
      "url": "https://harz-ai-chat.vercel.app",
      "status": "Development",
      "description": "Qwen-powered web chat",
      "revenue": 0
    },
    {
      "name": "HARZ Ecosystem App",
      "icon": "\ud83d\udcf1",
      "category": "Infrastructure",
      "url": "https://github.com/rabiuhamza11/harz-ecosystem-app",
      "status": "Development",
      "description": "Flutter mobile app for Harz Ecosystem",
      "revenue": 0
    },
    {
      "name": "Omega Infinity",
      "icon": "\ud83e\udd16",
      "category": "AI",
      "url": "https://omega-infinity-dashboard.vercel.app",
      "status": "Live",
      "description": "Enterprise AI Orchestration Platform",
      "revenue": 0
    },
    {
      "name": "Omega Content AI",
      "icon": "\ud83c\udfac",
      "category": "Media",
      "url": "https://omega-content-ai.vercel.app",
      "status": "Live",
      "description": "Autonomous AI content studio",
      "revenue": 0
    },
    {
      "name": "EduWealth AI",
      "icon": "\ud83c\udf93",
      "category": "Education",
      "url": "https://eduwealth-ai.vercel.app",
      "status": "Live",
      "description": "AI-Powered Education Platform with 18 AI Tutors",
      "revenue": 0
    },
    {
      "name": "HarzBuild AI",
      "icon": "\ud83c\udfd7\ufe0f",
      "category": "Construction",
      "url": "https://harzbuild-ai.vercel.app",
      "status": "Live",
      "description": "AI construction platform",
      "revenue": 0
    },
    {
      "name": "AI Creative Suite",
      "icon": "\ud83c\udfa8",
      "category": "AI",
      "url": "https://ai-creative-suite-deployment.vercel.app",
      "status": "Live",
      "description": "AI creative tools suite",
      "revenue": 0
    },
    {
      "name": "HostMaster AI",
      "icon": "\ud83c\udfe0",
      "category": "Hosting",
      "url": "https://hostmaster-ai.vercel.app",
      "status": "Live",
      "description": "Domain registration, cloud hosting & AI website builder",
      "revenue": 0
    },
    {
      "name": "GDEG Dashboard",
      "icon": "\ud83d\udcca",
      "category": "Energy",
      "url": "https://gdeg-dashboard.vercel.app",
      "status": "Live",
      "description": "GDEG blockchain energy trading dashboard",
      "revenue": 0
    },
    {
      "name": "Rabiu Portfolio",
      "icon": "\ud83d\udc64",
      "category": "Infrastructure",
      "url": "https://rabiu-portfolio.vercel.app",
      "status": "Live",
      "description": "Rabiu Hamza \u2014 Software Architect & Founder",
      "revenue": 0
    },
    {
      "name": "HarzDM Marketplace",
      "icon": "\ud83d\uded2",
      "category": "Marketplace",
      "url": "https://harzdm-marketplace.vercel.app",
      "status": "Live",
      "description": "Global Digital Marketplace",
      "revenue": 0
    },
    {
      "name": "HarzDM Checkout",
      "icon": "\ud83d\udcb3",
      "category": "Marketplace",
      "url": "https://harzdm-checkout.vercel.app",
      "status": "Live",
      "description": "Checkout flow for HarzDM",
      "revenue": 0
    },
    {
      "name": "HarzDM Marketing Hub",
      "icon": "\ud83d\udce3",
      "category": "Marketing",
      "url": "https://harzdm-marketing-hub.vercel.app",
      "status": "Live",
      "description": "Marketing hub for HarzDM sellers",
      "revenue": 0
    },
    {
      "name": "TradeOS Dashboard",
      "icon": "\ud83d\udcca",
      "category": "Trading",
      "url": "https://tradeos-dashboard.vercel.app",
      "status": "Live",
      "description": "Trading dashboard",
      "revenue": 0
    },
    {
      "name": "Harz Wholesale",
      "icon": "\ud83d\udce6",
      "category": "Marketplace",
      "url": "https://harzwholesale.vercel.app",
      "status": "Live",
      "description": "Wholesale marketplace",
      "revenue": 0
    }
  ],
  "repositories": [
    {
      "name": "deployforge",
      "githubUrl": "https://github.com/rabiuhamza11/deployforge",
      "description": "DeployForge \u2014 multi-platform deployment engine (GitHub, Vercel, Render, Netlify, Railway) powering the Harz ecosystem",
      "language": "TypeScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 15,
      "updatedAt": "2026-08-04T12:01:47Z",
      "topics": [
        "automation",
        "ci-cd",
        "deno",
        "deployment",
        "developer-tools",
        "devops",
        "github-api",
        "serverless",
        "typescript",
        "vercel"
      ],
      "license": "None"
    },
    {
      "name": "harz-portfolio",
      "githubUrl": "https://github.com/rabiuhamza11/harz-portfolio",
      "description": "Harz Digital Services \u2014 Official Portfolio & Ecosystem Showcase",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 4151,
      "updatedAt": "2026-08-04T11:47:41Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-cloud-backend",
      "githubUrl": "https://github.com/rabiuhamza11/harz-cloud-backend",
      "description": "HARZ Cloud Backend v2.0 \u2014 Express.js API for HARZ Ecosystem Super App",
      "language": "JavaScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 0,
      "updatedAt": "2026-08-04T11:39:11Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-cloud",
      "githubUrl": "https://github.com/rabiuhamza11/harz-cloud",
      "description": "HARZ Cloud \u2014 Independent backend infrastructure on Render + Supabase",
      "language": "JavaScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 107,
      "updatedAt": "2026-08-04T10:27:35Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-edge",
      "githubUrl": "https://github.com/rabiuhamza11/harz-edge",
      "description": "HARZ Edge \u2014 DNS, CDN, WAF & Edge Computing Platform",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 9,
      "updatedAt": "2026-08-04T08:41:27Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-store",
      "githubUrl": "https://github.com/rabiuhamza11/harz-store",
      "description": "HARZ Store \u2014 Unified digital product marketplace with 468+ products",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 1,
      "updatedAt": "2026-08-04T08:18:58Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-ai-os",
      "githubUrl": "https://github.com/rabiuhamza11/harz-ai-os",
      "description": "HARZ AI OS v2 \u2014 Next-gen unified ecosystem interface",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 1,
      "updatedAt": "2026-08-04T08:18:38Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "nexal-media",
      "githubUrl": "https://github.com/rabiuhamza11/nexal-media",
      "description": "Social Media Ad Publishing Platform \u2014 Facebook, Instagram, TikTok, YouTube, X, LinkedIn \u2014 Powered by Paystack",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 4,
      "updatedAt": "2026-08-04T08:18:38Z",
      "topics": [
        "advertising",
        "facebook",
        "instagram",
        "marketing",
        "nigeria",
        "paystack",
        "saas",
        "social-media",
        "tiktok"
      ],
      "license": "None"
    },
    {
      "name": "hostmaster-ai",
      "githubUrl": "https://github.com/rabiuhamza11/hostmaster-ai",
      "description": "Enterprise Domain Registration, Cloud Hosting & AI Website Builder \u2014 Harz Technology Group",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 5,
      "updatedAt": "2026-08-04T08:18:07Z",
      "topics": [
        "ai",
        "domain-registration",
        "nestjs",
        "nextjs",
        "nigeria",
        "paystack",
        "saas",
        "stripe",
        "web-hosting",
        "website-builder"
      ],
      "license": "None"
    },
    {
      "name": "harzdomain",
      "githubUrl": "https://github.com/rabiuhamza11/harzdomain",
      "description": "HARZ Domains \u2014 Retail & Wholesale Domain Platform with Real-time Domain Search",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 12,
      "updatedAt": "2026-08-04T08:09:28Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "Apex-ai",
      "githubUrl": "https://github.com/rabiuhamza11/Apex-ai",
      "description": "Https//GitHub.com/rabiuhamza11/apex-ai-website",
      "language": "N/A",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 6,
      "updatedAt": "2026-08-02T22:03:01Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "abuja-estate-city-ai",
      "githubUrl": "https://github.com/rabiuhamza11/abuja-estate-city-ai",
      "description": "AI-Powered Smart Real Estate & Property Marketplace for Abuja, Nigeria \u2014 Properties, Professionals, Materials, AI Cost Estimator",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 17,
      "updatedAt": "2026-08-02T20:38:22Z",
      "topics": [
        "abuja",
        "ai",
        "construction",
        "nextjs",
        "nigeria",
        "paystack",
        "property",
        "real-estate",
        "saas",
        "vercel"
      ],
      "license": "None"
    },
    {
      "name": "harz-digital",
      "githubUrl": "https://github.com/rabiuhamza11/harz-digital",
      "description": "HARZ Digital - Learn Trading & Digital Marketing",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 436,
      "updatedAt": "2026-08-02T20:07:02Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "fluxdeploy-v4-test",
      "githubUrl": "https://github.com/rabiuhamza11/fluxdeploy-v4-test",
      "description": "FluxDeploy v4 test deployment",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 2,
      "updatedAt": "2026-08-02T19:57:44Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "omega-infinity-dashboard",
      "githubUrl": "https://github.com/rabiuhamza11/omega-infinity-dashboard",
      "description": "OMEGA INFINITY 1000 Enterprise - Next.js dashboard (agents, chat, deployments, projects, settings)",
      "language": "TypeScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 49,
      "updatedAt": "2026-08-02T19:57:37Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harzbuild-ai",
      "githubUrl": "https://github.com/rabiuhamza11/harzbuild-ai",
      "description": "ai construction platform ",
      "language": "N/A",
      "stars": 1,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 1,
      "updatedAt": "2026-08-02T19:57:34Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-construction-nd",
      "githubUrl": "https://github.com/rabiuhamza11/harz-construction-nd",
      "description": "Harz Construction ND - construction company website",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 351,
      "updatedAt": "2026-08-02T19:57:33Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "Ai-creative-suite",
      "githubUrl": "https://github.com/rabiuhamza11/Ai-creative-suite",
      "description": "Https://GitHub.com/rabiuhamza11/ai-crestive-suite",
      "language": "TypeScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 788,
      "updatedAt": "2026-08-02T19:57:33Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "omega-ai-packager-docs",
      "githubUrl": "https://github.com/rabiuhamza11/omega-ai-packager-docs",
      "description": "OMEGA AI Packager documentation site",
      "language": "HTML",
      "stars": 1,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 7,
      "updatedAt": "2026-08-02T19:57:32Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "omega-ai-packager",
      "githubUrl": "https://github.com/rabiuhamza11/omega-ai-packager",
      "description": "Ship AI agent projects like software: package, deploy anywhere (GitHub/Vercel/Render/Netlify/Railway), collaborate via team workspaces, and search your own codebase with built-in hybrid RAG \u2014 no external API keys needed.",
      "language": "TypeScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 59,
      "updatedAt": "2026-08-02T19:57:32Z",
      "topics": [
        "ai-agents",
        "cli",
        "deployment",
        "developer-tools",
        "devops",
        "llm",
        "observability",
        "rag",
        "typescript",
        "workspace-management"
      ],
      "license": "None"
    },
    {
      "name": "fluxdeploy-test",
      "githubUrl": "https://github.com/rabiuhamza11/fluxdeploy-test",
      "description": "Multi-platform deployment test from FluxDeploy",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 2,
      "updatedAt": "2026-08-02T19:57:32Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "rabiu-portfolio",
      "githubUrl": "https://github.com/rabiuhamza11/rabiu-portfolio",
      "description": "Rabiu Hamza \u2014 Software Architect & Founder | Enterprise Portfolio",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 9,
      "updatedAt": "2026-08-02T19:57:31Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "fluxdeploy-test-v2",
      "githubUrl": "https://github.com/rabiuhamza11/fluxdeploy-test-v2",
      "description": "Multi-platform retest v2",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 2,
      "updatedAt": "2026-08-02T19:57:31Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "contentpilot-ai",
      "githubUrl": "https://github.com/rabiuhamza11/contentpilot-ai",
      "description": "ContentPilot - AI Content Agent dashboard for multi-platform social content operations",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 17,
      "updatedAt": "2026-08-02T19:57:29Z",
      "topics": [
        "ai",
        "content-creation",
        "paystack",
        "saas",
        "social-media",
        "stripe",
        "video-generation"
      ],
      "license": "None"
    },
    {
      "name": "rabiuhamza11",
      "githubUrl": "https://github.com/rabiuhamza11/rabiuhamza11",
      "description": "GitHub Profile README",
      "language": "N/A",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 5,
      "updatedAt": "2026-08-02T19:57:28Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "gdeg",
      "githubUrl": "https://github.com/rabiuhamza11/gdeg",
      "description": "GDEG \u2014 Global Decentralized Energy Grid | Blockchain P2P renewable energy trading",
      "language": "JavaScript",
      "stars": 1,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 41,
      "updatedAt": "2026-08-02T19:57:23Z",
      "topics": [
        "blockchain",
        "decentralized",
        "defi",
        "energy",
        "ethereum",
        "p2p-trading",
        "renewable-energy",
        "smart-contracts",
        "solidity",
        "web3"
      ],
      "license": "None"
    },
    {
      "name": "omega-master",
      "githubUrl": "https://github.com/rabiuhamza11/omega-master",
      "description": "OMEGA MASTER \u2014 Supreme AI Command Hub for the Harz Ecosystem",
      "language": "JavaScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 13,
      "updatedAt": "2026-08-02T19:57:22Z",
      "topics": [
        "ai",
        "ecosystem",
        "harz",
        "master",
        "nigeria",
        "nodejs",
        "omega",
        "orchestration"
      ],
      "license": "MIT"
    },
    {
      "name": "harz-platform",
      "githubUrl": "https://github.com/rabiuhamza11/harz-platform",
      "description": "Harz Platform \u2014 Enterprise showcase deployed across 5 platforms",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 6,
      "updatedAt": "2026-08-02T19:57:22Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-construction-pro",
      "githubUrl": "https://github.com/rabiuhamza11/harz-construction-pro",
      "description": "NEXUS Pro \u2014 HARZ Construction Management System",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 65,
      "updatedAt": "2026-08-02T19:57:21Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harzfx",
      "githubUrl": "https://github.com/rabiuhamza11/harzfx",
      "description": "Harz Ecosystem \u2014 harzfx",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 4,
      "updatedAt": "2026-08-02T19:57:18Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "omega-content-ai",
      "githubUrl": "https://github.com/rabiuhamza11/omega-content-ai",
      "description": "OMEGA CONTENT AI AGENT \u2014 Fully autonomous AI content studio. Manages content production, publishing, analytics, and monetization across YouTube, TikTok, Instagram, Facebook, X, LinkedIn, and more.",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 9,
      "updatedAt": "2026-08-02T19:57:16Z",
      "topics": [
        "ai",
        "ai-content-studio",
        "analytics",
        "autonomous-agents",
        "content-automation",
        "content-creation",
        "harz-ecosystem",
        "instagram",
        "monetization",
        "multi-platform",
        "omega",
        "social-media",
        "tiktok",
        "video-production",
        "youtube"
      ],
      "license": "MIT"
    },
    {
      "name": "omega-health-ai",
      "githubUrl": "https://github.com/rabiuhamza11/omega-health-ai",
      "description": "OMEGA HEALTH AI \u2014 Personalized AI-Powered Health Platform with 18 specialized AI agents, symptom checker, nutrition planning, fitness coaching, mental wellness, and more",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 9,
      "updatedAt": "2026-08-02T19:57:15Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harzdm-marketplace",
      "githubUrl": "https://github.com/rabiuhamza11/harzdm-marketplace",
      "description": "HarzDM \u2014 Global Digital Marketplace for digital products with multi-seller support, Stripe payments, and real-time seller dashboard",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 15,
      "updatedAt": "2026-08-02T19:57:14Z",
      "topics": [
        "digital-products",
        "ecommerce",
        "marketplace",
        "multi-vendor",
        "saas",
        "stripe",
        "typescript"
      ],
      "license": "None"
    },
    {
      "name": "omega-commander-ai",
      "githubUrl": "https://github.com/rabiuhamza11/omega-commander-ai",
      "description": "OMEGA Business Commander AI \u2014 Autonomous enterprise OS with 9 AI agents, approval workflows, pluggable tools. Harz Digital Services RC 321424.",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 12,
      "updatedAt": "2026-08-02T19:57:13Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "mindcare-ai",
      "githubUrl": "https://github.com/rabiuhamza11/mindcare-ai",
      "description": "mindcare-ai",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 5,
      "updatedAt": "2026-08-02T19:57:12Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harzajo",
      "githubUrl": "https://github.com/rabiuhamza11/harzajo",
      "description": "Harz Ecosystem \u2014 harzajo",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 5,
      "updatedAt": "2026-08-02T19:57:12Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harzpay",
      "githubUrl": "https://github.com/rabiuhamza11/harzpay",
      "description": "Harz Ecosystem \u2014 harzpay",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 4,
      "updatedAt": "2026-08-02T19:57:11Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harzlend",
      "githubUrl": "https://github.com/rabiuhamza11/harzlend",
      "description": "Harz Ecosystem \u2014 harzlend",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 5,
      "updatedAt": "2026-08-02T19:57:10Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-music",
      "githubUrl": "https://github.com/rabiuhamza11/harz-music",
      "description": "HarzMusic \u2014 African Music Marketplace. Buy & sell Afrobeats, Amapiano, Gospel beats online. 20% platform commission.",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 28,
      "updatedAt": "2026-08-02T19:57:07Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-ecosystem-dashboard",
      "githubUrl": "https://github.com/rabiuhamza11/harz-ecosystem-dashboard",
      "description": "Unified Command Center for all 20 Harz Ecosystem platforms",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 4,
      "updatedAt": "2026-08-02T19:57:07Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "cyber-shield-x",
      "githubUrl": "https://github.com/rabiuhamza11/cyber-shield-x",
      "description": "cyber-shield-x",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 5,
      "updatedAt": "2026-08-02T19:57:07Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "omega-infinity-1000",
      "githubUrl": "https://github.com/rabiuhamza11/omega-infinity-1000",
      "description": "OMEGA INFINITY 1000 \u2014 Enterprise AI Orchestration Platform with Agent SDK, multi-agent workflows, deployment automation, and Next.js dashboard",
      "language": "TypeScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 122,
      "updatedAt": "2026-08-02T19:57:07Z",
      "topics": [
        "ai-agents",
        "automation",
        "enterprise",
        "monorepo",
        "multi-agent-systems",
        "nestjs",
        "nextjs",
        "orchestration",
        "prisma",
        "typescript"
      ],
      "license": "None"
    },
    {
      "name": "omega-commander-bot",
      "githubUrl": "https://github.com/rabiuhamza11/omega-commander-bot",
      "description": "OMEGA Business Commander AI \u2014 Standalone Telegram Bot",
      "language": "JavaScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 44,
      "updatedAt": "2026-08-02T19:57:03Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "eduwealth-ai",
      "githubUrl": "https://github.com/rabiuhamza11/eduwealth-ai",
      "description": "EduWealth AI \u2014 Global AI-Powered Education Platform | 18 AI Tutors, 7 Core Modules, 9+ Revenue Streams | Part of Harz Ecosystem",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 9,
      "updatedAt": "2026-08-02T19:57:03Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-ecosystem-app",
      "githubUrl": "https://github.com/rabiuhamza11/harz-ecosystem-app",
      "description": "Flutter mobile app for Harz Ecosystem \u2014 20 platforms in one app",
      "language": "Dart",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 5,
      "updatedAt": "2026-08-02T19:57:03Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-film",
      "githubUrl": "https://github.com/rabiuhamza11/harz-film",
      "description": "HarzFilm \u2014 Global Film Marketplace. Buy, rent & stream films worldwide. Nollywood, Bollywood, Korean Drama, European Cinema. 20% commission.",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 10,
      "updatedAt": "2026-08-02T19:57:02Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "buildbot-ai",
      "githubUrl": "https://github.com/rabiuhamza11/buildbot-ai",
      "description": "",
      "language": "JavaScript",
      "stars": 1,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 78,
      "updatedAt": "2026-08-02T19:56:58Z",
      "topics": [
        "ai",
        "construction",
        "cost-estimation",
        "nigeria",
        "paystack",
        "proptech",
        "saas"
      ],
      "license": "MIT"
    },
    {
      "name": "maganu-agent",
      "githubUrl": "https://github.com/rabiuhamza11/maganu-agent",
      "description": "Maganu \u2014 Custom AI Agent powered by Claude, built for Rabiu Hamza | Harz Ecosystem",
      "language": "JavaScript",
      "stars": 1,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 393,
      "updatedAt": "2026-08-02T19:56:56Z",
      "topics": [
        "ai-agent",
        "claude-ai",
        "harz-ecosystem",
        "maganu",
        "nodejs",
        "twilio",
        "whatsapp-bot"
      ],
      "license": "None"
    },
    {
      "name": "tradeos",
      "githubUrl": "https://github.com/rabiuhamza11/tradeos",
      "description": "Enterprise AI Trading Platform \u2014 Multi-exchange, real-time WebSocket streaming, AI agents, portfolio management",
      "language": "TypeScript",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 239,
      "updatedAt": "2026-08-02T19:56:56Z",
      "topics": [
        "ai-agents",
        "cryptocurrency",
        "fintech",
        "nestjs",
        "nextjs",
        "portfolio-management",
        "prisma",
        "trading",
        "typescript",
        "websocket"
      ],
      "license": "MIT"
    },
    {
      "name": "HaulHub",
      "githubUrl": "https://github.com/rabiuhamza11/HaulHub",
      "description": "HARZ Venture Studio \u2014 HaulHub",
      "language": "N/A",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 1,
      "updatedAt": "2026-08-02T19:56:55Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "rabiuhamza11-abuja-estatehub-mvp",
      "githubUrl": "https://github.com/rabiuhamza11/rabiuhamza11-abuja-estatehub-mvp",
      "description": "",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 52,
      "updatedAt": "2026-08-02T19:56:54Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "LegalDoc-AI",
      "githubUrl": "https://github.com/rabiuhamza11/LegalDoc-AI",
      "description": "HARZ Venture Studio \u2014 LegalDoc-AI",
      "language": "N/A",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 1,
      "updatedAt": "2026-08-02T19:56:52Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "FixConnect",
      "githubUrl": "https://github.com/rabiuhamza11/FixConnect",
      "description": "HARZ Venture Studio \u2014 FixConnect",
      "language": "N/A",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 1,
      "updatedAt": "2026-08-02T19:56:51Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "SolarFund",
      "githubUrl": "https://github.com/rabiuhamza11/SolarFund",
      "description": "HARZ Venture Studio \u2014 SolarFund",
      "language": "N/A",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 1,
      "updatedAt": "2026-08-02T19:56:49Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "NaijaBox",
      "githubUrl": "https://github.com/rabiuhamza11/NaijaBox",
      "description": "HARZ Venture Studio \u2014 NaijaBox",
      "language": "N/A",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 1,
      "updatedAt": "2026-08-02T19:56:48Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-deploy-test",
      "githubUrl": "https://github.com/rabiuhamza11/harz-deploy-test",
      "description": "Test repo created by DeployForge v2.0",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 2,
      "updatedAt": "2026-08-02T19:56:47Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "rabiuhamza11.github.io",
      "githubUrl": "https://github.com/rabiuhamza11/rabiuhamza11.github.io",
      "description": "HARZ Digital Services \u2014 Official Site",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 6,
      "updatedAt": "2026-08-02T19:56:44Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harz-ai-chat",
      "githubUrl": "https://github.com/rabiuhamza11/harz-ai-chat",
      "description": "HARZ AI Chat \u2014 Qwen-powered web chat",
      "language": "HTML",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 266,
      "updatedAt": "2026-08-02T19:56:43Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "Ai-creative-suit",
      "githubUrl": "https://github.com/rabiuhamza11/Ai-creative-suit",
      "description": "Https://GitHub.com/rabiuhamza11/ai-creative-suite",
      "language": "N/A",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 0,
      "updatedAt": "2026-07-05T03:59:12Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "Main",
      "githubUrl": "https://github.com/rabiuhamza11/Main",
      "description": "Https//GitHub.com/rabiuhamza11/ai-crestive-suite",
      "language": "N/A",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 0,
      "updatedAt": "2026-07-05T03:52:50Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "fluxdeploy",
      "githubUrl": "https://github.com/rabiuhamza11/fluxdeploy",
      "description": "https://GitHub.com/rabiuhamza11/fluxdeploy",
      "language": "N/A",
      "stars": 1,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 0,
      "updatedAt": "2026-06-30T06:32:12Z",
      "topics": [],
      "license": "None"
    },
    {
      "name": "harzconstructionnd",
      "githubUrl": "https://github.com/rabiuhamza11/harzconstructionnd",
      "description": "https:/GitHub.com/rabiuhamza11/harzconstructionnd",
      "language": "N/A",
      "stars": 1,
      "forks": 0,
      "openIssues": 0,
      "defaultBranch": "main",
      "visibility": "public",
      "owner": "rabiuhamza11",
      "size": 0,
      "updatedAt": "2026-06-30T06:32:07Z",
      "topics": [],
      "license": "None"
    }
  ],
  "agents": [
    {
      "name": "Magani",
      "role": "Ecosystem Assistant",
      "description": "Main HARZ ecosystem assistant",
      "icon": "\ud83e\udd16",
      "status": "active",
      "successRate": 97.2,
      "tasksCompleted": 5800,
      "platform": "Harz Ecosystem",
      "specialties": [
        "orchestration",
        "deployment",
        "analytics"
      ]
    },
    {
      "name": "CyberShield Agent",
      "role": "Security Monitor",
      "description": "Cyber defense agent with 37 specialist sub-agents",
      "icon": "\ud83d\udee1\ufe0f",
      "status": "active",
      "successRate": 95.8,
      "tasksCompleted": 3400,
      "platform": "Cyber Shield X",
      "specialties": [
        "threat-detection",
        "monitoring"
      ]
    },
    {
      "name": "Omega Commander",
      "role": "Enterprise Manager",
      "description": "Autonomous enterprise OS with 9 AI agents",
      "icon": "\ud83c\udfe2",
      "status": "active",
      "successRate": 96.1,
      "tasksCompleted": 2100,
      "platform": "Omega Infinity",
      "specialties": [
        "enterprise",
        "automation"
      ]
    },
    {
      "name": "MindCare Agent",
      "role": "Mental Health Assistant",
      "description": "Mental health companion with CBT, DBT, mindfulness",
      "icon": "\ud83e\udde0",
      "status": "active",
      "successRate": 95.9,
      "tasksCompleted": 1240,
      "platform": "MindCare AI",
      "specialties": [
        "mental-health",
        "cbt"
      ]
    },
    {
      "name": "EduWealth Agent",
      "role": "Education Tutor",
      "description": "Education platform with 18 AI tutors",
      "icon": "\ud83d\udcda",
      "status": "active",
      "successRate": 94.8,
      "tasksCompleted": 750,
      "platform": "Harz Digital",
      "specialties": [
        "education",
        "tutoring"
      ]
    },
    {
      "name": "Health Agent",
      "role": "Health Advisor",
      "description": "Health platform with 18 medical specialists",
      "icon": "\ud83c\udfe5",
      "status": "active",
      "successRate": 94.2,
      "tasksCompleted": 890,
      "platform": "Omega Health AI",
      "specialties": [
        "health",
        "medical"
      ]
    },
    {
      "name": "Content Agent",
      "role": "Content Producer",
      "description": "AI content production and publishing",
      "icon": "\ud83c\udfac",
      "status": "active",
      "successRate": 93.5,
      "tasksCompleted": 560,
      "platform": "Omega Content AI",
      "specialties": [
        "content",
        "social-media"
      ]
    }
  ],
  "wallet": {
    "ngnBalance": 125000,
    "usdBalance": 350,
    "gdegBalance": 5000,
    "usdtBalance": 120,
    "paymentMethods": [
      {
        "type": "UBA Transfer",
        "details": "2034326424",
        "isActive": true
      },
      {
        "type": "Paystack",
        "details": "Card Payment",
        "isActive": true
      },
      {
        "type": "GDEG Token",
        "details": "1 = $0.01",
        "isActive": true
      },
      {
        "type": "USDT TRC20",
        "details": "Crypto",
        "isActive": true
      }
    ]
  },
  "commits": [
    {
      "sha": "ee19294",
      "message": "Vercel: Fix vercel.json + auto-deploy + Railway",
      "author": "rabiuhamza11",
      "date": "2026-08-04T12:01:06Z",
      "repo": "deployforge"
    },
    {
      "sha": "e7afe15",
      "message": "Add Vercel auto-deploy setup guide",
      "author": "rabiuhamza11",
      "date": "2026-08-04T11:54:39Z",
      "repo": "deployforge"
    },
    {
      "sha": "0bd7320",
      "message": "Auto-deploy: Vercel + GitHub Pages CI/CD",
      "author": "rabiuhamza11",
      "date": "2026-08-04T11:53:15Z",
      "repo": "deployforge"
    },
    {
      "sha": "bd4edc2",
      "message": "Fix: Render platform name bug + vercel.json",
      "author": "rabiuhamza11",
      "date": "2026-08-04T11:20:03Z",
      "repo": "deployforge"
    },
    {
      "sha": "803a221",
      "message": "DeployForge Dashboard \u2014 Full deployment UI",
      "author": "rabiuhamza11",
      "date": "2026-08-04T11:16:26Z",
      "repo": "deployforge"
    }
  ]
};

// ===== HEALTH =====
app.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    version: '3.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    counts: {
      platforms: DATA.platforms.length,
      repositories: DATA.repositories.length,
      agents: DATA.agents.length,
      commits: DATA.commits.length
    }
  });
});

// ===== ROOT =====
app.get('/', (req, res) => {
  res.json({
    name: 'HARZ Cloud Backend',
    version: '3.0.0',
    owner: 'Harz Technology Group',
    status: 'operational',
    endpoints: [
      'GET /health',
      'GET /api/stats',
      'GET /api/platforms',
      'GET /api/platforms/:name',
      'GET /api/repositories',
      'GET /api/repositories/:name',
      'GET /api/agents',
      'GET /api/agents/:name',
      'GET /api/wallet',
      'POST /api/wallet/transfer',
      'GET /api/transactions',
      'GET /api/commits',
      'GET /api/issues',
      'POST /api/issues',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/user/profile',
      'GET /api/analytics/events',
      'POST /api/sync/github'
    ]
  });
});

// ===== STATS =====
app.get('/api/stats', (req, res) => {
  const live = DATA.platforms.filter(p => p.status === 'Live').length;
  const dev = DATA.platforms.filter(p => p.status === 'Development').length;
  const totalRev = DATA.platforms.reduce((s, p) => s + (p.revenue || 0), 0);
  const totalTasks = DATA.agents.reduce((s, a) => s + (a.tasksCompleted || 0), 0);
  
  const byCat = {};
  DATA.platforms.forEach(p => { byCat[p.category] = (byCat[p.category] || 0) + 1; });
  
  const langCount = {};
  DATA.repositories.forEach(r => { const l = r.language || 'N/A'; langCount[l] = (langCount[l] || 0) + 1; });
  
  res.json({
    platforms: { total: DATA.platforms.length, live, development: dev, byCategory: byCat },
    repositories: { total: DATA.repositories.length, languages: langCount },
    agents: {
      total: DATA.agents.length,
      active: DATA.agents.filter(a => a.status === 'active').length,
      totalTasks,
      avgSuccess: (DATA.agents.reduce((s, a) => s + (a.successRate || 0), 0) / DATA.agents.length).toFixed(1)
    },
    wallet: DATA.wallet,
    revenue: { total: totalRev },
    commits: DATA.commits.length,
    timestamp: new Date().toISOString()
  });
});

// ===== PLATFORMS =====
app.get('/api/platforms', (req, res) => {
  let result = DATA.platforms;
  if (req.query.category) result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  if (req.query.status) result = result.filter(p => p.status.toLowerCase() === req.query.status.toLowerCase());
  res.json({ count: result.length, platforms: result });
});

app.get('/api/platforms/:name', (req, res) => {
  const p = DATA.platforms.find(p => p.name.toLowerCase() === req.params.name.toLowerCase());
  if (!p) return res.status(404).json({ error: 'Platform not found' });
  res.json(p);
});

app.post('/api/platforms', authRequired, (req, res) => {
  DATA.platforms.push(req.body);
  res.status(201).json(req.body);
});

app.put('/api/platforms/:name', authRequired, (req, res) => {
  const idx = DATA.platforms.findIndex(p => p.name.toLowerCase() === req.params.name.toLowerCase());
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  DATA.platforms[idx] = { ...DATA.platforms[idx], ...req.body };
  res.json(DATA.platforms[idx]);
});

// ===== REPOSITORIES =====
app.get('/api/repositories', (req, res) => {
  let result = DATA.repositories;
  if (req.query.language) result = result.filter(r => (r.language || '').toLowerCase() === req.query.language.toLowerCase());
  res.json({ count: result.length, repositories: result });
});

app.get('/api/repositories/:name', (req, res) => {
  const r = DATA.repositories.find(r => r.name.toLowerCase() === req.params.name.toLowerCase());
  if (!r) return res.status(404).json({ error: 'Repository not found' });
  res.json(r);
});

// ===== AGENTS =====
app.get('/api/agents', (req, res) => {
  res.json({ count: DATA.agents.length, agents: DATA.agents });
});

app.get('/api/agents/:name', (req, res) => {
  const a = DATA.agents.find(a => a.name.toLowerCase() === req.params.name.toLowerCase());
  if (!a) return res.status(404).json({ error: 'Agent not found' });
  res.json(a);
});

// ===== WALLET =====
app.get('/api/wallet', (req, res) => {
  res.json(DATA.wallet);
});

app.post('/api/wallet/transfer', authRequired, (req, res) => {
  const { amount, currency, recipient, description } = req.body;
  if (!amount || !currency) return res.status(400).json({ error: 'Amount and currency required' });
  const tx = {
    id: 'tx_' + Date.now(),
    amount, currency, recipient: recipient || '',
    description: description || '',
    status: 'completed',
    timestamp: new Date().toISOString()
  };
  DATA.transactions = DATA.transactions || [];
  DATA.transactions.push(tx);
  if (currency === 'NGN') DATA.wallet.ngnBalance -= amount;
  else if (currency === 'USD') DATA.wallet.usdBalance -= amount;
  else if (currency === 'USDT') DATA.wallet.usdtBalance -= amount;
  else if (currency === 'GDEG') DATA.wallet.gdegBalance -= amount;
  res.json(tx);
});

// ===== TRANSACTIONS =====
app.get('/api/transactions', (req, res) => {
  res.json({ count: (DATA.transactions || []).length, transactions: DATA.transactions || [] });
});

// ===== COMMITS =====
app.get('/api/commits', (req, res) => {
  let result = DATA.commits;
  if (req.query.repo) result = result.filter(c => c.repo === req.query.repo);
  res.json({ count: result.length, commits: result });
});

// ===== ISSUES =====
app.get('/api/issues', (req, res) => {
  res.json({ count: (DATA.issues || []).length, issues: DATA.issues || [] });
});

app.post('/api/issues', authRequired, (req, res) => {
  const issue = { id: 'issue_' + Date.now(), ...req.body, status: 'open', createdAt: new Date().toISOString() };
  DATA.issues = DATA.issues || [];
  DATA.issues.push(issue);
  res.status(201).json(issue);
});

// ===== AUTH =====
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = { id: 'u1', email: email || 'hamzarabiu390@gmail.com', name: 'Rabiu Hamza', role: 'admin' };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.post('/api/auth/register', (req, res) => {
  const user = { id: 'u' + Date.now(), ...req.body, role: 'user' };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user });
});

// ===== USER =====
app.get('/api/user/profile', (req, res) => {
  res.json({ id: 'u1', email: 'hamzarabiu390@gmail.com', name: 'Rabiu Hamza', role: 'admin', phone: '+2348030000000' });
});

// ===== ANALYTICS =====
app.get('/api/analytics/events', (req, res) => {
  res.json({
    events: [],
    summary: {
      totalEvents: 0,
      platformVisits: DATA.platforms.length,
      agentInteractions: DATA.agents.reduce((s, a) => s + (a.tasksCompleted || 0), 0)
    }
  });
});

// ===== SYNC FROM GITHUB =====
app.post('/api/sync/github', async (req, res) => {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GITHUB_TOKEN not set' });
    const resp = await fetch('https://api.github.com/users/rabiuhamza11/repos?per_page=100&sort=updated', {
      headers: { Authorization: 'token ' + GITHUB_TOKEN }
    });
    const repos = await resp.json();
    DATA.repositories = repos.map(r => ({
      name: r.name,
      githubUrl: r.html_url,
      description: r.description || '',
      language: r.language || 'N/A',
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      openIssues: r.open_issues_count || 0,
      defaultBranch: r.default_branch || 'main',
      visibility: r.private ? 'private' : 'public',
      owner: (r.owner || {}).login || 'rabiuhamza11',
      size: r.size || 0,
      updatedAt: r.updated_at,
      topics: r.topics || []
    }));
    res.json({ status: 'synced', count: DATA.repositories.length });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.url });
});

app.listen(PORT, () => {
  console.log('HARZ Cloud Backend v3.0 on port ' + PORT);
  console.log('Platforms: ' + DATA.platforms.length + ' | Repos: ' + DATA.repositories.length + ' | Agents: ' + DATA.agents.length);
});
