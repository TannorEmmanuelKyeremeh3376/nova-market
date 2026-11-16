import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface User { id: string; name: string; email: string }
interface StoredUser extends User { passwordHash: string }
interface AuthContextValue { user: User | null; loading: boolean; signIn: (email: string, password: string) => Promise<void>; signUp: (name: string, email: string, password: string) => Promise<void>; signOut: () => void }
const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const userKey = 'nova-users'
const sessionKey = 'nova-session'
const read = <T,>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(key) || '') as T } catch { return fallback } }
const hashPassword = async (value: string) => { const data = new TextEncoder().encode(value); const digest = await crypto.subtle.digest('SHA-256', data); return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('') }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => read<User | null>(sessionKey, null))
  const [loading, setLoading] = useState(false)
  useEffect(() => { if (user) localStorage.setItem(sessionKey, JSON.stringify(user)); else localStorage.removeItem(sessionKey) }, [user])
  const signUp = async (name: string, email: string, password: string) => { setLoading(true); try { const normalized = email.trim().toLowerCase(); const users = read<StoredUser[]>(userKey, []); if (users.some(item => item.email === normalized)) throw new Error('An account with that email already exists.'); if (password.length < 8) throw new Error('Use at least 8 characters for your password.'); const account: StoredUser = { id: `user-${Date.now()}`, name: name.trim(), email: normalized, passwordHash: await hashPassword(password) }; localStorage.setItem(userKey, JSON.stringify([...users, account])); setUser({ id: account.id, name: account.name, email: account.email }) } finally { setLoading(false) } }
  const signIn = async (email: string, password: string) => { setLoading(true); try { const normalized = email.trim().toLowerCase(); const account = read<StoredUser[]>(userKey, []).find(item => item.email === normalized); if (!account || account.passwordHash !== await hashPassword(password)) throw new Error('Email or password is incorrect.'); setUser({ id: account.id, name: account.name, email: account.email }) } finally { setLoading(false) } }
  const signOut = () => setUser(null)
  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context }
