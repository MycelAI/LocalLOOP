// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

'use client'
import { useEffect, useRef } from 'react'

// Renders the .mermaid-block placeholders that MarkdownRenderer emits inside
// the same .markdown-doc. Mermaid loads only on pages that have diagrams, and
// a diagram that fails to render keeps showing its source.
export default function MermaidBlocks() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current?.closest('.markdown-doc')
    const blocks = root ? [...root.querySelectorAll('.mermaid-block[data-chart]')] : []
    if (blocks.length === 0) return undefined
    let cancelled = false
    let mermaidPromise = null
    let counter = 0
    // Mermaid (and its layout engine) is large; load and run it only when a
    // diagram is about to scroll into view, not on page load.
    const loadMermaid = () => {
      mermaidPromise ??= import('mermaid').then(({ default: mermaid }) => {
        // Mermaid 12 re-lays out and recolours diagrams by default; pin the
        // dagre layout and classic look so mirrored diagrams render as before.
        mermaid.initialize({ startOnLoad: false, theme: 'neutral', layout: 'dagre', look: 'classic' })
        return mermaid
      })
      return mermaidPromise
    }
    const renderBlock = async (block) => {
      try {
        const mermaid = await loadMermaid()
        if (cancelled) return
        counter += 1
        const { svg } = await mermaid.render(`mermaid-${counter}`, block.dataset.chart)
        if (!cancelled) block.innerHTML = svg
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error('Mermaid render failed', error)
      }
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)
        renderBlock(entry.target)
      }
    }, { rootMargin: '300px 0px' })
    for (const block of blocks) observer.observe(block)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])
  return <span ref={ref} hidden />
}
