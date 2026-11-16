# NovaMarket.com deployment guide

## Vercel

Vercel supports Vite projects directly and can deploy this repository from the Vercel dashboard or from the project root with the Vercel CLI. The repository already contains `vercel.json` with the SPA rewrite required for React Router deep links. Vercel's current Vite guidance documents both Git deployments and CLI deployment. [1]

1. Push `/home/ubuntu/ecommerce-store` to a GitHub repository.
2. In Vercel, choose **Add New Project**, import the repository, and keep the detected Vite settings.
3. Confirm the build command is `npm run build` and the output directory is `dist`.
4. Add `APP_URL=https://NovaMarket.com`, `STRIPE_SECRET_KEY=sk_test_...`, and `STRIPE_WEBHOOK_SECRET=whsec_...` under Project Settings > Environment Variables. Do not add secret variables with the `VITE_` prefix because Vite exposes `VITE_` variables to browser code.
5. Deploy, then add `NovaMarket.com` under Project Settings > Domains. Update the DNS records at your domain registrar using the values Vercel displays.
6. In Stripe Workbench, register `https://NovaMarket.com/api/stripe-webhook` as an HTTPS webhook endpoint and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

## Netlify

Netlify's Vite guide recommends `npm run build` as the build command and `dist` as the publish directory. The repository already contains `netlify.toml` with those settings, SPA fallback routing, and an `/api/*` redirect to Netlify Functions. [2]

1. Push `/home/ubuntu/ecommerce-store` to GitHub.
2. In Netlify, choose **Add new site > Import an existing project**, select the repository, and deploy with the detected settings.
3. Confirm the build command is `npm run build`, publish directory is `dist`, and functions directory is `netlify/functions`.
4. Add the same `APP_URL`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` values under Site configuration > Environment variables.
5. Add `NovaMarket.com` under Domain management and configure the DNS records Netlify provides.
6. Register `https://NovaMarket.com/api/stripe-webhook` in Stripe Workbench. The Netlify redirect sends that path to the `stripe-webhook` function.

## Authentication

The delivered site includes an immediately usable local account flow at `/account`: sign-up, sign-in, sign-out, browser-side password hashing, saved session state, account-aware checkout, and the existing wishlist/order history. This is suitable for demos and single-device prototypes. It is not a multi-device production identity system because account records remain in browser storage. Before launch, replace `src/context/AuthContext.tsx` with Supabase Auth, Clerk, Auth0, or another hosted identity provider and store only the provider session in the browser.

## Stripe payment integration

The Card path in checkout now calls `/api/create-checkout-session`. The server creates a Stripe-hosted Checkout Session, and the browser redirects to the returned URL. Stripe recommends Checkout Sessions for most integrations because it manages the checkout lifecycle and supports shipping, discounts, tax, and authentication. [3]

The Stripe secret is server-only. The webhook handler verifies the raw request body using Stripe's `Stripe-Signature` header and `STRIPE_WEBHOOK_SECRET`. Stripe requires signature verification and a publicly accessible HTTPS endpoint for registered webhooks. [4]

Until Stripe environment variables are configured, the checkout page remains usable with the `Demo order` button. Once the variables are present on Vercel or Netlify, the `Pay securely with Stripe` button opens real test-mode Checkout.

## Local verification

```bash
npm install
npm run build
npm run dev
```

For a local Stripe webhook test, use the Stripe CLI to forward events to the local webhook endpoint after starting a backend-capable local runtime. Never commit `.env` or live Stripe keys.

## References

[1]: https://vercel.com/docs/frameworks/frontend/vite "Vite on Vercel"
[2]: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/ "Vite on Netlify"
[3]: https://docs.stripe.com/payments/checkout-sessions "The Checkout Sessions API"
[4]: https://docs.stripe.com/webhooks "Receive Stripe events in your webhook endpoint"
