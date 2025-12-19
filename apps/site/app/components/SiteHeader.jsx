export function SiteHeader({ subtitle = 'Protocol Knowledge Base' }) {
  return (
    <header>
      <nav>
        <div className="nav-brand">
          <h1>LocalLoop</h1>
          <span>{subtitle}</span>
        </div>
        <div className="nav-links">
          <a href="/#protocol">Protocol</a>
          <a href="/#schemas">Schemas</a>
          <a href="/#examples">Examples</a>
          <a href="/#rfcs">RFCs</a>
          <a href="/#docs">Docs</a>
          <a href="/#interest">Interest</a>
          <a href="/materialDNA">materialDNA</a>
          <a href="/DEMO-City">DEMO City</a>
          <a href="/viewer.html?path=projects/loop-protocol/README.md&title=LOOP%20Protocol%20README">Projects</a>
        </div>
      </nav>
    </header>
  );
}
