export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img
            src="/assets/local-loop-logo.png"
            alt=""
            className="footer-logo"
            width={22}
            height={22}
          />
          <span className="footer-wordmark">
            local<span className="footer-wordmark-accent">LOOP</span>
          </span>
          <span className="footer-tagline">
            Open protocol for circular economy infrastructure
          </span>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="/protocol/">Protocol</a>
          <a href="/docs/">Documentation</a>
          <a href="/governance/">Governance</a>
          <a
            href="https://github.com/local-loop-io"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
        <div className="footer-legal">
          © 2025–2026 Mycel UG (haftungsbeschränkt). All rights reserved.
        </div>
      </div>
    </footer>
  );
}
