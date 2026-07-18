import { MaturityStatus } from '@/app/components/MaturityStatus';
import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'DEMO City', path: '/platform/demo-city' });

export default function DemoCityPage() {
  return (
    <div className="content-stack" data-demo-city>

      {/* City header */}
      <div className="content-panel">
        <div className="demo-city-header">
          <div className="demo-city-identity">
            <h2>DEMO City</h2>
            <span className="demo-node-id">demo.loop</span>
          </div>
          <span className="demo-badge">Lab Demo</span>
        </div>
        <p>
          A read-only demonstration of a localLOOP lab node. Material registry, offers,
          matches, and transfers are example lab data fetched from the API. This is not a
          public deployment, logistics system, or financial-settlement service.
        </p>
        <MaturityStatus>Read-only lab evidence only. Availability and displayed data may change without notice.</MaturityStatus>
        <div className="status-notice">
          <strong>No public deployment.</strong> This demo illustrates a possible city-portal interface
          with seeded lab data; it does not predict a live-node experience.
          <a href="/interest">Register city interest</a>
        </div>
        <div data-demo-heartbeat className="demo-heartbeat" role="status" aria-live="polite">
          Checking node status…
        </div>
      </div>

      {/* Activity stats */}
      <div className="content-panel">
        <h3>Node activity</h3>
        <div className="demo-stats-grid" data-demo-stats>
          <div className="demo-stat-card"><span className="demo-stat-value">—</span><span className="demo-stat-label">Materials</span></div>
          <div className="demo-stat-card"><span className="demo-stat-value">—</span><span className="demo-stat-label">Offers</span></div>
          <div className="demo-stat-card"><span className="demo-stat-value">—</span><span className="demo-stat-label">Matches</span></div>
          <div className="demo-stat-card"><span className="demo-stat-value">—</span><span className="demo-stat-label">Transfers</span></div>
        </div>
      </div>

      {/* Material Registry */}
      <div className="content-panel">
        <h3>Material registry</h3>
        <p>Live MaterialDNA records from the lab API. Filter by city node.</p>
        <div className="demo-filter-row" role="group" aria-label="Filter material registry by city">
          <button className="demo-filter-btn active" data-demo-filter="all" aria-pressed="true">All cities</button>
          <button className="demo-filter-btn" data-demo-filter="munich" aria-pressed="false">Munich</button>
          <button className="demo-filter-btn" data-demo-filter="berlin" aria-pressed="false">Berlin</button>
          <button className="demo-filter-btn" data-demo-filter="demo" aria-pressed="false">DEMO nodes</button>
        </div>
        <div data-demo-materials>
          <div className="notice">Loading material registry…</div>
        </div>
      </div>

      {/* Protocol Flows — tabbed */}
      <div className="content-panel">
        <h3>Protocol flows</h3>
        <p>Offers, matches, and transfers from the live lab backend.</p>
        <div className="demo-tab-row" role="tablist" aria-label="Protocol flow data">
          <button className="demo-tab-btn" id="demo-tab-offers" role="tab" data-demo-tab="offers" aria-controls="demo-panel-offers" aria-selected="true">Offers</button>
          <button className="demo-tab-btn" id="demo-tab-matches" role="tab" data-demo-tab="matches" aria-controls="demo-panel-matches" aria-selected="false" tabIndex={-1}>Matches</button>
          <button className="demo-tab-btn" id="demo-tab-transfers" role="tab" data-demo-tab="transfers" aria-controls="demo-panel-transfers" aria-selected="false" tabIndex={-1}>Transfers</button>
        </div>
        <div id="demo-panel-offers" data-panel="offers" role="tabpanel" aria-labelledby="demo-tab-offers" tabIndex={0}>
          <div data-demo-offers><div className="notice">Loading offers…</div></div>
        </div>
        <div id="demo-panel-matches" data-panel="matches" role="tabpanel" aria-labelledby="demo-tab-matches" tabIndex={0} hidden>
          <div data-demo-matches><div className="notice">Loading matches…</div></div>
        </div>
        <div id="demo-panel-transfers" data-panel="transfers" role="tabpanel" aria-labelledby="demo-tab-transfers" tabIndex={0} hidden>
          <div data-demo-transfers><div className="notice">Loading transfers…</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Read-only demonstration</h3>
        <p>
          Public material registration is disabled to avoid creating persistent lab records from this site.
          Use the <a href="/docs/lab-demo">local lab demo guide</a> to evaluate write-capable flows in a controlled environment.
        </p>
      </div>

      {/* Live Event Stream */}
      <div className="content-panel">
        <h3>
          Live event stream
          <span className="demo-stream-dot demo-stream-dot-live" style={{marginLeft:'10px', display:'inline-block', verticalAlign:'middle'}}></span>
        </h3>
        <p>
          Server-Sent Events from <code>/api/v1/stream</code>. This read-only display may show
          example lab events; it is not operational monitoring evidence.
        </p>
        <div className="demo-stream" data-demo-stream>
          <div className="demo-stream-idle">Connecting to event stream…</div>
        </div>
      </div>

      {/* LoopSignal Config */}
      <div className="content-panel">
        <h3>LoopSignal configuration</h3>
        <p>
          Signal values used in this demo node (<code>demo.loop</code>). Values are from the
          example LoopSignalConfig payload and are illustrative. A production governance model
          would need to define how community-voted signals are proposed, approved, and published;
          this demo does not establish that process.
        </p>
        <div className="demo-signal-list">
          {[
            ['Organic food',   0.40],
            ['Plastic PET',    0.20],
            ['Paper clean',    0.65],
            ['Glass clear',    0.55],
            ['Metal steel',    0.75],
            ['Textile cotton', 0.30],
            ['E-waste mixed',  0.80],
            ['Default',        0.05],
          ].map(([label, val]) => (
            <div key={label} className="demo-signal-row">
              <span className="demo-signal-label">{label}</span>
              <div className="demo-signal-bar">
                <div className="demo-signal-fill" style={{width: `${Math.round(val * 100)}%`}}></div>
              </div>
              <span className="demo-signal-value">{val.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <p style={{marginTop:'12px', fontSize:'0.85rem', color:'var(--ink-soft)'}}>
          Higher values may lower a modelled import penalty; they do not guarantee demand,
          routing, locality, or settlement outcomes.
          See <a href="/platform/loopsignal">LoopSignal</a> and <a href="/platform/loopcost">LoopCost</a>.
        </p>
      </div>

      {/* Node info */}
      <div className="content-panel">
        <h3>Illustrative node configuration</h3>
        <div className="table-list">
          <div><span>Example node ID</span><div><code>demo.loop</code></div></div>
          <div><span>Example payload version</span><div>v0.2.0</div></div>
          <div><span>Value model</span><div>LC-DEMO — illustrative draft fields only; no backing, currency operation, or settlement is provided.</div></div>
          <div><span>Example capability labels</span><div>material-registry · loopcoin · loopsignal · federation</div></div>
          <div><span>Referenced lab API</span><div><a href="https://loop-api.urbnia.com/docs" target="_blank" rel="noopener noreferrer">loop-api.urbnia.com/docs</a></div></div>
          <div><span>Status</span><div>Lab demo only — no real logistics or settlement</div></div>
        </div>
        <div className="cta-row" style={{marginTop:'16px'}}>
          <a className="button secondary" href="/protocol/spec">Review the protocol</a>
          <a className="button secondary" href="/platform/city-portals">City portals</a>
          <a className="button primary" href="/interest">Register city interest</a>
        </div>
      </div>

    </div>
  );
}
