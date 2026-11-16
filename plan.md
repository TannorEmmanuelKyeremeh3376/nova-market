# E-commerce Store Plan

## Implementation

Build a responsive React 19 + Vite + TypeScript storefront named NovaMarket.com. Use React Router for page navigation, Context API for cart, wishlist, session, promo and order history, and localStorage for persistence. Keep the product catalog in typed local data so the project runs immediately without a backend or environment secrets.

Pages include a storefront with search, category, price and sort controls; product detail routes; a multi-step checkout with validation and confirmation; and an orders view with wishlist and order history. The cart is a slide-over drawer available from the header and calculates subtotal, discount, tax and shipping.

## Design

Three possible directions: neo-editorial commerce (0.06), soft pastel marketplace (0.08), dark luxury utility (0.07).

Chosen direction: neo-editorial commerce.

- Design movement: contemporary independent retail with magazine-like spacing and bold product cards.
- Core principles: confident typography, warm off-white canvas, high-contrast ink, and small but deliberate motion.
- Color philosophy: ink navy communicates trust, coral is an ownable action color, and sand backgrounds keep product photography central.
- Layout paradigm: asymmetrical hero split with layered cards, then a wide filter rail and editorial product grid.
- Signature elements: coral pill buttons, navy ink panels, and thin orange rules used as section markers.
- Interaction philosophy: controls feel tactile and immediate; drawers, chips and quantity steppers provide clear feedback.
- Animation: short ease-out fades and upward reveals; avoid distracting loops.
- Typography system: Plus Jakarta Sans for body and headings, with condensed uppercase labels for metadata.
- Brand essence: useful design-led goods for people who want everyday upgrades without the fuss. Personality: precise, warm, optimistic.
- Brand voice: direct, helpful and lightly editorial. Example lines: "Good things, chosen carefully." and "Built for the everyday upgrade."
- Wordmark and logo: a compact four-square spark mark beside the NOVA wordmark.
- Signature brand color: coral orange (#ff6b4a).

## Project structure

- `src/data`: typed catalog records and image URLs.
- `src/context`: global store state and localStorage persistence.
- `src/components`: navigation, hero, product card, cart drawer and footer.
- `src/pages`: home, product details, checkout and orders/wishlist.
- `public/manus-routes.json`: route manifest for the browser app.
