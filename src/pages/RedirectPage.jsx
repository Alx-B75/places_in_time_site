import { useEffect } from "react"

export default function RedirectPage({ to }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace(to)
    }
  }, [to])

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1>Redirecting…</h1>
      <p>
        If you are not redirected automatically, <a href={to}>click here</a>.
      </p>
    </main>
  )
}
