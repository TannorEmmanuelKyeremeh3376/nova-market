import Stripe from 'stripe'

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' })
  const secret = process.env.STRIPE_SECRET_KEY
  const appUrl = process.env.APP_URL || 'http://localhost:5173'
  if (!secret) return response.status(503).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY on the hosting platform.' })
  try {
    const stripe = new Stripe(secret)
    const { items, customerEmail } = request.body || {}
    if (!Array.isArray(items) || items.length === 0) return response.status(400).json({ error: 'Cart is empty.' })
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: typeof customerEmail === 'string' ? customerEmail : undefined,
      line_items: items.map((item: any) => ({ price_data: { currency: 'usd', product_data: { name: String(item.product.title), description: `Variant: ${String(item.variant)}` }, unit_amount: Math.round(Number(item.product.price) * 100) }, quantity: Math.max(1, Math.min(Number(item.quantity) || 1, 20)) })),
      shipping_address_collection: { allowed_countries: ['US', 'GH', 'NG', 'KE'] },
      success_url: `${appUrl}/checkout?payment=success`,
      cancel_url: `${appUrl}/checkout?payment=cancelled`,
      metadata: { source: 'novamarket.com' }
    })
    return response.status(200).json({ url: session.url })
  } catch (error) { console.error(error); return response.status(500).json({ error: 'Unable to create a Stripe Checkout session.' }) }
}
