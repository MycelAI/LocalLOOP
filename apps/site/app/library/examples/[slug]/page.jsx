import { examples } from '@/app/config/examples'
import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return examples.map(e => ({ slug: e.slug }))
}

export async function generateMetadata({ params }) {
  const example = examples.find(e => e.slug === params.slug)
  if (!example) return {}
  return { title: example.title }
}

export default function ExamplePage({ params }) {
  const example = examples.find(e => e.slug === params.slug)
  if (!example) notFound()
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Examples</div>
        <h2>{example.title}</h2>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath={example.file} />
      </div>
    </div>
  )
}
