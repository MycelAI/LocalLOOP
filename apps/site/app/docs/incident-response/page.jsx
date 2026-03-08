import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export default function IncidentResponsePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Prepare for containment, recovery, and post-mortems.</h2>
        <p>
          Response workflows for localLOOP operators and infrastructure teams.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Playbook topics</h3>
        <div className="table-list">
          <div><span>Detection</span><div>Alerting and triage workflows</div></div>
          <div><span>Recovery</span><div>Service restoration checklist</div></div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/docs/incident-response.md" />
      </div>
    </div>
  );
}
