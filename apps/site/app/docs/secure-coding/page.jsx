import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export default function SecureCodingPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Secure Coding</h2>
        <p>
          Guardrails for building secure integrations and services in the localLOOP
          ecosystem.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Focus areas</h3>
        <div className="table-list">
          <div><span>Data handling</span><div>Validation and sanitization</div></div>
          <div><span>Infrastructure</span><div>Credential and secret hygiene</div></div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/docs/secure-coding.md" />
      </div>
    </div>
  );
}
