'use client'
import { useEffect, useRef, useId } from 'react'

export default function MermaidBlock({ chart }) {
  const ref = useRef(null)
  const id = useId().replace(/:/g, '')
  useEffect(() => {
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' })
      mermaid.render('m' + id, chart).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
    })
  }, [chart, id])
  return <div ref={ref} className="mermaid-block" />
}
