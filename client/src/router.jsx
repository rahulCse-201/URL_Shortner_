import { useEffect, useState } from 'react'

export function createBrowserRouter(routes) {
  return routes
}

export function RouterProvider({ router }) {
  const [path, setPath] = useState(window.location.pathname.replace(/\/$/, '') || '/')

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname.replace(/\/$/, '') || '/')
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target.closest('a[href]')
      if (!anchor || anchor.target || anchor.origin !== window.location.origin) return
      const nextPath = anchor.pathname.replace(/\/$/, '') || '/'
      if (!router.some(route => route.path === nextPath)) return
      event.preventDefault()
      window.history.pushState({}, '', `${nextPath}${anchor.search}${anchor.hash}`)
      setPath(nextPath)
    }

    window.addEventListener('popstate', onPopState)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onClick)
    }
  }, [router])

  return router.find(route => route.path === path)?.element ?? router.find(route => route.path === '/')?.element ?? null
}
