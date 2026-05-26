export const metadata = {
  alternates: {
    canonical: '/platform/demo-city',
  },
};

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
          A live demonstration of a localLOOP city node. Material registry, active offers,
          matches, and transfers are fetched in real time from the lab API. The register form
          writes to the live backend. This is a controlled lab environment — no real logistics
          or financial settlement takes place.
        </p>
        <div className="status-notice">
          <strong>No public deployment.</strong> This demo shows what a city portal will look like
          when a real node is operating. Data is seeded lab data.
          <a href="/interest">Register city interest</a>
        </div>
        <div data-demo-heartbeat className="demo-heartbeat">
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
        <div className="demo-filter-row">
          <button className="demo-filter-btn active" data-demo-filter="all">All cities</button>
          <button className="demo-filter-btn" data-demo-filter="munich">Munich</button>
          <button className="demo-filter-btn" data-demo-filter="berlin">Berlin</button>
          <button className="demo-filter-btn" data-demo-filter="demo">DEMO nodes</button>
        </div>
        <div data-demo-materials>
          <div className="notice">Loading material registry…</div>
        </div>
      </div>

      {/* Protocol Flows — tabbed */}
      <div className="content-panel">
        <h3>Protocol flows</h3>
        <p>Offers, matches, and transfers from the live lab backend.</p>
        <div className="demo-tab-row">
          <button className="demo-tab-btn" data-demo-tab="offers">Offers</button>
          <button className="demo-tab-btn" data-demo-tab="matches">Matches</button>
          <button className="demo-tab-btn" data-demo-tab="transfers">Transfers</button>
        </div>
        <div data-panel="offers">
          <div data-demo-offers><div className="notice">Loading offers…</div></div>
        </div>
        <div data-panel="matches" hidden>
          <div data-demo-matches><div className="notice">Loading matches…</div></div>
        </div>
        <div data-panel="transfers" hidden>
          <div data-demo-transfers><div className="notice">Loading transfers…</div></div>
        </div>
      </div>

      {/* Register Material */}
      <div className="content-panel">
        <h3>Register a material</h3>
        <p>
          Submit a MaterialDNA record to the live lab API. The entry will appear in the
          material registry above and emit a <code>material.created</code> event in the stream.
        </p>
        <form className="interest-form" data-demo-register>
          <div className="field">
            <label htmlFor="demo-category">Category</label>
            <select id="demo-category" name="category">
              <option value="plastic-pet">Plastic PET</option>
              <option value="plastic-hdpe">Plastic HDPE</option>
              <option value="plastic-mixed">Plastic Mixed</option>
              <option value="metal-steel">Metal Steel</option>
              <option value="metal-aluminum">Metal Aluminium</option>
              <option value="organic-food">Organic Food</option>
              <option value="organic-wood">Organic Wood</option>
              <option value="glass-clear">Glass Clear</option>
              <option value="paper-clean">Paper Clean</option>
              <option value="cardboard">Cardboard</option>
              <option value="textile-cotton">Textile Cotton</option>
              <option value="ewaste-mixed">E-Waste Mixed</option>
            </select>
          </div>
          <div className="field" style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'10px'}}>
            <div>
              <label htmlFor="demo-quantity">Quantity</label>
              <input id="demo-quantity" name="quantity" type="number" min="0.01" max="1000000" step="0.01" defaultValue="100" required />
            </div>
            <div>
              <label htmlFor="demo-unit">Unit</label>
              <select id="demo-unit" name="unit">
                <option value="kg">kg</option>
                <option value="t">t</option>
                <option value="l">l</option>
                <option value="piece">piece</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="demo-city">City</label>
            <input id="demo-city" name="city" type="text" defaultValue="DEMO City" maxLength={80} />
          </div>
          <div className="field">
            <button className="button primary" type="submit">Register material</button>
          </div>
          <div
            data-demo-register-status
            className="notice"
            hidden
            aria-live="polite"
          >
          </div>
        </form>
      </div>

      {/* Live Event Stream */}
      <div className="content-panel">
        <h3>
          Live event stream
          <span className="demo-stream-dot demo-stream-dot-live" style={{marginLeft:'10px', display:'inline-block', verticalAlign:'middle'}}></span>
        </h3>
        <p>
          Server-Sent Events from <code>/api/v1/stream</code>. New material registrations,
          offer publications, matches, and transfers appear here in real time.
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
          example LoopSignalConfig payload and are illustrative — a real node would publish
          community-voted signals via the governance process.
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
          Higher values signal local demand — import penalties drop, attracting offers from
          neighbouring nodes. Lower values keep surplus in circulation locally.
          See <a href="/platform/loopsignal">LoopSignal</a> and <a href="/platform/loopcost">LoopCost</a>.
        </p>
      </div>

      {/* Node info */}
      <div className="content-panel">
        <h3>Node capabilities</h3>
        <div className="table-list">
          <div><span>Node ID</span><div><code>demo.loop</code></div></div>
          <div><span>Protocol version</span><div>v0.2.0</div></div>
          <div><span>Currency</span><div>LC-DEMO (LoopCoin, backed by EUR, 6-month expiry)</div></div>
          <div><span>Capabilities</span><div>material-registry · loopcoin · loopsignal · federation</div></div>
          <div><span>Lab API</span><div><a href="https://loop-api.urbnia.com/docs" target="_blank" rel="noopener noreferrer">loop-api.urbnia.com/docs</a></div></div>
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
