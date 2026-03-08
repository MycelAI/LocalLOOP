import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export default function ThreatModelPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Threat Model</h2>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/docs/compliance/threat-model.md" />
      </div>
    </div>
  )
}
