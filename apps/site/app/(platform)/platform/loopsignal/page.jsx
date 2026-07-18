import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { MaturityStatus } from '@/app/components/MaturityStatus';
import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'LoopSignal', path: '/platform/loopsignal' });

export default function LoopSignalPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2>LoopSignal</h2>
        <p>
          LoopSignal is a draft preference-signal model for lab discussions of demand or surplus intent
          by material category. It can be used in examples of routing and matching, but it does not
          collect community input, govern a node, or determine operational priorities.
        </p>
        <MaturityStatus />
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
          <div><span>In scope</span><div>Draft signal configuration, proposed voting fields, and scenario routing weights.</div></div>
          <div><span>Out of scope</span><div>Individual user preference tracking, binding regulatory commitments, or financial instruments.</div></div>
          <div><span>Status</span><div>Lab-demo concept only — no public pilots or deployments yet.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>How it works</h3>
        <div className="table-list">
          <div><span>Signal values</span><div>Lab examples use a 0.0–1.0 value to represent an illustrative scenario input, not measured demand or surplus.</div></div>
          <div><span>Material categories</span><div>Signals cover 30+ standardised categories: plastics (PET, HDPE, PVC, mixed), metals (steel, aluminium, copper), organics, glass, paper, cardboard, textiles, and e-waste.</div></div>
          <div><span>Governance</span><div>Draft SignalProposal, LoopVote, and LoopSignalConfig payloads include fields that could support a future governance process; no approval or publication process is running here.</div></div>
          <div><span>Routing effect</span><div>Examples may use values as inputs to a draft penalty calculation; they do not predict offers, routing, or locality.</div></div>
          <div><span>Validity window</span><div>Draft payloads include valid_from and valid_until fields; they do not ensure that a routing system uses current or approved values.</div></div>
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
            <p>Draft LoopSignal fields and proposed governance rules are documented in the protocol spec.</p>
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
            <p>Lab examples may use LoopSignal values as inputs to a draft LoopCost calculation.</p>
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
