import Stripe from 'stripe'

export default async (request: Request) => {
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } })
  const secret = process.env.STRIPE_SECRET_KEY
  const appUrl = process.env.APP_URL || 'http://localhost:5173'
  if (!secret) return new Response(JSON.stringify({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY on the hosting platform.' }), { status: 503, headers: { 'Content-Type': 'application/json' } })
  try {
    const stripe = new Stripe(secret)
    const { items, customerEmail } = await request.json()
    if (!Array.isArray(items) || items.length === 0) return new Response(JSON.stringify({ error: 'Cart is empty.' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    const session = await stripe.checkout.sessions.create({ mode: 'payment', customer_email: typeof customerEmail === 'string' ? customerEmail : undefined, line_items: items.map((item: any) => ({ price_data: { currency: 'usd', product_data: { name: String(item.product.title), description: `Variant: ${String(item.variant)}` }, unit_amount: Math.round(Number(item.product.price) * 100) }, quantity: Math.max(1, Math.min(Number(item.quantity) || 1, 20)) })), shipping_address_collection: { allowed_countries: ['US', 'GH', 'NG', 'KE'] }, success_url: `${appUrl}/checkout?payment=success`, cancel_url: `${appUrl}/checkout?payment=cancelled`, metadata: { source: 'novamarket.com' } })
    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) { console.error(error); return new Response(JSON.stringify({ error: 'Unable to create a Stripe Checkout session.' }), { status: 500, headers: { 'Content-Type': 'application/json' } }) }
}
