import axios from 'axios';
import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('')
    setShortUrl('')

    setIsLoading(true)
    try {
      const {data} = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/url`, {originalUrl: url});
      if(data.success){
        setShortUrl(data.shortUrl);
        setStatus('Your shorter link is ready.');
      }else{
        setStatus(data.message || 'Unable to shorten that URL');
      }
    } catch(error) {
      setStatus('Enter a valid URL, including https://');
      console.error('Error shortening URL:', error);
      return
    }finally{
      setIsLoading(false);
    }




  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setStatus('Copied to clipboard.')
  }

  return (
    <main className="page-shell">
      <section className="shortener-card" aria-labelledby="page-title">
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
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/your-long-link"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Making link...' : 'Shorten URL'}
            </button>
          </div>
        </form>

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

        {status && <p className="status" role="status">{status}</p>}

      </section>
      <p className="footer-note">Simple links. Less clutter.</p>
    </main>
  )
}

export default App
