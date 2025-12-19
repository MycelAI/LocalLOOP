import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';

export default function RfcTemplatePage() {
  return (
    <>
      <SiteHeader subtitle="RFC Template" />

      <section className="hero">
        <div className="hero-card">
          <div className="badge">RFC template</div>
          <h2>Standard template for drafting new proposals.</h2>
          <p>
            Use the template to structure proposals consistently across the protocol.
          </p>
          <div className="cta-row">
            <a
              className="button primary"
              href="/viewer.html?path=projects/loop-protocol/rfcs/0000-template.md&title=RFC%20Template"
            >
              Open template
            </a>
            <a className="button secondary" href="/governance">Back to governance</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Template sections</h3>
          <div className="table-list">
            <div><span>Summary</span><div>What changes and why</div></div>
            <div><span>Specification</span><div>API and schema updates</div></div>
            <div><span>Rollout</span><div>Migration and compatibility notes</div></div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
