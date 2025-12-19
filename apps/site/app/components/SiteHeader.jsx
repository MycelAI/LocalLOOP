export function SiteHeader({ subtitle = 'Protocol Knowledge Base' }) {
  return (
    <header>
      <nav>
        <div className="nav-brand">
          <h1>LocalLoop</h1>
          <span>{subtitle}</span>
        </div>
        <div className="nav-links">
          <div className="nav-group">
            <a className="nav-trigger" href="/">Platform</a>
            <div className="nav-menu">
              <span className="nav-eyebrow">Platform</span>
              <a href="/">Overview</a>
              <a href="/materialDNA">MaterialDNA</a>
              <a href="/cities">City Portals</a>
              <a href="/DEMO-City">DEMO City</a>
            </div>
          </div>
          <div className="nav-group">
            <a className="nav-trigger" href="/protocol">Protocol</a>
            <div className="nav-menu">
              <span className="nav-eyebrow">Protocol</span>
              <a href="/protocol">Overview</a>
              <a href="/protocol/spec">Specification</a>
              <a href="/protocol/changelog">Changelog</a>
              <a href="/protocol/security">Security</a>
            </div>
          </div>
          <div className="nav-group">
            <a className="nav-trigger" href="/library">Library</a>
            <div className="nav-menu">
              <span className="nav-eyebrow">Library</span>
              <a href="/library/schemas">Schemas</a>
              <a href="/library/examples">Examples</a>
              <a href="/library">All resources</a>
            </div>
          </div>
          <div className="nav-group">
            <a className="nav-trigger" href="/governance">Governance</a>
            <div className="nav-menu">
              <span className="nav-eyebrow">Governance</span>
              <a href="/governance/rfcs">RFC Guide</a>
              <a href="/governance/template">RFC Template</a>
              <a href="/governance/smart-contracts">Smart Contracts</a>
            </div>
          </div>
          <div className="nav-group">
            <a className="nav-trigger" href="/docs">Docs</a>
            <div className="nav-menu">
              <span className="nav-eyebrow">Docs</span>
              <a href="/docs/implementation">Implementation</a>
              <a href="/docs/security">Security Guide</a>
              <a href="/docs/secure-coding">Secure Coding</a>
              <a href="/docs/incident-response">Incident Response</a>
              <a href="/docs/faq">FAQ</a>
              <a href="/docs/glossary">Glossary</a>
            </div>
          </div>
          <div className="nav-group">
            <a className="nav-trigger" href="/interest">Engage</a>
            <div className="nav-menu">
              <span className="nav-eyebrow">Engage</span>
              <a href="/interest">Express Interest</a>
              <a href="/projects">Project Hub</a>
              <a href="/contribute">Contribute</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
