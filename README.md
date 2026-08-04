# HARZ Cloud Backend v2.0

Express.js backend API for the HARZ Ecosystem Super App.

## Endpoints (20)
- `GET /health` — Health check
- `GET /platforms` — List all 59 platforms
- `GET /platforms/:name` — Platform detail
- `GET /agents` — List all 7 AI agents
- `POST /agents/delegate` — Delegate task to agent
- `GET /wallet` — Wallet info (NGN, USD, GDEG, USDT)
- `POST /wallet/topup` — Top-up wallet
- `GET /transactions` — List transactions
- `POST /transactions/create` — Create transaction
- `GET /products` — List 20 products
- `GET /products/:name` — Product detail
- `POST /analytics/track` — Track analytics event
- `GET /analytics` — List analytics events
- `POST /auth/login` — User login
- `POST /auth/register` — User registration
- `POST /auth/logout` — User logout
- `POST /auth/2fa/enable` — Enable 2FA
- `POST /auth/password-reset/request` — Request password reset
- `GET /export-all` — Export all data (auth required)
- `GET /stats` — Ecosystem stats

## Deploy
Deployed on Render.com at https://harz-cloud-backend.onrender.com

## Data
Primary data: Base44 entities (synced)
Fallback: Local seed data for offline resilience
