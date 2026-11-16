import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Order, PaymentMethod, Product, ShippingDetails } from '../types'

interface StoreContextValue {
  cart: CartItem[]
  wishlist: string[]
  orders: Order[]
  cartOpen: boolean
  promoCode: string
  discount: number
  addToCart: (product: Product, quantity?: number, variant?: string) => void
  updateQuantity: (productId: string, variant: string, quantity: number) => void
  removeFromCart: (productId: string, variant: string) => void
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  setCartOpen: (open: boolean) => void
  applyPromo: (code: string) => boolean
  cartSubtotal: number
  cartTotal: number
  placeOrder: (shipping: ShippingDetails, payment: PaymentMethod) => Order
  clearCart: () => void
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)
const read = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || '') as T } catch { return fallback }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => read('nova-cart', []))
  const [wishlist, setWishlist] = useState<string[]>(() => read('nova-wishlist', []))
  const [orders, setOrders] = useState<Order[]>(() => read('nova-orders', []))
  const [cartOpen, setCartOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  useEffect(() => localStorage.setItem('nova-cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('nova-wishlist', JSON.stringify(wishlist)), [wishlist])
  useEffect(() => localStorage.setItem('nova-orders', JSON.stringify(orders)), [orders])

  const addToCart = (product: Product, quantity = 1, variant = product.variants[0]) => {
    setCart(current => {
      const existing = current.find(item => item.product.id === product.id && item.variant === variant)
      if (existing) return current.map(item => item === existing ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item)
      return [...current, { product, quantity, variant }]
    })
    setCartOpen(true)
  }
  const updateQuantity = (productId: string, variant: string, quantity: number) => setCart(current => current.map(item => item.product.id === productId && item.variant === variant ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) } : item))
  const removeFromCart = (productId: string, variant: string) => setCart(current => current.filter(item => !(item.product.id === productId && item.variant === variant)))
  const toggleWishlist = (productId: string) => setWishlist(current => current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId])
  const isWishlisted = (productId: string) => wishlist.includes(productId)
  const applyPromo = (code: string) => { const normalized = code.trim().toUpperCase(); setPromoCode(normalized === 'SAVE10' ? normalized : ''); return normalized === 'SAVE10' }
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart])
  const discount = promoCode === 'SAVE10' ? cartSubtotal * 0.1 : 0
  const shippingCost = cartSubtotal > 100 ? 0 : cart.length ? 8 : 0
  const cartTotal = cartSubtotal - discount + (cartSubtotal - discount) * 0.08 + shippingCost
  const clearCart = () => { setCart([]); setPromoCode('') }
  const placeOrder = (shipping: ShippingDetails, payment: PaymentMethod) => {
    const order: Order = { id: `NVM-${Date.now().toString().slice(-8)}`, date: new Date().toISOString(), items: cart, total: cartTotal, payment, shipping }
    setOrders(current => [order, ...current]); clearCart(); return order
  }

  return <StoreContext.Provider value={{ cart, wishlist, orders, cartOpen, promoCode, discount, addToCart, updateQuantity, removeFromCart, toggleWishlist, isWishlisted, setCartOpen, applyPromo, cartSubtotal, cartTotal, placeOrder, clearCart }}>{children}</StoreContext.Provider>
}

export function useStore() { const context = useContext(StoreContext); if (!context) throw new Error('useStore must be used within StoreProvider'); return context }
