import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export const metadata = {
  alternates: {
    canonical: '/platform/loopsignal',
  },
};

export default function LoopSignalPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2>LoopSignal</h2>
        <p>
          LoopSignal is a community preference signal that expresses demand or surplus intent
          for specific material categories. Each city node publishes its own signal configuration
          through a local governance process. LoopSignals inform routing and matching across the
          federation, helping nodes prioritise the right resources for the right places.
          This is an early-stage lab concept with no public pilots yet.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/platform/loopcoin">
            LoopCoin
          </a>
          <a className="button secondary" href="/platform/loopcost">
            LoopCost
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Scope & boundaries</h3>
        <div className="table-list">
          <div><span>In scope</span><div>Node-level signal configuration, community voting on signal changes, and federation-aware routing weights.</div></div>
          <div><span>Out of scope</span><div>Individual user preference tracking, binding regulatory commitments, or financial instruments.</div></div>
          <div><span>Status</span><div>Lab-demo concept only — no public pilots or deployments yet.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>How it works</h3>
        <div className="table-list">
          <div><span>Signal values</span><div>Each signal is a number from 0.0 to 1.0 representing the node's preference weight for a material category (e.g., 0.8 for plastic-pet means high local demand).</div></div>
          <div><span>Material categories</span><div>Signals cover 30+ standardised categories: plastics (PET, HDPE, PVC, mixed), metals (steel, aluminium, copper), organics, glass, paper, cardboard, textiles, and e-waste.</div></div>
          <div><span>Governance</span><div>Signal changes go through a SignalProposal and LoopVote process. Results are recorded with turnout and approval percentages and published as LoopSignalConfig payloads.</div></div>
          <div><span>Routing effect</span><div>High signals for a category lower the effective import penalty for that material, attracting offers from neighbouring nodes. Low signals raise the export penalty, keeping surplus local.</div></div>
          <div><span>Validity window</span><div>Each LoopSignalConfig carries valid_from and valid_until timestamps, so routing decisions always use the current approved signal set.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Data model snapshot</h3>
        <div className="grid">
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-broadcast"></i>
            </span>
            <h4>LoopSignalConfig</h4>
            <p>Node identifier, signal values by category, validity window, and governance vote reference.</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-check-square"></i>
            </span>
            <h4>LoopVote</h4>
            <p>Vote ID, proposals (category, current/proposed value, rationale), voting period, and results (turnout, approval, status).</p>
          </div>
          <div className="card has-icon">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-pencil-line"></i>
            </span>
            <h4>SignalProposal</h4>
            <p>Proposed changes to signal values for one or more categories, with voting window and per-change rationale.</p>
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
            <p>LoopSignal schema and governance rules are defined in the protocol spec.</p>
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
              <i className="ph-thin ph-calculator"></i>
            </span>
            <h4>Effect on routing</h4>
            <p>LoopSignals feed directly into the LoopCost penalty formula.</p>
            <a href="/platform/loopcost">LoopCost →</a>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/schemas/loopsignal.schema.json" />
      </div>
    </div>
  );
}
