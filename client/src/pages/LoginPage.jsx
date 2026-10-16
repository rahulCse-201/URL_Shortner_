import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'

const API = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

export default function LoginPage() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, { email, password })
      localStorage.setItem('linksmith-token', data.token)
      dispatch(setCredentials(data))
      window.location.assign('/')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="page-shell"><section className="shortener-card auth-card">
    <a className="brand-mark" href="/" aria-label="Linksmith home">/</a>
    <p className="eyebrow">Linksmith · Sign in</p>
    <h1>Welcome back.</h1>
    <p className="intro">Sign in to your account.</p>
    <form className="auth-form" onSubmit={submit}>
      <label htmlFor="login-email">Email address</label>
      <input id="login-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <label htmlFor="login-password">Password</label>
      <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} />
      {error && <p className="status status-error" role="alert">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="auth-switch">Don't have an account? <a href="/register">Register</a></p>
  </section></main>
}
