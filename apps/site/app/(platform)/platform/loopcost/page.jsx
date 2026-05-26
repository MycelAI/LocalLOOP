export const metadata = {
  alternates: {
    canonical: '/platform/loopcost',
  },
};

export default function LoopCostPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2>LoopCost</h2>
        <p>
          LoopCost is the total routing cost for any material or product transfer across
          the federation. It combines the base price with export and import penalties derived
          from LoopSignals, plus a distance cost. By design, LoopCost ensures local exchanges
          are always cheaper than cross-boundary ones, keeping circular value circulating close
          to its source.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/platform/loopsignal">
            LoopSignal
          </a>
          <a className="button secondary" href="/platform/loopcoin">
            LoopCoin
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>The formula</h3>
        <p>
          LoopCost is a computed value, not a standalone schema. It is calculated at routing
          time from three components:
        </p>
        <div className="table-list">
          <div><span>Base price</span><div>The material or product's stated transfer price in LoopCoin, set by the offering node.</div></div>
          <div><span>Export penalty</span><div>Applied when a material leaves its home node. Derived from the offering node's LoopSignal for the material's category — a low signal means the node wants to keep that material locally, raising the export penalty.</div></div>
          <div><span>Import penalty</span><div>Applied when a material arrives at the receiving node. Derived from the receiving node's LoopSignal — a high signal means strong local demand, lowering the import penalty to attract inbound offers.</div></div>
          <div><span>Distance cost</span><div>A small per-kilometre cost between nodes, ensuring physically adjacent cities trade more readily than distant ones regardless of signal values.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Why this matters</h3>
        <div className="table-list">
          <div><span>Local-first routing</span><div>Within a single node, LoopCost equals base price only — no penalties. Materials are always cheapest to exchange locally, making the circular economy default to its shortest loop.</div></div>
          <div><span>Community-governed penalties</span><div>Export and import penalties are not set by a central authority. They emerge from each city's democratically approved LoopSignal configuration, giving communities direct influence over material flows across their boundaries.</div></div>
          <div><span>Overflow mechanism</span><div>When local demand is saturated (low LoopSignals), penalties drop and surplus materials can flow to neighbouring nodes that need them — the "Overflow" in LOOP.</div></div>
          <div><span>Transparent routing decisions</span><div>Because the formula is public and signal values are published by each node, any participant can compute the cost of any exchange in advance and verify that routing decisions are fair.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Relationship to other concepts</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-broadcast"></i>
            </span>
            <h4>LoopSignal feeds penalties</h4>
            <p>Export and import penalties are computed directly from each node's published LoopSignalConfig for the relevant material category.</p>
            <a href="/platform/loopsignal">LoopSignal →</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-coins"></i>
            </span>
            <h4>LoopCoin settles payment</h4>
            <p>The LoopCost total is denominated in the transferring node's LoopCoin. Inter-node settlement clears net balances between nodes.</p>
            <a href="/platform/loopcoin">LoopCoin →</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scroll"></i>
            </span>
            <h4>Spec reference</h4>
            <p>The formal LoopCost formula and penalty derivation rules are defined in SPECIFICATION.md §4.</p>
            <a href="/protocol/spec">Protocol spec →</a>
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
            <p>LoopCost formula and penalty rules are defined in the protocol spec (§4).</p>
            <a href="/protocol/spec">Read the spec</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-map-pin"></i>
            </span>
            <h4>Status</h4>
            <p>Computed in lab demo flows. No public pilots or deployments yet.</p>
            <a href="/interest">Register interest</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-activity"></i>
            </span>
            <h4>Lab demo</h4>
            <p>LoopCost is applied in the match and transfer steps of the lab interop flow.</p>
            <a href="/docs/lab-demo">Lab demo →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
