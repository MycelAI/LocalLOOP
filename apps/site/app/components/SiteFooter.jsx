export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img
            src="/assets/local-loop-logo.png"
            alt="localLOOP"
            className="footer-logo"
            width={28}
            height={28}
          />
          <span className="footer-wordmark">local<span className="footer-wordmark-accent">LOOP</span></span>
        </div>
        <div className="footer-tagline">
          Open protocol for circular economy infrastructure
        </div>
        <div className="footer-links">
          <a href="/protocol">Protocol</a>
          <a href="/docs">Documentation</a>
          <a href="/governance">Governance</a>
          <a href="https://github.com/local-loop-io" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div className="footer-legal">
          © 2025–2026 localLOOP. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
