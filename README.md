# BayKicks — CS351 Project 2

A React + Vite storefront with Node.js/Express REST API, MongoDB Atlas products/users/orders, and an Express-session cart. Based on the original BayKicks Project 1.

## Architecture

- `client/src/views` React screens, `client/src/components` reusable UI, `client/src/api.js` central fetch helper
- `server/routes` URL mappings; `server/controllers` request handlers; `server/models` MongoDB models
- `server/data/seedProducts.json` **seed-only source** for importing Project 1's 25 products. React never imports this JSON.
- `docs` GitHub Pages documentation

## Local development

1. Install Node.js 22 or newer.
2. In `server`, run `npm install`. Copy `.env.example` to `.env`, replace MongoDB URI with your Atlas connection string, and generate a random `SESSION_SECRET` at least 32 characters long. **Never commit `.env`.**
3. In `server`, run `npm run seed` once to import 25 products into the MongoDB `products` collection.
4. In `server`, run `npm run dev` (port 8080).
5. In another terminal, in `client`, run `npm install` and `npm run dev` (Vite). Vite proxies `/api` to Express.
6. Visit the URL Vite prints. Test register → login → add items → refresh → edit cart → checkout → order history.

## Deployment (single Cloud Run service)

1. Configure MongoDB Atlas network access appropriately for your Cloud Run egress, and create a least-privilege DB user.
2. From the project root, build with `gcloud run deploy baykicks-project2 --source . --region us-west1 --allow-unauthenticated` (requires Google Cloud project, billing and CLI setup).
3. In Cloud Run service settings, set `MONGODB_URI`, `SESSION_SECRET` (strong random value), and `NODE_ENV=production`. Prefer Secret Manager for secrets. Redeploy revision.
4. Confirm `/api/products` and the React homepage load from the **same** Cloud Run URL.
5. For production, sessions are stored in MongoDB (`sessions` collection), not Express MemoryStore.

## API

`GET /api/products`, `GET /api/products/:id`, `POST /api/accounts`, `POST /api/login`, `POST /api/logout`, `GET /api/account`, `PUT /api/account`, `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:itemId`, `DELETE /api/cart/:itemId`, `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`.

## Demo-only payments

No real card payments. Checkout asks for a **card type and four fake digits only**; never enter or collect a full card number or CVV. Tax is a **demo 8.75%** and shipping is **$8 below $100, otherwise free**; confirm instructor expectations before final presentation.

## Group members

Add each group member's name and responsibilities here before submission.

## Presentation checklist

Demonstrate products loaded from Atlas, registration with users collection before/after, login and edit account, cart surviving refresh, quantity/removal, checkout and orders collection before/after, order history, GitHub Wiki videos, GitHub Pages and Issues Board. Submit GitHub repository URL and Cloud Run URL.

## Limitations

Requires live MongoDB Atlas credentials and cloud configuration. This code is a starter implementation to test end-to-end before submission; no real payments, inventory reservation, or production transaction processing.
