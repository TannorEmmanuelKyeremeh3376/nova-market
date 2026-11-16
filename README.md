# NovaMarket.com

NovaMarket.com is a responsive React 19 + Vite + TypeScript e-commerce storefront. It includes a searchable and filterable catalog, product detail routes, a persistent cart drawer, wishlist, account sign-in and sign-up, multi-step checkout, Stripe Checkout integration hooks, promo code support, order confirmation, and order history.

## Run in Visual Studio Code

Open the `ecommerce-store` folder in Visual Studio Code, open its integrated terminal, and run:

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, normally `http://localhost:5173`.

For a production build, run:

```bash
npm run build
npm run preview
```

The app uses browser `localStorage` keys `nova-cart`, `nova-wishlist`, `nova-orders`, `nova-users`, and `nova-session`. The demo promo code is `SAVE10`.

## Deployment and payments

Read [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel and Netlify setup, DNS, environment variables, Stripe Checkout, webhook configuration, and the production authentication recommendation. Use [.env.example](./.env.example) as the environment variable template. Never commit real Stripe keys.

## Investor materials

The investor-ready presentation script is in [investor-pitch-script.md](./investor-pitch-script.md).
