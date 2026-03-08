import { schemas } from '@/app/config/schemas'
import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return schemas.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const schema = schemas.find(s => s.slug === params.slug)
  if (!schema) return {}
  return { title: schema.title }
}

export default function SchemaPage({ params }) {
  const schema = schemas.find(s => s.slug === params.slug)
  if (!schema) notFound()
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Schemas</div>
        <h2>{schema.title}</h2>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath={schema.file} />
      </div>
    </div>
  )
}
