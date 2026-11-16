export type Category = 'Electronics' | 'Fashion' | 'Accessories' | 'Home'
export type SortOption = 'featured' | 'low' | 'high' | 'rating'
export type PaymentMethod = 'Card' | 'Mobile Money' | 'Pay on Delivery'

export interface Product {
  id: string
  title: string
  category: Category
  price: number
  originalPrice: number
  rating: number
  reviews: number
  stock: number
  description: string
  specs: string[]
  variants: string[]
  images: string[]
  featured: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  variant: string
}

export interface ShippingDetails {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
}

export interface Order {
  id: string
  date: string
  items: CartItem[]
  total: number
  payment: PaymentMethod
  shipping: ShippingDetails
}
