'use client'
import { useEffect, useRef, useId } from 'react'

export default function MermaidBlock({ chart }) {
  const ref = useRef(null)
  const id = useId().replace(/:/g, '')
  useEffect(() => {
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' })
      return mermaid.render(`m${id}`, chart).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
    }).catch((error) => {
      // A malformed diagram in a mirrored document must not become an
      // unhandled rejection; fall back to showing the source.
      if (ref.current) {
        const pre = document.createElement('pre')
        pre.textContent = chart
        ref.current.replaceChildren(pre)
      }
      if (process.env.NODE_ENV !== 'production') console.error('Mermaid render failed', error)
    })
  }, [chart, id])
  return <div ref={ref} className="mermaid-block" />
}
