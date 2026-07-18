import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
      <section className="not-found-hero">
        <div className="not-found-bg" aria-hidden="true">
          <div className="hero-gradient"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="not-found-content">
          <span className="not-found-code" aria-hidden="true">404</span>
          <h1 className="not-found-title">Page not found</h1>
          <p className="not-found-desc">
            This path doesn't exist in the localLOOP hub.
          </p>
          <a className="button primary" href="/">Back to home</a>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Quick links</h2>
        <div className="quick-start">
          <a href="/protocol" className="quick-start-card">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-book-open"></i>
            </span>
            <h3>Protocol</h3>
            <p>Specification, schemas, and changelog.</p>
          </a>
          <a href="/docs" className="quick-start-card">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-code"></i>
            </span>
            <h3>Docs</h3>
            <p>Implementation guides and operator playbooks.</p>
          </a>
          <a href="/library" className="quick-start-card">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-books"></i>
            </span>
            <h3>Library</h3>
            <p>JSON schemas, contexts, and example payloads.</p>
          </a>
        </div>
      </section>

      </main>
      <SiteFooter />
    </>
  );
}
