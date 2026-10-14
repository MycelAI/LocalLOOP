import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Lab demo', path: '/docs/lab-demo' });

export default function LabDemoPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">Lab Demo</h1>
        <p>
          This lab demo runs a full MaterialDNA/ProductDNA → Offer → Match → Transfer
          flow using the sandbox API. It is not a pilot or production deployment.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/protocol/spec/">Open specification</a>
          <a className="button secondary" href="/docs/">Back to docs</a>
        </div>
      </div>

      <div className="content-panel">
        <h2>Run the demo locally</h2>
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
          <div><span>Events stream</span><div><code>/api/v1/stream</code> (SSE)</div></div>
          <div><span>Event log</span><div><code>/api/v1/events</code></div></div>
          <div><span>Metrics</span><div><code>/api/metrics</code></div></div>
          <div><span>Privacy notice</span><div><code>/api/privacy</code></div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Optional API key protection</h2>
        <p>
          If you enable API key protection, write endpoints require an <code>x-api-key</code>
          header (or <code>Authorization: Bearer &lt;key&gt;</code>). This is optional and
          disabled by default.
        </p>
        <div className="code-block">
          <pre><code>{`API_KEY_ENABLED=true\nAPI_KEY=change-me`}</code></pre>
        </div>
      </div>

      <div className="content-panel">
        <h2>Federation relay demo (two nodes)</h2>
        <p>
          Spins up two local node instances and relays events to demonstrate
          lab-only federation messaging. Nodes share a single lab database for
          convenience and do not represent production federation.
        </p>
        <div className="code-block">
          <pre><code>{`bun run lab:federation`}</code></pre>
        </div>
        <div className="table-list">
          <div><span>Relay endpoint</span><div><code>/api/v1/relay</code></div></div>
          <div><span>Events stream</span><div><code>/api/v1/stream</code> (SSE)</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h2>Interop flow snapshot</h2>
        <p>Conceptual view of the four-step lab flow.</p>
        <div className="media-card">
          <img src="/assets/images/lab-demo-flow.svg" alt="Lab demo flow snapshot" />
        </div>
      </div>

      <div className="content-panel">
        <h2>Event timeline preview</h2>
        <p>Sample output from the lab simulation script.</p>
        <div className="media-card">
          <img src="/assets/images/lab-demo-events.svg" alt="Lab demo event timeline" />
        </div>
      </div>
    </div>
  );
}
