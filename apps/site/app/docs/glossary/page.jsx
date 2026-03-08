import MarkdownDoc from '@/app/components/docs/MarkdownDoc'

export default function GlossaryPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">        <h2>Glossary</h2>
        <p>
          Reference terminology that appears across the specification and docs.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>
      <div className="content-panel">
        <h3>Terms you will see</h3>
        <div className="table-list">
          <div><span>Loop node</span><div>City-level protocol implementation</div></div>
          <div><span>MaterialDNA</span><div>Material identity primitives</div></div>
          <div><span>ProductDNA</span><div>Product identity layer (DPP-aligned, references MaterialDNA)</div></div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/docs/glossary.md" />
      </div>
    </div>
  );
}
