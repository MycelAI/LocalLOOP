import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export default function DpiaLitePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Lightweight data protection impact assessment.</h2>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/docs/compliance/dpia-lite.md" />
      </div>
    </div>
  )
}
