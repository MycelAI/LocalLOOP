import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Documentation', path: '/docs' });

export default function DocsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">Documentation</h1>
        <p>
          Operator and developer guides for building with LOOP. Guidance evolves as the
          protocol matures, scoped to lab-demo infrastructure.
        </p>
        <p className="text-soft">
          City representatives: start with{' '}
          <a href="/docs/regulatory-alignment/">Regulatory Alignment</a> and the{' '}
          <a href="/docs/implementation/">Implementation Guide</a> for a
          decision-maker overview before diving into technical detail.
        </p>
      </div>

      <div className="content-panel">
        <div className="grid">
          <a className="card has-icon" href="/docs/regulatory-alignment/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-scales"></i>
            </span>
            <h3>Regulatory Alignment</h3>
            <p>EU DPP, Battery Passport, PPWR, DIWASS — city action timeline and roadmap.</p>
          </a>
          <a className="card has-icon" href="/docs/implementation/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-gear"></i>
            </span>
            <h3>Implementation Guide</h3>
            <p>Executive summary for city decision-makers, then full node setup checklist.</p>
          </a>
          <a className="card has-icon" href="/docs/faq/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-question"></i>
            </span>
            <h3>FAQ</h3>
            <p>Cost, GDPR, governance, and compliance timeline questions answered.</p>
          </a>
          <a className="card has-icon" href="/docs/glossary/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-book-open-text"></i>
            </span>
            <h3>Glossary</h3>
            <p>Shared vocabulary for the LOOP ecosystem, including city operations terms.</p>
          </a>
          <a className="card has-icon" href="/docs/lab-demo/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-activity"></i>
            </span>
            <h3>Lab Demo</h3>
            <p>Run the minimal interop flow in a controlled environment.</p>
          </a>
          <a className="card has-icon" href="/docs/api/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-file-doc"></i>
            </span>
            <h3>API Docs</h3>
            <p>Redoc reference for the public lab API.</p>
          </a>
          <a className="card has-icon" href="/docs/federation/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-shuffle"></i>
            </span>
            <h3>Federation Handshake</h3>
            <p>Lab-only handshake and registry endpoints.</p>
          </a>
          <a className="card has-icon" href="/docs/metrics/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-gauge"></i>
            </span>
            <h3>Metrics</h3>
            <p>Live counters for lab activity and event flow.</p>
          </a>
          <a className="card has-icon" href="/docs/security/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-shield-check"></i>
            </span>
            <h3>Security Guide</h3>
            <p>Operational security playbook for node operators.</p>
          </a>
          <a className="card has-icon" href="/docs/secure-coding/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-lock"></i>
            </span>
            <h3>Secure Coding</h3>
            <p>Developer guardrails for building LOOP services.</p>
          </a>
          <a className="card has-icon" href="/docs/incident-response/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-siren"></i>
            </span>
            <h3>Incident Response</h3>
            <p>Prepare for containment, recovery, and post-mortems.</p>
          </a>
          <a className="card has-icon" href="/docs/threat-model/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-warning-circle"></i>
            </span>
            <h3>Threat Model</h3>
            <p>STRIDE-lite baseline for lab environments.</p>
          </a>
          <a className="card has-icon" href="/docs/dpia-lite/">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-bold ph-clipboard-text"></i>
            </span>
            <h3>DPIA Lite</h3>
            <p>Baseline data protection assessment for lab demos.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
