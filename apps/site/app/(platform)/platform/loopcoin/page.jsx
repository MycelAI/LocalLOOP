import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export const metadata = {
  alternates: {
    canonical: '/platform/loopcoin',
  },
};

export default function LoopCoinPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2>LoopCoin</h2>
        <p>
          LoopCoin (LC) is a node-issued local currency used to settle material and product
          transfers between federation peers. Each node issues its own LoopCoin with configurable
          expiry and decay rules, keeping value circulating locally while enabling inter-node
          clearing. This is an early-stage lab concept with no public pilots yet.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/platform/loopsignal">
            LoopSignal
          </a>
          <a className="button secondary" href="/platform/loopcost">
            LoopCost
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Scope & boundaries</h3>
        <div className="table-list">
          <div><span>In scope</span><div>Node-issued currency configuration, peer-to-peer transfers, and inter-node settlement batching.</div></div>
          <div><span>Out of scope</span><div>Fiat on/off ramps, external exchange listings, or legally regulated financial instruments.</div></div>
          <div><span>Status</span><div>Lab-demo concept only — no public pilots or deployments yet.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>How it works</h3>
        <div className="table-list">
          <div><span>Issuance</span><div>Each city node issues its own LoopCoin (e.g., LC-MUC for Munich). The node defines exchange rate, expiry window (1–12 months), and optional decay rate after expiry.</div></div>
          <div><span>Local bonus</span><div>Nodes may apply a local spending bonus (up to 50%) to incentivise circulation within their own community before value overflows to neighbours.</div></div>
          <div><span>Transfers</span><div>Peer-to-peer LoopCoinTransfer payloads record sender, recipient, amount, currency code, and optional material reference.</div></div>
          <div><span>Inter-node settlement</span><div>InterNodeSettlement batches cross-node transfers, applies export and import penalties derived from LoopSignals, and records the clearing method (gross, netting, or clearing).</div></div>
          <div><span>Expiry & decay</span><div>Unspent LoopCoin expires after the configured window and decays at the node-defined rate — ensuring value stays in motion and does not accumulate indefinitely.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Data model snapshot</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-sliders"></i>
            </span>
            <h4>LoopCoinConfig</h4>
            <p>Issuer, currency code, backing currency, exchange rate, expiry months, decay rate, and reserve ratio.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-arrow-right"></i>
            </span>
            <h4>LoopCoinTransfer</h4>
            <p>Sender, recipient, amount, currency, optional material reference, timestamp, and digital signature.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-arrows-left-right"></i>
            </span>
            <h4>InterNodeSettlement</h4>
            <p>Batch of cross-node transfers with fees (export penalty, import penalty, distance cost) and settlement method.</p>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Current status</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scroll"></i>
            </span>
            <h4>Specification</h4>
            <p>LoopCoin schema and settlement rules are defined in the protocol spec.</p>
            <a href="/protocol/spec">Read the spec</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-map-pin"></i>
            </span>
            <h4>Status</h4>
            <p>No public pilots or deployments yet.</p>
            <a href="/interest">Register interest</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-coins"></i>
            </span>
            <h4>Settlement</h4>
            <p>LoopCost formula governs penalties applied during inter-node clearing.</p>
            <a href="/platform/loopcost">LoopCost →</a>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/schemas/loopcoin.schema.json" />
      </div>
    </div>
  );
}
