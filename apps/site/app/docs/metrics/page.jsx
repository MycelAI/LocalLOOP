export default function MetricsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">Observability</div>
        <h2>Lab metrics dashboard.</h2>
        <p>
          Live counters from the LOOP lab API. This is a demo-grade snapshot to
          validate activity in a controlled environment.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/docs/lab-demo">Lab demo guide</a>
          <a className="button secondary" href="/docs/api">API docs</a>
        </div>
      </div>

      <div className="content-panel">
        <h3>Live counters</h3>
        <div data-metrics-panel className="metrics-panel"></div>
      </div>
    </div>
  );
}
