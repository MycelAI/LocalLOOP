// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { SKIP, visit } from 'unist-util-visit'
import MermaidBlocks from './MermaidBlocks'
import 'highlight.js/styles/atom-one-dark.css'

// A server component that renders the Markdown to one HTML string at build
// time. The page then carries that string once in its payload instead of a
// React element per node, so long documents (the specification) hydrate
// without re-parsing, re-highlighting or reconciling thousands of elements,
// and no Markdown toolchain reaches the browser. Mermaid diagrams are the only
// client-side work (MermaidBlocks).

// Raw HTML is not rendered, so drop nodes that are only an HTML comment (the
// agent-cycle anchors in the mirrored protocol files) instead of printing them.
const COMMENT_ONLY = /^\s*<!--[\s\S]*?-->\s*$/
function remarkStripHtmlComments() {
  return (tree) => {
    visit(tree, 'html', (node, index, parent) => {
      if (parent && typeof index === 'number' && COMMENT_ONLY.test(node.value)) {
        parent.children.splice(index, 1)
        return [SKIP, index]
      }
      return undefined
    })
  }
}

// Mirrored documents start at "# Title", but every page already renders its own
// <h1 className="hub-heading">, so document headings are demoted one level to
// keep a single h1 per page and an unbroken outline.
function rehypeDemoteHeadings() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const level = /^h([1-5])$/.exec(node.tagName)?.[1]
      if (level) node.tagName = `h${Number(level) + 1}`
    })
  }
}

// ```mermaid fences become placeholders that MermaidBlocks renders in the
// browser; the source stays readable if scripts never run.
function rehypeMermaidPlaceholders() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || typeof index !== 'number') return undefined
      const code = node.children.find((child) => child.type === 'element' && child.tagName === 'code')
      const classes = code?.properties?.className ?? []
      if (!classes.includes('language-mermaid')) return undefined
      const chart = code.children.map((child) => child.value ?? '').join('').trim()
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['mermaid-block'], dataChart: chart },
        children: [{ type: 'element', tagName: 'pre', properties: {}, children: [{ type: 'text', value: chart }] }],
      }
      return SKIP
    })
  }
}

// The CSP allows images from this origin only, so badges and other remote
// images in mirrored READMEs would be blocked (and logged as errors); show
// their alt text instead.
function rehypeLocalImagesOnly() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img' || !parent || typeof index !== 'number') return undefined
      const src = String(node.properties?.src ?? '')
      if (!/^https?:\/\//i.test(src) || src.startsWith('https://loop.urbnia.com/')) return undefined
      const alt = String(node.properties?.alt ?? '')
      parent.children[index] = alt
        ? { type: 'element', tagName: 'span', properties: { className: ['md-image-alt'] }, children: [{ type: 'text', value: alt }] }
        : { type: 'text', value: '' }
      return SKIP
    })
  }
}

// Headings get GitHub-style ids (lowercase, punctuation dropped, spaces to
// hyphens, -1/-2 suffixes for repeats) so the documents' own tables of
// contents and cross-document #anchors resolve, as they do on GitHub.
function headingText(node) {
  if (node.type === 'text') return node.value
  return (node.children ?? []).map(headingText).join('')
}
function rehypeHeadingIds() {
  return (tree) => {
    const seen = new Map()
    visit(tree, 'element', (node) => {
      if (!/^h[1-6]$/.test(node.tagName) || node.properties?.id) return
      const base = headingText(node).toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-')
      if (!base) return
      const count = seen.get(base) ?? 0
      seen.set(base, count + 1)
      node.properties.id = count ? `${base}-${count}` : base
    })
  }
}

// Relative links in mirrored documents are written against the document's
// own folder, but the page lives at a different URL; resolve them against
// the mirrored file's location (file.data.baseDir, e.g.
// /projects/loop-protocol/docs/) so they reach the mirrored target instead
// of a 404.
function rehypeResolveRelativeLinks() {
  return (tree, file) => {
    const baseDir = file.data?.baseDir
    if (!baseDir) return
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return
      const href = String(node.properties?.href ?? '')
      if (!href || /^(#|\/|[a-z][a-z0-9+.-]*:)/i.test(href)) return
      const url = new URL(href, `https://loop.urbnia.com${baseDir}`)
      node.properties.href = `${url.pathname}${url.search}${url.hash}`
    })
  }
}

// GFM task lists render disabled checkboxes with no accessible name; label
// each with its state so screen readers (and the axe "label" rule) get one.
function rehypeLabelTaskCheckboxes() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'input' || node.properties?.type !== 'checkbox') return
      node.properties.ariaLabel = node.properties.checked ? 'Done' : 'Not done'
    })
  }
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkStripHtmlComments)
  .use(remarkRehype)
  .use(rehypeMermaidPlaceholders)
  .use(rehypeLocalImagesOnly)
  .use(rehypeHeadingIds)
  .use(rehypeResolveRelativeLinks)
  .use(rehypeDemoteHeadings)
  .use(rehypeLabelTaskCheckboxes)
  .use(rehypeHighlight)
  .use(rehypeStringify)

export function renderMarkdown(content, baseDir) {
  return String(processor.processSync({ value: content, data: { baseDir } }))
}

export default function MarkdownRenderer({ content, baseDir }) {
  const html = renderMarkdown(content, baseDir)
  return (
    <div className="markdown-doc">
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted input -- the repository's own mirrored Markdown, rendered at build time with raw HTML disabled (remark-rehype's default)
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {html.includes('class="mermaid-block"') ? <MermaidBlocks /> : null}
    </div>
  )
}
