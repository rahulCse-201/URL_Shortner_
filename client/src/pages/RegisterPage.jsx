import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'

const API = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/api/auth/register`, { name, email, password })
      localStorage.setItem('linksmith-token', data.token)
      dispatch(setCredentials(data))
      window.location.assign('/')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="page-shell"><section className="shortener-card auth-card">
    <a className="brand-mark" href="/" aria-label="Linksmith home">/</a>
    <p className="eyebrow">Linksmith · Create account</p>
    <h1>Create your account.</h1>
    <p className="intro">Register to get started.</p>
    <form className="auth-form" onSubmit={submit}>
      <label htmlFor="register-name">Name</label>
      <input id="register-name" autoComplete="name" required maxLength={80} value={name} onChange={event => setName(event.target.value)} />
      <label htmlFor="register-email">Email address</label>
      <input id="register-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <label htmlFor="register-password">Password</label>
      <input id="register-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={event => setPassword(event.target.value)} />
      {error && <p className="status status-error" role="alert">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Register'}</button>
    </form>
    <p className="auth-switch">Already registered? <a href="/login">Sign in</a></p>
  </section></main>
}
