import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';

export default function FaqPage() {
  return (
    <>
      <SiteHeader subtitle="FAQ" />

      <section className="hero">
        <div className="hero-card">
          <div className="badge">Frequently asked questions</div>
          <h2>Answers to common protocol and implementation questions.</h2>
          <p>
            This FAQ reflects the current early-stage status of LocalLoop.
          </p>
          <div className="cta-row">
            <a
              className="button primary"
              href="/viewer.html?path=projects/loop-protocol/docs/faq.md&title=FAQ"
            >
              Open FAQ
            </a>
            <a className="button secondary" href="/docs">Back to docs</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Need more help?</h3>
          <p>Use the interest form to ask about pilots or partnerships.</p>
          <div className="cta-row">
            <a className="button primary" href="/interest">Express interest</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
