import { MaturityStatus } from '@/app/components/MaturityStatus';
import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'LoopCost', path: '/platform/loopcost' });

export default function LoopCostPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2>LoopCost</h2>
        <p>
          LoopCost is a draft formula for comparing material or product transfer scenarios. It combines
          a stated base price with illustrative export and import penalties and a distance input. It is a lab model whose parameters and results
          require local validation; it does not guarantee locality, price, or cost outcomes.
        </p>
        <MaturityStatus />
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
          <div><span>Base price</span><div>An illustrative transfer-price input in a draft LoopCoin field, supplied by a lab scenario.</div></div>
          <div><span>Export penalty</span><div>A configurable lab input that a scenario may derive from a draft LoopSignal value; the policy meaning and effect require local validation.</div></div>
          <div><span>Import penalty</span><div>A configurable lab input that may model receiving-node preferences; it does not predict demand or route selection.</div></div>
          <div><span>Distance cost</span><div>An illustrative per-kilometre input for lab scenarios; it may influence comparisons but does not ensure trade behaviour.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Why this matters</h3>
        <div className="table-list">
          <div><span>Local-first hypothesis</span><div>Lab scenarios can model zero intra-node penalties. Actual local prices, decisions, and environmental outcomes depend on node policy and real-world conditions.</div></div>
          <div><span>Policy exploration</span><div>Lab examples can associate penalties with locally chosen draft signal values. They do not demonstrate democratic approval, governance outcomes, or community control.</div></div>
          <div><span>Overflow hypothesis</span><div>Scenarios can compare how changing penalties might affect an overflow-style exchange. They do not establish surplus handling, demand, or cross-node movement.</div></div>
          <div><span>Inspectable calculation</span><div>The draft formula makes scenario inputs reviewable. Inspectability alone does not establish fairness, correctness, or settlement outcomes.</div></div>
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
            <p>Lab scenarios may calculate illustrative penalties from draft LoopSignalConfig values for a material category.</p>
            <a href="/platform/loopsignal">LoopSignal →</a>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-coins"></i>
            </span>
            <h4>LoopCoin scenario fields</h4>
            <p>A lab scenario may denominate a calculated value in a draft LoopCoin field; no settlement or clearing operation is demonstrated.</p>
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
            <p>Lab examples may include a calculated LoopCost value alongside draft match and transfer payloads.</p>
            <a href="/docs/lab-demo">Lab demo →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
