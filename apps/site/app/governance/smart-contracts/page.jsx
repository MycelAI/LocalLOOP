import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';

export default function SmartContractsPage() {
  return (
    <>
      <SiteHeader subtitle="Smart Contract RFC" />

      <section className="hero">
        <div className="hero-card">
          <div className="badge">RFC 0004</div>
          <h2>Optional smart contract integration proposal.</h2>
          <p>
            Draft RFC describing how smart contracts could automate settlement flows.
          </p>
          <div className="cta-row">
            <a
              className="button primary"
              href="/viewer.html?path=projects/loop-protocol/rfcs/0004-smart-contract-integration.md&title=RFC%200004"
            >
              Open RFC 0004
            </a>
            <a className="button secondary" href="/governance">Back to governance</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Draft scope</h3>
          <div className="table-list">
            <div><span>Automation</span><div>Settlement and escrow flows</div></div>
            <div><span>Interoperability</span><div>Optional integration points</div></div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
