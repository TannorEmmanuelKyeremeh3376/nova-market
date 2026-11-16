import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Search, ShoppingBag, Sparkles, UserRound } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const categories = ['All', 'Electronics', 'Fashion', 'Accessories', 'Home']
export default function Navbar() {
  const { cart, wishlist, setCartOpen } = useStore()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const submit = (event: React.FormEvent) => { event.preventDefault(); navigate(`/?search=${encodeURIComponent(search)}`) }
  return <header className="site-header"><div className="top-line"><span>Complimentary shipping on orders over $100</span><span>Designed for the everyday upgrade</span></div><div className="nav-main"><Link className="brand" to="/"><span className="brand-mark"><Sparkles size={17} /></span><span>NovaMarket.com</span></Link><form className="search-box" onSubmit={submit}><Search size={18} /><input aria-label="Search products" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search the collection" /></form><div className="nav-actions"><Link className="icon-action" to="/orders" aria-label="Wishlist and orders"><Heart size={20} /><span className="badge">{wishlist.length}</span><em>Saved</em></Link><button className="icon-action" onClick={() => setCartOpen(true)} aria-label="Open shopping bag"><ShoppingBag size={20} /><span className="badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span><em>Bag</em></button><Link className="account-link" to={user ? '/account' : '/account?return=/checkout'}><UserRound size={19} /> {user ? user.name.split(' ')[0] : 'Account'}</Link></div></div><nav className="category-nav">{categories.map(category => <NavLink key={category} to={category === 'All' ? '/' : `/?category=${category}`} className={({ isActive }) => isActive && category === 'All' ? 'active' : ''}>{category}</NavLink>)}</nav></header>
}
