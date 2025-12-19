import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';

export default function ExamplesPage() {
  return (
    <>
      <SiteHeader subtitle="Example Payloads" />

      <section className="hero">
        <div className="hero-card">
          <div className="badge">Validated examples</div>
          <h2>Reference payloads for the full LOOP flow.</h2>
          <p>
            These examples demonstrate validated payloads that align with the schema
            library and specification.
          </p>
          <div className="cta-row">
            <a className="button primary" href="/library">Back to library</a>
            <a
              className="button secondary"
              href="/viewer.html?path=projects/loop-protocol/examples/README.md&title=Examples"
            >
              Example README
            </a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Example flows</h3>
          <div className="table-list">
            <div><span>Registration</span><div>Material onboarding payload</div></div>
            <div><span>Payments</span><div>LoopCoin transfer sample</div></div>
            <div><span>Signals</span><div>Community voting record</div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <h3>Validated examples</h3>
        <div className="grid">
          <div className="card">
            <h4>Material Registration</h4>
            <p>Full MaterialDNA payload for onboarding a batch.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/01-material-registration.json&title=Material%20Registration">View example</a>
          </div>
          <div className="card">
            <h4>LoopCoin Transfer</h4>
            <p>Local currency payment linked to material flow.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/02-loopcoin-transfer.json&title=LoopCoin%20Transfer">View example</a>
          </div>
          <div className="card">
            <h4>Signal Voting</h4>
            <p>LoopVote result record after community vote.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/03-signal-voting.json&title=Signal%20Voting">View example</a>
          </div>
          <div className="card">
            <h4>Cross-City Trade</h4>
            <p>Material transaction with LoopCost breakdown.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/04-cross-city-trade.json&title=Cross-City%20Trade">View example</a>
          </div>
          <div className="card">
            <h4>Complete Flow</h4>
            <p>Multi-step flow from registration to settlement.</p>
            <a href="/viewer.html?path=projects/loop-protocol/examples/05-complete-flow.json&title=Complete%20Flow">View example</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
