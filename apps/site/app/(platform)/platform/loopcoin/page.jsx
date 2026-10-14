import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { MaturityStatus } from '@/app/components/MaturityStatus';
import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'LoopCoin', path: '/platform/loopcoin' });

export default function LoopCoinPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">LoopCoin</h1>
        <p>
          LoopCoin (LC) is a draft data model for lab discussions of node-issued value, transfer,
          expiry, decay, and potential settlement flows. It does not operate a currency, process
          payments, or demonstrate cross-node clearing.
        </p>
        <MaturityStatus />
        <div className="cta-row">
          <a className="button secondary" href="/platform/loopsignal/">
            LoopSignal
          </a>
          <a className="button secondary" href="/platform/loopcost/">
            LoopCost
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h2>Scope & boundaries</h2>
        <div className="table-list">
          <div><span>In scope</span><div>Draft configuration, transfer, and settlement-batch fields for lab examples.</div></div>
          <div><span>Out of scope</span><div>Fiat on/off ramps, external exchange listings, or legally regulated financial instruments.</div></div>
          <div><span>Status</span><div>Lab-demo concept only — no public pilots or deployments yet.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>How it works</h2>
        <div className="table-list">
          <div><span>Issuance</span><div>Lab examples can describe a hypothetical node currency code, exchange rate, expiry window, and decay rate.</div></div>
          <div><span>Local bonus</span><div>A draft field can model a local-spending incentive; it does not demonstrate circulation or overflow behaviour.</div></div>
          <div><span>Transfers</span><div>LoopCoinTransfer is a draft payload shape for proposed sender, recipient, amount, currency code, and material-reference fields.</div></div>
          <div><span>Inter-node settlement</span><div>InterNodeSettlement is a draft batch record with example fees and clearing-method fields; no settlement is executed or verified.</div></div>
          <div><span>Expiry & decay</span><div>Lab scenarios can include expiry and decay parameters; they do not ensure any economic or operational outcome.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Data model snapshot</h2>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-sliders"></i>
            </span>
            <h3>LoopCoinConfig</h3>
            <p>Issuer, currency code, backing currency, exchange rate, expiry months, decay rate, and reserve ratio.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-arrow-right"></i>
            </span>
            <h3>LoopCoinTransfer</h3>
            <p>Sender, recipient, amount, currency, optional material reference, timestamp, and digital signature.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-arrows-left-right"></i>
            </span>
            <h3>InterNodeSettlement</h3>
            <p>Draft batch payload containing example transfer, fee, and settlement-method fields.</p>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Current status</h2>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-scroll"></i>
            </span>
            <h3>Specification</h3>
            <p>Draft LoopCoin fields and proposed settlement rules are documented in the protocol spec.</p>
            <a href="/protocol/spec/">Read the spec</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-map-pin"></i>
            </span>
            <h3>Status</h3>
            <p>No public pilots or deployments yet.</p>
            <a href="/interest/">Register interest</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-coins"></i>
            </span>
            <h3>Settlement</h3>
            <p>Lab examples may reference the draft LoopCost formula when comparing scenario inputs.</p>
            <a href="/platform/loopcost/">LoopCost →</a>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/schemas/loopcoin.schema.json" />
      </div>
    </div>
  );
}
