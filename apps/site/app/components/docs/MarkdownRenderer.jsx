'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import MermaidBlock from './MermaidBlock'
import 'highlight.js/styles/atom-one-dark.css'

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-doc">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const lang = /language-(\w+)/.exec(className || '')?.[1]
            if (!inline && lang === 'mermaid') {
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
