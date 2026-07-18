import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Documentation', path: '/docs' });

export default function DocsPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h2 className="hub-heading">Documentation</h2>
        <p>
          Operator and developer guides for building with LOOP. Guidance evolves as the
          protocol matures, scoped to lab-demo infrastructure.
        </p>
        <p style={{marginTop: '8px', fontSize: '0.9rem', color: 'var(--ink-soft)'}}>
          City representatives: start with{' '}
          <a href="/docs/regulatory-alignment">Regulatory Alignment</a> and the{' '}
          <a href="/docs/implementation">Implementation Guide</a> for a
          decision-maker overview before diving into technical detail.
        </p>
      </div>

      <div className="content-panel">
        <div className="grid">
          <a className="card has-icon" href="/docs/regulatory-alignment">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-scales"></i>
            </span>
            <h4>Regulatory Alignment</h4>
            <p>EU DPP, Battery Passport, PPWR, DIWASS — city action timeline and roadmap.</p>
          </a>
          <a className="card has-icon" href="/docs/implementation">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-gear"></i>
            </span>
            <h4>Implementation Guide</h4>
            <p>Executive summary for city decision-makers, then full node setup checklist.</p>
          </a>
          <a className="card has-icon" href="/docs/faq">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-question"></i>
            </span>
            <h4>FAQ</h4>
            <p>Cost, GDPR, governance, and compliance timeline questions answered.</p>
          </a>
          <a className="card has-icon" href="/docs/glossary">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-book-open-text"></i>
            </span>
            <h4>Glossary</h4>
            <p>Shared vocabulary for the LOOP ecosystem, including city operations terms.</p>
          </a>
          <a className="card has-icon" href="/docs/lab-demo">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-activity"></i>
            </span>
            <h4>Lab Demo</h4>
            <p>Run the minimal interop flow in a controlled environment.</p>
          </a>
          <a className="card has-icon" href="/docs/api">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-file-doc"></i>
            </span>
            <h4>API Docs</h4>
            <p>Redoc reference for the public lab API.</p>
          </a>
          <a className="card has-icon" href="/docs/federation">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-shuffle"></i>
            </span>
            <h4>Federation Handshake</h4>
            <p>Lab-only handshake and registry endpoints.</p>
          </a>
          <a className="card has-icon" href="/docs/metrics">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-gauge"></i>
            </span>
            <h4>Metrics</h4>
            <p>Live counters for lab activity and event flow.</p>
          </a>
          <a className="card has-icon" href="/docs/security">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-shield-check"></i>
            </span>
            <h4>Security Guide</h4>
            <p>Operational security playbook for node operators.</p>
          </a>
          <a className="card has-icon" href="/docs/secure-coding">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-lock"></i>
            </span>
            <h4>Secure Coding</h4>
            <p>Developer guardrails for building LOOP services.</p>
          </a>
          <a className="card has-icon" href="/docs/incident-response">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-siren"></i>
            </span>
            <h4>Incident Response</h4>
            <p>Prepare for containment, recovery, and post-mortems.</p>
          </a>
          <a className="card has-icon" href="/docs/faq">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-question"></i>
            </span>
            <h4>FAQ</h4>
            <p>Answers to recurring questions about the protocol.</p>
          </a>
          <a className="card has-icon" href="/docs/glossary">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-book-open-text"></i>
            </span>
            <h4>Glossary</h4>
            <p>Shared vocabulary for the LOOP ecosystem.</p>
          </a>
          <a className="card has-icon" href="/docs/threat-model">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-warning-circle"></i>
            </span>
            <h4>Threat Model</h4>
            <p>STRIDE-lite baseline for lab environments.</p>
          </a>
          <a className="card has-icon" href="/docs/dpia-lite">
            <span className="card-icon" aria-hidden="true">
              <i className="ph-thin ph-clipboard-text"></i>
            </span>
            <h4>DPIA Lite</h4>
            <p>Baseline data protection assessment for lab demos.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
