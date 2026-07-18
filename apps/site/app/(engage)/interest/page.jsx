import { MaturityStatus } from '@/app/components/MaturityStatus';
import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({ title: 'Expression of interest', path: '/interest' });

export default function InterestPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Expression of Interest</h2>
        <p>
          Interest is a public, consent-based registry for future lab or research updates, not an
          application for a pilot or deployment. Email is optional and shown only if you opt in.
        </p>
        <MaturityStatus>Do not submit sensitive information. You can request access or deletion through the published contact channel.</MaturityStatus>
        <div className="cta-row">
          <a className="button primary" href="/protocol">Review the protocol</a>
          <a className="button secondary" href="/projects">Project hub</a>
        </div>
        <div className="status-banner" data-api-status>
          Checking backend status…
        </div>
      </div>

      <div className="content-panel">
        <h3>Why we collect this</h3>
        <p>
          Early signal from cities, labs, and operators may inform research priorities and future
          outreach. It does not select participants or guarantee a response.
        </p>
        <div className="table-list">
          <div><span>Public listing</span><div>Only fields covered by your consent may appear in the public interest list.</div></div>
          <div><span>Momentum</span><div>Helps align research, demos, and funding towards the right use cases</div></div>
          <div><span>Follow-up</span><div>Submissions may inform future research outreach; they do not select participants.</div></div>
        </div>
      </div>

      <div className="content-panel">
        <h3>What happens next</h3>
        <div className="table-list">
          <div><span>After submission</span><div>Your status message confirms the result. Public-list visibility depends on the service response and consent.</div></div>
          <div><span>Privacy & retention</span><div>Do not submit sensitive information. Contact us to request access or deletion.</div></div>
          <div><span>Public consent</span><div>Consent is required before sending a public interest entry. Email remains private unless you opt in.</div></div>
        </div>
        <p style={{marginTop: '14px', fontSize: '0.9rem', color: 'var(--ink-soft)'}}>
          Prefer a direct conversation? Reach out at{' '}
          <a href="mailto:dev@mycel-ai.de">dev@mycel-ai.de</a>.
        </p>
      </div>

      <div className="content-panel">
        <h3>Submit your interest</h3>
        <div className="interest-wrapper">
          <div className="card">
            <h4>Submission form</h4>
            <p>
              Submissions are public so collaborators can see who is exploring the protocol.
              Email is optional and shown only if you opt in.
            </p>
            <form className="interest-form" data-interest-form>
              <div className="field">
                <label htmlFor="name">Name *</label>
                <input id="name" name="name" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="organization">Organization</label>
                <input id="organization" name="organization" type="text" />
              </div>
              <div className="field">
                <label htmlFor="role">Role</label>
                <input id="role" name="role" type="text" />
              </div>
              <div className="field">
                <label htmlFor="country">Country</label>
                <input id="country" name="country" type="text" />
              </div>
              <div className="field">
                <label htmlFor="city">City</label>
                <input id="city" name="city" type="text" />
              </div>
              <div className="field">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="url" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message"></textarea>
              </div>
              <div className="field inline">
                <input id="shareEmail" name="shareEmail" type="checkbox" />
                <label htmlFor="shareEmail">Show my email in the public list</label>
              </div>
              <div className="field inline">
                <input id="consentPublic" name="consentPublic" type="checkbox" required />
                <label htmlFor="consentPublic">I agree my submission is listed publicly</label>
              </div>
              <input type="text" name="honey" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
              <div className="field">
                <button className="button primary" type="submit">Submit interest</button>
              </div>
              <div className="notice" data-interest-status role="status" aria-live="polite">Ready for your submission.</div>
            </form>
          </div>
          <div className="card">
            <h4>Public interest list</h4>
            <div className="interest-list" data-interest-list></div>
          </div>
        </div>
      </div>
    </div>
  );
}
