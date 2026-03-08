import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export default function ProjectsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Repository references and living artifacts.</h2>
        <p>
          Direct access to protocol assets, governance docs, and contribution
          guidelines hosted in the protocol repository.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/contribute">Contribution guide</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Quick links</h3>
        <div className="table-list">
          <div><span>Specification</span><div>Canonical protocol requirements</div></div>
          <div><span>Security</span><div>Disclosure process and playbooks</div></div>
          <div><span>RFCs</span><div>Governance documentation</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Project resources</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scroll"></i>
            </span>
            <h4>Specification</h4>
            <p>Normative requirements and endpoint flows.</p>
            <a href="/protocol/spec">Open spec</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-shield-check"></i>
            </span>
            <h4>Security Policy</h4>
            <p>Disclosure and operator requirements.</p>
            <a href="/protocol/security">Open policy</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-git-pull-request"></i>
            </span>
            <h4>Contribution Guide</h4>
            <p>How to contribute and collaborate.</p>
            <a href="/contribute">Open guide</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-handshake"></i>
            </span>
            <h4>Code of Conduct</h4>
            <p>Community expectations for collaboration.</p>
            <a href="/contribute">Open policy</a>
          </div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/README.md" />
      </div>
    </div>
  );
}
