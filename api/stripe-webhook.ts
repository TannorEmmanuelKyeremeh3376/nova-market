import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }
const readRawBody = async (request: any) => { if (Buffer.isBuffer(request.body)) return request.body; if (typeof request.body === 'string') return Buffer.from(request.body); const chunks: Buffer[] = []; for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)); return Buffer.concat(chunks) }

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).end()
  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !webhookSecret) return response.status(503).json({ error: 'Stripe webhook secrets are not configured.' })
  try { const stripe = new Stripe(secret); const payload = await readRawBody(request); const event = stripe.webhooks.constructEvent(payload, request.headers['stripe-signature'], webhookSecret); if (event.type === 'checkout.session.completed') console.log('NovaMarket.com payment completed', event.data.object.id); return response.status(200).json({ received: true }) } catch (error) { console.error(error); return response.status(400).json({ error: 'Invalid Stripe webhook signature.' }) }
}
