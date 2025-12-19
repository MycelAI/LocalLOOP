export default function ProjectsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Project hub</div>
        <h2>Repository references and living artifacts.</h2>
        <p>
          Direct access to protocol assets, governance docs, and contribution
          guidelines hosted in the protocol repository.
        </p>
        <div className="cta-row">
          <a
            className="button primary"
            href="/viewer.html?path=projects/loop-protocol/README.md&title=LOOP%20Protocol%20README"
          >
            Open protocol README
          </a>
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
          <div className="card">
            <h4>Specification</h4>
            <p>Normative requirements and endpoint flows.</p>
            <a href="/viewer.html?path=projects/loop-protocol/SPECIFICATION.md&title=Specification">Open spec</a>
          </div>
          <div className="card">
            <h4>Security Policy</h4>
            <p>Disclosure and operator requirements.</p>
            <a href="/viewer.html?path=projects/loop-protocol/SECURITY.md&title=Security%20Policy">Open policy</a>
          </div>
          <div className="card">
            <h4>Contribution Guide</h4>
            <p>How to contribute and collaborate.</p>
            <a href="/viewer.html?path=projects/loop-protocol/CONTRIBUTING.md&title=Contributing">Open guide</a>
          </div>
          <div className="card">
            <h4>Code of Conduct</h4>
            <p>Community expectations for collaboration.</p>
            <a href="/viewer.html?path=projects/loop-protocol/CODE_OF_CONDUCT.md&title=Code%20of%20Conduct">Open policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
