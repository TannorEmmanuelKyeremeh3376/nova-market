import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Account from './pages/Account'

export default function App() {
  return <div className="app-shell"><Navbar /><CartDrawer /><main><Routes><Route path="/" element={<Home />} /><Route path="/product/:id" element={<ProductDetail />} /><Route path="/checkout" element={<Checkout />} /><Route path="/orders" element={<Orders />} /><Route path="/account" element={<Account />} /></Routes></main><Footer /></div>
}
