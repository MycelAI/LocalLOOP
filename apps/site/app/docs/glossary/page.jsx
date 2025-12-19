import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';

export default function GlossaryPage() {
  return (
    <>
      <SiteHeader subtitle="Glossary" />

      <section className="hero">
        <div className="hero-card">
          <div className="badge">Shared vocabulary</div>
          <h2>Standard terminology for the LOOP ecosystem.</h2>
          <p>
            Reference terminology that appears across the specification and docs.
          </p>
          <div className="cta-row">
            <a
              className="button primary"
              href="/viewer.html?path=projects/loop-protocol/docs/glossary.md&title=Glossary"
            >
              Open glossary
            </a>
            <a className="button secondary" href="/docs">Back to docs</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Terms you will see</h3>
          <div className="table-list">
            <div><span>Loop node</span><div>City-level protocol implementation</div></div>
            <div><span>MaterialDNA</span><div>Material identity primitives</div></div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
