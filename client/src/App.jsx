import axios from 'axios';
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutSession, restoreSession } from './store/authSlice'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { user, token, status: authStatus } = useSelector(state => state.auth)
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('info')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (token && authStatus === 'idle') dispatch(restoreSession())
  }, [token, authStatus, dispatch])



  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setStatus('Copied to clipboard.')
    setStatusType('success')
  }


  let timeout;
  const isValidUrl = (url) => {

    function debounce(url) {
      clearTimeout(timeout);

      timeout = setTimeout(
        () => {
          try {
            console.log('Validating URL:', url);
            const urlObj = new URL(url);
            ["http:", "https:"].includes(urlObj.protocol) ? setStatus('') : setStatus('Enter a valid URL');
          } catch (err) {
            setStatus('Enter a valid URL');
          }
        },
        300
      )
    }

    debounce(url);

    // debounce the validation to avoid excessive calls during typing
    // const debounce = (func, wait) => {
    //   let timeout;
    //   return (...args) => {
    //     clearTimeout(timeout);
    //     timeout = setTimeout(() => func.apply(this, args), wait);
    //   };
    // };


  }

  // useEffect run when it's depencdencies change , identify changes by comparing old and current states 
  // useEffect(() => {
  //   console.log('Status changed:', status);
  // }, [status, url]);

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('')
    setStatusType('info')
    setShortUrl('')

    setIsLoading(true)
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/url`, { originalUrl: url });
      if (data.success) {
        setShortUrl(data.shortUrl);
        setStatus('Your shorter link is ready.');
        setStatusType('success')
      } else {
        setStatus(data.message || 'Unable to shorten that URL');
        setStatusType('error')
      }
    } catch (error) {
      setStatus('Enter a valid URL, including https://');
      setStatusType('error')
      console.error('Error shortening URL:', error);
      return
    } finally {
      setIsLoading(false);
    }




  }

  return (
    <main className="page-shell">
      <section className="shortener-card" aria-labelledby="page-title">
        {user
          ? <button className="sign-in-button" type="button" onClick={() => dispatch(logoutSession())}>Sign out</button>
          : !token && <a className="sign-in-button" href="/login">Sign in</a>}
        <div className="brand-mark" aria-hidden="true">/</div>
        <p className="eyebrow">Linksmith</p>
        <h1 id="page-title">Make links easier to share.</h1>
        <p className="intro">Turn a long URL into a clean, memorable link in seconds.</p>

        <form className="shortener-form" onSubmit={handleSubmit}>
          <label htmlFor="url">Paste your long URL</label>

          <div className="input-row">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value)
                isValidUrl(event.target.value);
              }}
              placeholder="https://example.com/your-long-link"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Making link...' : 'Shorten URL'}
            </button>
          </div>
          {user && (
            <div className="authorized-alias-fields">
              <label htmlFor="custom-alias">Custom alias or short code</label>
              <input id="custom-alias" type="text" placeholder="your-custom-name" />
            </div>
          )}
        </form>

        {status && (
          <p className={`status status-${statusType}`} role={statusType === 'error' ? 'alert' : 'status'}>
            <span className="status-icon" aria-hidden="true">
              {statusType === 'error' ? '!' : '✓'}
            </span>
            <span>{status}</span>
          </p>
        )}

        {shortUrl && (
          <div className="result" aria-live="polite">
            <div>
              <span className="result-label">Your short link</span>
              <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
            </div>
            <button className="copy-button" type="button" onClick={handleCopy} aria-label="Copy short link">
              Copy
            </button>
          </div>
        )}

      </section>
      <p className="footer-note">Simple links. Less clutter.</p>
    </main>
  )
}

export default App
