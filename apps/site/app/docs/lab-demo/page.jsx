export default function LabDemoPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Lab demo</div>
        <h2>Minimal interop flow (v0.1.1) in a controlled environment.</h2>
        <p>
          This lab demo runs a full MaterialDNA → Offer → Match → Transfer flow
          using the sandbox API. It is not a pilot or production deployment.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/viewer.html?path=projects/loop-protocol/SPECIFICATION.md&title=LOOP%20Protocol%20Spec">
            Open specification
          </a>
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Run the demo locally</h3>
        <ol className="table-list">
          <li>
            <span>Start infrastructure</span>
            <div>Bring up Postgres + Redis + MinIO with docker compose.</div>
          </li>
          <li>
            <span>Execute the demo</span>
            <div>Run the single command to migrate, seed, and simulate.</div>
          </li>
          <li>
            <span>Review output</span>
            <div>Use the timeline log and events stream for validation.</div>
          </li>
        </ol>
        <div className="code-block">
          <pre><code>{`cp .env.docker.example .env.docker
docker compose --env-file .env.docker up -d
bun run lab:demo`}</code></pre>
        </div>
        <div className="table-list">
          <div><span>Events stream</span><div>`/api/loop/stream` (SSE)</div></div>
          <div><span>Event log</span><div>`/api/loop/events`</div></div>
          <div><span>Metrics</span><div>`/api/metrics`</div></div>
          <div><span>Privacy notice</span><div>`/api/privacy`</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Optional API key protection</h3>
        <p>
          If you enable API key protection, write endpoints require an `x-api-key`
          header (or `Authorization: Bearer &lt;key&gt;`). This is optional and
          disabled by default.
        </p>
        <div className="code-block">
          <pre><code>{`API_KEY_ENABLED=true\nAPI_KEY=change-me`}</code></pre>
        </div>
      </div>

      <div className="content-panel">
        <h3>Federation relay demo (two nodes)</h3>
        <p>
          Spins up two local node instances and relays events to demonstrate
          lab-only federation messaging. Nodes share a single lab database for
          convenience and do not represent production federation.
        </p>
        <div className="code-block">
          <pre><code>{`bun run lab:federation`}</code></pre>
        </div>
        <div className="table-list">
          <div><span>Relay endpoint</span><div>`/api/loop/relay`</div></div>
          <div><span>Events stream</span><div>`/api/loop/stream` (SSE)</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>Interop flow snapshot</h3>
        <p>Conceptual view of the four-step lab flow.</p>
        <div className="media-card">
          <img src="/assets/images/lab-demo-flow.svg" alt="Lab demo flow snapshot" />
        </div>
      </div>

      <div className="content-panel">
        <h3>Event timeline preview</h3>
        <p>Sample output from the lab simulation script.</p>
        <div className="media-card">
          <img src="/assets/images/lab-demo-events.svg" alt="Lab demo event timeline" />
        </div>
      </div>
    </div>
  );
}
