import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';

export default function SecureCodingPage() {
  return (
    <>
      <SiteHeader subtitle="Secure Coding" />

      <section className="hero">
        <div className="hero-card">
          <div className="badge">Developer guidance</div>
          <h2>Secure coding practices for LOOP services.</h2>
          <p>
            Guardrails for building secure integrations and services in the LocalLoop
            ecosystem.
          </p>
          <div className="cta-row">
            <a
              className="button primary"
              href="/viewer.html?path=projects/loop-protocol/docs/secure-coding.md&title=Secure%20Coding"
            >
              Open guide
            </a>
            <a className="button secondary" href="/docs">Back to docs</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Focus areas</h3>
          <div className="table-list">
            <div><span>Data handling</span><div>Validation and sanitization</div></div>
            <div><span>Infrastructure</span><div>Credential and secret hygiene</div></div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
