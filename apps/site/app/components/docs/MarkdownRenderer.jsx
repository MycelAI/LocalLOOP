// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import MermaidBlock from './MermaidBlock'
import 'highlight.js/styles/atom-one-dark.css'

// Mirrored documents start at "# Title", but every page already renders its own
// <h1 className="hub-heading">, so document headings are demoted one level to
// keep a single h1 per page and an unbroken outline.
const demote = (Tag) => ({ node: _node, ...props }) => <Tag {...props} />

// Raw HTML is not rendered (no rehype-raw), so react-markdown would print HTML
// comments -- such as the agent-cycle maintenance anchors in the mirrored
// protocol files -- as visible text. Drop nodes that are only a comment; code
// blocks are separate node types and keep their contents.
const COMMENT_ONLY = /^\s*<!--[\s\S]*?-->\s*$/
function remarkStripHtmlComments() {
  const strip = (node) => {
    if (!node.children) return
    node.children = node.children.filter((child) => !(child.type === 'html' && COMMENT_ONLY.test(child.value)))
    node.children.forEach(strip)
  }
  return strip
}

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-doc">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkStripHtmlComments]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: demote('h2'),
          h2: demote('h3'),
          h3: demote('h4'),
          h4: demote('h5'),
          h5: demote('h6'),
          // react-markdown v10 no longer passes `inline`; fenced blocks are
          // recognised by their language class instead.
          code({ className, children, ...props }) {
            const lang = /language-(\w+)/.exec(className || '')?.[1]
            if (lang === 'mermaid') {
              return <MermaidBlock chart={String(children).trim()} />
            }
            return <code className={className} {...props}>{children}</code>
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
