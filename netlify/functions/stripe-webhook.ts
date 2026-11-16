import Stripe from 'stripe'

export default async (request: Request) => {
  if (request.method !== 'POST') return new Response('', { status: 405 })
  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !webhookSecret) return new Response(JSON.stringify({ error: 'Stripe webhook secrets are not configured.' }), { status: 503, headers: { 'Content-Type': 'application/json' } })
  try { const stripe = new Stripe(secret); const event = stripe.webhooks.constructEvent(await request.text(), request.headers.get('stripe-signature') || '', webhookSecret); if (event.type === 'checkout.session.completed') console.log('NovaMarket.com payment completed', event.data.object.id); return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }) } catch (error) { console.error(error); return new Response(JSON.stringify({ error: 'Invalid Stripe webhook signature.' }), { status: 400, headers: { 'Content-Type': 'application/json' } }) }
}
