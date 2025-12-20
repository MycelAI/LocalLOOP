import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <section className="section">
        <div className="content-panel">
          <div className="badge">404</div>
          <h2>This page could not be found.</h2>
          <p>
            The path you opened does not exist in the LocalLoop hub. Use the quick links
            below to jump back into the platform.
          </p>
          <div className="cta-row">
            <a className="button primary" href="/">Back to platform</a>
            <a className="button secondary" href="/interest">Express interest</a>
          </div>
        </div>

        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scroll"></i>
            </span>
            <h4>Protocol hub</h4>
            <p>Specification, changelog, and security policy.</p>
            <a href="/protocol">Open protocol</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-books"></i>
            </span>
            <h4>Library</h4>
            <p>Schemas and example payloads for implementers.</p>
            <a href="/library">Open library</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-notebook"></i>
            </span>
            <h4>Docs</h4>
            <p>Implementation guidance and operator playbooks.</p>
            <a href="/docs">Open docs</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
