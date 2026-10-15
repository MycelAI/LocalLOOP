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
  .use(rehypeDemoteHeadings)
  .use(rehypeLabelTaskCheckboxes)
  .use(rehypeHighlight)
  .use(rehypeStringify)

export function renderMarkdown(content) {
  return String(processor.processSync(content))
}

export default function MarkdownRenderer({ content }) {
  const html = renderMarkdown(content)
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
