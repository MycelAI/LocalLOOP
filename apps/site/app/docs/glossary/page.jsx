import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export default function GlossaryPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Glossary</h2>
        <p>
          Reference terminology that appears across the specification and docs.
          Canonical definitions live in{' '}
          <a href="/protocol/spec">SPECIFICATION.md §2 and §2.1</a>;
          this page is a quick-reference derived from the spec.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/docs/glossary.md" />
      </div>
    </div>
  );
}
