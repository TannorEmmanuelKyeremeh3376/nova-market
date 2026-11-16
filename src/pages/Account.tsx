import { ArrowRight, Check, LockKeyhole, LogOut, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = new URLSearchParams(location.search).get('return') || '/orders'
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setError(''); try { if (mode === 'signin') await signIn(email, password); else await signUp(name, email, password); navigate(redirect) } catch (err) { setError(err instanceof Error ? err.message : 'Unable to continue.') } }
  if (user) return <div className="account-page page-frame"><div className="account-card logged-in"><div className="account-icon"><UserRound size={26} /></div><p className="eyebrow">YOUR ACCOUNT</p><h1>Hello, <i>{user.name.split(' ')[0]}.</i></h1><p>You are signed in as {user.email}. Your saved products and order history are ready on this device.</p><div className="account-checks"><span><Check size={15} /> Saved wishlist</span><span><Check size={15} /> Order history</span><span><Check size={15} /> Faster checkout</span></div><div className="account-actions"><Link className="button button-dark" to="/orders">View your account <ArrowRight size={16} /></Link><button className="button button-light" onClick={signOut}><LogOut size={16} /> Sign out</button></div></div></div>
  return <div className="account-page page-frame"><div className="account-card"><div className="account-icon"><LockKeyhole size={26} /></div><p className="eyebrow">NOVAMARKET.COM ACCOUNT</p><h1>{mode === 'signin' ? <>Welcome <i>back.</i></> : <>Make it <i>yours.</i></>}</h1><p>{mode === 'signin' ? 'Sign in to keep your favorites and orders together.' : 'Create an account for a smoother shopping experience.'}</p><div className="auth-tabs"><button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError('') }}>Sign in</button><button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError('') }}>Create account</button></div><form className="auth-form" onSubmit={submit}>{mode === 'signup' && <label>Full name<input required value={name} onChange={event => setName(event.target.value)} placeholder="Alex Morgan" /></label>}<label>Email address<input required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>Password<input required minLength={8} type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 8 characters" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-coral" disabled={loading}>{loading ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></button></form><p className="auth-note">This starter uses secure browser hashing for a local demo session. For a multi-device production account system, connect Supabase, Clerk or Auth0 before launch.</p></div></div>
}
