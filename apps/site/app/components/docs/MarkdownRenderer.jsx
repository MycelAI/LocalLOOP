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

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-doc">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
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
