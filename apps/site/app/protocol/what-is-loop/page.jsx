import { Fragment } from 'react';
import { LoopCostCalculator } from '@/app/components/LoopCostCalculator';
import { JsonLd } from '@/app/components/JsonLd';
import { MaturityStatus } from '@/app/components/MaturityStatus';
import { SITE_URL, createMetadata } from '@/app/config/metadata';

const PAGE_URL = `${SITE_URL}/protocol/what-is-loop/`;
const PUBLISHED = '2026-09-06';
const REGULATORY_STATUS_DATE = 'September 2026';

export const metadata = createMetadata({
  title: 'What is LOOP?',
  description:
    'A plain-language guide to LOOP, the draft circular-economy protocol for cities: how material and product records move between municipal nodes, and how it relates to EU rules.',
  path: '/protocol/what-is-loop',
});

const stats = [
  { value: 'v0.2.0', label: 'Draft specification' },
  { value: '4 steps', label: 'Core exchange flow' },
  { value: '12', label: 'Published schemas' },
  { value: 'Lab only', label: 'No public pilots' },
];

const sections = [
  { id: 'why', label: 'Why this exists' },
  { id: 'how-it-works', label: 'How LOOP works' },
  { id: 'concepts', label: 'The six core concepts' },
  { id: 'identifiers', label: 'Anatomy of an identifier' },
  { id: 'glossary', label: 'Key terms' },
  { id: 'node', label: 'What a node is' },
  { id: 'data', label: 'Data, privacy, residency' },
  { id: 'architecture', label: 'How the pieces fit' },
  { id: 'regulation', label: 'LOOP and regulation' },
  { id: 'status', label: 'What exists today' },
  { id: 'governance', label: 'Governance' },
  { id: 'faq', label: 'Questions cities ask' },
];

const flow = [
  { icon: 'ph-fingerprint', title: 'Register', desc: 'Give the batch an identity' },
  { icon: 'ph-tag', title: 'Offer', desc: 'Publish what is surplus' },
  { icon: 'ph-handshake', title: 'Match', desc: 'Agree who receives it' },
  { icon: 'ph-recycle', title: 'Transfer', desc: 'Record the movement' },
];

const lifecycle = [
  { entity: 'Offer', states: [['open', 'open'], ['reserved', 'scheduled'], ['withdrawn', 'cancelled']], terminal: 'withdrawn' },
  { entity: 'Match', states: [['proposed', 'proposed'], ['accepted', 'accepted'], ['rejected', 'cancelled'], ['expired', 'unknown']], terminal: 'rejected, expired' },
  { entity: 'Transfer', states: [['scheduled', 'scheduled'], ['in transit', 'proposed'], ['completed', 'completed'], ['cancelled', 'cancelled']], terminal: 'completed, cancelled' },
  { entity: 'Material status', states: [['available', 'open'], ['reserved', 'scheduled'], ['withdrawn', 'cancelled']], terminal: 'withdrawn' },
];

const invariants = [
  'A match can only be created against an offer that is still open.',
  'Only one active match may exist for an offer at any moment.',
  'A transfer requires a match that has actually been accepted.',
  'An offer can never promise more than the batch contains.',
];

const concepts = [
  {
    name: 'MaterialDNA',
    role: 'Material identity',
    icon: 'ph-atom',
    href: '/platform/materialdna/',
    body: 'The digital identity of a physical material or batch: what it is made of, its category, quantity, quality, where it came from, and every hand it has passed through.',
    tag: 'Implemented',
    tone: 'live',
  },
  {
    name: 'ProductDNA',
    role: 'Product identity',
    icon: 'ph-package',
    href: '/platform/productdna/',
    body: 'The same idea one layer up: category, condition, manufacturer, lifecycle stage, and a link to the material records a product is composed of.',
    tag: 'Implemented',
    tone: 'live',
  },
  {
    name: 'Node and federation',
    role: 'The network shape',
    icon: 'ph-share-network',
    href: '/docs/federation/',
    body: 'One node per city, holding its own records, signing its own messages, choosing its own peers. Announcements travel a limited number of hops.',
    tag: 'Two-node demo',
    tone: 'soon',
  },
  {
    name: 'LoopCoin',
    role: 'Local unit of account',
    icon: 'ph-coins',
    href: '/platform/loopcoin/',
    body: 'A design for a node-issued local unit with expiry and decay built in, so value circulates rather than accumulates.',
    tag: 'Design only',
    tone: 'draft',
  },
  {
    name: 'LoopSignal',
    role: 'Community preference',
    icon: 'ph-broadcast',
    href: '/platform/loopsignal/',
    body: 'A number between zero and one per material category, expressing how strongly a community wants to keep or attract that material.',
    tag: 'Design only',
    tone: 'draft',
  },
  {
    name: 'LoopCost',
    role: 'Routing metric',
    icon: 'ph-path',
    href: '/platform/loopcost/',
    body: 'The figure derived from those signals: a base price plus export and import penalties and a distance component.',
    tag: 'Design only',
    tone: 'draft',
  },
];

const identifierParts = [
  { value: 'MAT', label: 'Record type' },
  { value: 'DE', label: 'Country' },
  { value: 'MUC', label: 'City' },
  { value: '2025', label: 'Year' },
  { value: 'PLASTIC', label: 'Category' },
  { value: 'B847F3', label: 'Unique suffix' },
];

const nodeComponents = [
  { icon: 'ph-archive', label: 'Material registry', note: 'Implemented' },
  { icon: 'ph-package', label: 'Product registry', note: 'Implemented' },
  { icon: 'ph-arrows-left-right', label: 'Offer, match, transfer', note: 'Implemented' },
  { icon: 'ph-coins', label: 'Currency engine', note: 'Not implemented' },
  { icon: 'ph-broadcast', label: 'Signal governor', note: 'Not implemented' },
  { icon: 'ph-path', label: 'Routing calculator', note: 'Not implemented' },
];

const wireFacts = [
  { label: 'Payload', value: 'JSON-LD' },
  { label: 'Transport', value: 'HTTPS / TLS 1.3' },
  { label: 'Timestamps', value: 'ISO 8601 UTC' },
  { label: 'Auth', value: 'Signed requests' },
];

const categories = [
  'Plastics by polymer', 'Metals', 'Organics', 'Glass', 'Paper', 'Textiles', 'Electronics', 'Battery waste',
];

const nodeStack = [
  { icon: 'ph-hard-drives', label: 'A modest server', note: 'A small VPS or bare-metal host is enough for lab volumes' },
  { icon: 'ph-database', label: 'PostgreSQL-compatible database', note: 'Holds the registries and the evidence log' },
  { icon: 'ph-lightning', label: 'Redis-compatible cache', note: 'Queues and short-lived state' },
  { icon: 'ph-cloud-arrow-up', label: 'S3-compatible object store', note: 'Documents and attachments' },
];

const costLines = [
  { label: 'Protocol and schemas', value: 'Free', tone: 'live', note: 'Open source and royalty-free' },
  { label: 'Infrastructure', value: 'Scales', tone: 'soon', note: 'With material-flow volume and retention period' },
  { label: 'Integration', value: 'Main cost', tone: 'pending', note: 'Depends on the ERP or waste system already in place' },
];

const operatorDuties = [
  { icon: 'ph-map-pin', label: 'Data residency', note: 'Records stay in municipal infrastructure, under municipal jurisdiction' },
  { icon: 'ph-lock-key', label: 'Transport security', note: 'Current TLS, with forward secrecy expected' },
  { icon: 'ph-clock-countdown', label: 'Token expiry', note: 'Access tokens must expire; nodes sign their own requests' },
  { icon: 'ph-gauge', label: 'Rate limits', note: 'Per-user, per-node, and per-search ceilings' },
  { icon: 'ph-list-checks', label: 'Immutable log', note: 'Registrations, settlements, signal changes, node interactions' },
];

const layers = [
  { name: 'The specification', note: 'Normative rules, endpoints, federation behaviour', owner: 'protocol', ownedBy: 'Shared' },
  { name: 'Schemas and contexts', note: 'Machine-checkable field definitions', owner: 'protocol', ownedBy: 'Shared' },
  { name: 'Node implementations', note: 'Any software that speaks the protocol', owner: 'city', ownedBy: 'Your choice' },
  { name: 'This documentation hub', note: 'Mirrors the spec, schemas, and examples', owner: 'city', ownedBy: 'Your choice' },
];


const glossary = [
  ['LOOP', 'Short for Local Optimization with Overflow Protocol. An open, federated protocol for describing material and product flows between municipal nodes.'],
  ['Node', 'One autonomous LOOP implementation, typically run by a municipality.'],
  ['Node operator', 'The municipality, cooperative, or authorised entity accountable for running a node and its data governance.'],
  ['Federation', 'The peer-to-peer arrangement by which nodes discover each other and exchange metadata, with no central authority.'],
  ['MaterialDNA', 'The digital identity of a physical material or batch.'],
  ['ProductDNA', 'The digital identity of a finished or semi-finished product.'],
  ['Offer', 'A published statement that a material or product is available, in a stated quantity, until a stated date.'],
  ['Match', 'A proposed and then accepted pairing between an offer and a receiving party.'],
  ['Transfer', 'The record of the material actually moving: scheduled, in transit, then completed or cancelled.'],
  ['LoopCoin', 'A draft model for a node-issued local unit of account with expiry and decay properties.'],
  ['LoopSignal', 'A draft model for a community preference value between 0 and 1 for a material category.'],
  ['LoopCost', 'A draft routing-cost formula combining base price, export and import penalties, and distance.'],
  ['Overflow', 'The routing idea the protocol is named after: what happens to surplus when local demand cannot absorb it.'],
  ['Settlement', 'The step confirming a transfer and its payment. Modelled in the specification, not implemented.'],
  ['Audit trail', 'The recorded sequence of registration, offer, match, and transfer events held by a node.'],
  ['Evidence log', 'An append-only record of protocol events, each with a hash and a retention date.'],
  ['Data residency', 'The property that a city keeps its own records in its own infrastructure.'],
  ['Access-scope tier', 'One of public, operator, or regulator: who a given passport field is meant to be visible to.'],
  ['Digital Product Passport', 'The EU concept of a machine-readable record that travels with a product. Usually shortened to DPP.'],
  ['Core-DP', 'The smallest machine-checkable LOOP profile: two lab nodes, registry and search, the offer-to-transfer sequence, and an evidence log.'],
  ['Profile', 'A document narrowing the protocol for one interoperability target without changing the base schemas.'],
  ['RFC', 'Request for Comments. The written proposal format used to change the protocol in public.'],
];

const timeline = [
  { date: '21 May 2026', title: 'DIWASS is live', state: 'done', note: 'Cross-border waste shipment documents move electronically. Green-list paper allowed until 31 December 2026.' },
  { date: '20 Jul 2026', title: 'EU DPP Registry live', state: 'done', note: 'Indexes identifiers and metadata only. Passport content stays with whoever holds it.' },
  { date: '12 Aug 2026', title: 'PPWR applies', state: 'done', note: 'Packaging identification and conformity documentation. The harmonised data-carrier format is still unadopted.' },
  { date: '27 Sep 2026', title: 'Green claims rules bind', state: 'done', note: 'Tightened substantiation for sustainability claims shown to consumers.' },
  { date: '18 Feb 2027', title: 'Battery passports required', state: 'pending', note: 'EV, light means of transport, and industrial batteries above 2 kWh. Format and access acts are overdue.' },
  { date: '2027 onward', title: 'First ESPR product groups', state: 'pending', note: 'No product-specific delegated act adopted yet. Iron and steel is furthest along.' },
];

const regulations = [
  {
    name: 'Waste Shipment and DIWASS',
    ref: '(EU) 2024/1157',
    date: 'Live since 21 May 2026',
    tone: 'live',
    action: 'Confirm contractors can file shipment documents electronically. Keep records at least five years.',
    loop: 'Shipment document reference, facility and operator identifiers, retention date on the transfer record.',
  },
  {
    name: 'Packaging and Packaging Waste',
    ref: '(EU) 2025/40',
    date: 'Applies since 12 Aug 2026',
    tone: 'live',
    action: 'Map packaging categories in procurement. Do not commit to a label format yet.',
    loop: 'Packaging as a product record with pool and batch references that survive a reuse cycle.',
  },
  {
    name: 'Green claims for consumers',
    ref: 'Dir. (EU) 2024/825',
    date: 'Binding 27 Sep 2026',
    tone: 'live',
    action: 'Review published circularity statistics against tightened substantiation rules.',
    loop: 'Recorded data is kept separate from any environmental claim about it.',
  },
  {
    name: 'Ecodesign and the DPP',
    ref: '(EU) 2024/1781',
    date: 'Delegated acts pending',
    tone: 'pending',
    action: 'Assess procurement volumes in the first-wave categories.',
    loop: 'Optional passport, classification, and traceability blocks as extension points.',
  },
  {
    name: 'Batteries Regulation',
    ref: '(EU) 2023/1542',
    date: '18 Feb 2027',
    tone: 'soon',
    action: 'Audit fleet and depot batteries now; treat exact data requirements as unconfirmed.',
    loop: 'Battery category, passport identifier, backup copy location, due-diligence reference.',
  },
  {
    name: 'German circular-economy policy',
    ref: 'NKWS and KrWG',
    date: 'Strategy since Dec 2024',
    tone: 'draft',
    action: 'Framing for municipal reuse and repair programmes and cross-boundary material data.',
    loop: 'Municipal node interoperability and reusable material identity as design goals.',
  },
];

const exists = [
  'A versioned written specification, published schemas, and JSON-LD contexts.',
  'Worked example payloads for every record type.',
  'A reference backend implementing the specification endpoints.',
  'A scripted lab demonstration of the register-to-transfer flow.',
  'A two-node federation handshake and exchange.',
  'Public governance, security, and data-protection documents.',
];

const doesNotExist = [
  'Any public pilot or production deployment.',
  'Any settlement, currency, or payment behaviour.',
  'Collection of community preferences, or routing decided from them.',
  'Generalised federation beyond two nodes.',
  'Any certification, conformity assessment, or regulatory approval.',
  'Blockchain-style permanence. The evidence log is append-only storage.',
];

const faqs = [
  {
    q: 'What is LOOP, in one sentence?',
    a: 'LOOP is an open, draft protocol that lets cities describe the materials and products they hold, publish what is surplus, and record transfers to other cities in a common machine-readable format, while each city keeps its own data.',
  },
  {
    q: 'Is LOOP something a city can deploy today?',
    a: 'No. LOOP is an early-stage, low technology readiness level concept. It consists of a written specification, JSON schemas, and a reference backend that runs a scripted lab demonstration. There are no public pilots and no production deployments, and the demonstration flow is explicitly not a pilot.',
  },
  {
    q: 'Does LOOP make my city compliant with the EU Digital Product Passport rules?',
    a: 'No, and nothing on this site should be read as a compliance or certification claim. LOOP carries optional fields designed to be extensible toward passport-style data, so that adopting future requirements is an addition rather than a rebuild. Compliance depends on delegated acts that, for most product groups, have not yet been adopted.',
  },
  {
    q: 'What would it cost a city to run a node?',
    a: 'In the lab configuration a node is a modest server running a PostgreSQL-compatible database, a Redis-compatible cache, and an S3-compatible object store as containers. The protocol itself is open source and royalty-free. The real cost driver is integration with whatever waste-management or asset system the city already runs.',
  },
  {
    q: 'Where does our data live, and who can see it?',
    a: 'Each node stores its own records in its own infrastructure, under its own jurisdiction. Federation exchanges agreed material-flow metadata, not raw records. Protocol payloads are designed to carry no personal data: node identifiers, city names, and organisation identifiers are permitted, while names, emails, and phone numbers are not.',
  },
  {
    q: 'Does LOOP require a blockchain or a cryptocurrency?',
    a: 'No. Nodes exchange signed JSON-LD messages over ordinary HTTPS and keep an append-only evidence log. That log is append-only storage, not a distributed ledger. LoopCoin is a design sketch for a local unit of account with expiry properties; it is not implemented, and no value is issued or settled anywhere.',
  },
  {
    q: 'How is this different from the waste-management system we already have?',
    a: 'Existing systems are excellent at running one organisation and poor at talking to the one next door. LOOP does not replace them. It defines the shared vocabulary and the small set of endpoints that would let two such systems describe the same material to each other without a bilateral integration project each time.',
  },
  {
    q: 'How would we influence the protocol?',
    a: 'Changes go through a public Request for Comments process: anyone can open a discussion and submit a proposal, and substantial changes need community review before adoption. Cities that want to shape the vocabulary before it hardens are exactly the input the process is short of.',
  },
];

export default function WhatIsLoopPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${PAGE_URL}#article`,
        headline: 'What is LOOP?',
        description: metadata.description,
        inLanguage: 'en',
        url: PAGE_URL,
        datePublished: PUBLISHED,
        dateModified: PUBLISHED,
        about: ['Circular economy', 'Digital Product Passport', 'Municipal interoperability'],
        isPartOf: { '@type': 'WebSite', name: 'localLOOP', url: SITE_URL },
      },
      {
        '@type': 'FAQPage',
        '@id': `${PAGE_URL}#faq`,
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Protocol', item: `${SITE_URL}/protocol/` },
          { '@type': 'ListItem', position: 3, name: 'What is LOOP?', item: PAGE_URL },
        ],
      },
    ],
  };

  return (
    <div className="content-stack">
      <JsonLd data={jsonLd} />

      <div className="content-panel">
        <span className="chip chip--teal">Executive introduction</span>
        <h1 className="hub-heading">What is LOOP?</h1>
        <p>
          LOOP is an open, draft protocol that lets cities describe the materials and products
          they hold, publish what is surplus, and record transfers to other cities in one shared
          machine-readable format. Each city keeps its own records in its own infrastructure. The
          name stands for Local Optimization with Overflow Protocol.
        </p>
        <p>
          Cities already hold the data. What they lack is a common way to express it, so surplus in
          one district and demand in the next stay invisible to each other. LOOP supplies that
          common expression, and nothing else: no platform to join, no operator in the middle, and
          no obligation to move records off municipal infrastructure.
        </p>
        <div className="wil-stats">
          {stats.map((stat) => (
            <div className="wil-stat" key={stat.label}>
              <span className="wil-stat-value">{stat.value}</span>
              <span className="wil-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
        <MaturityStatus>
          Everything described here exists as a specification, published schemas, and a reference
          implementation running a scripted demonstration. There are no public pilots, no
          deployments, and no compliance claims.
        </MaturityStatus>
        <div className="cta-row">
          <a className="button primary" href="/protocol/spec/">Read the specification</a>
          <a className="button secondary" href="/docs/regulatory-alignment/">Regulatory alignment</a>
          <a className="button secondary" href="/interest/">Register interest</a>
        </div>
      </div>

      <div className="content-panel">
        <h2 className="section-title">On this page</h2>
        <div className="wil-toc">
          {sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.label}
            </a>
          ))}
        </div>
      </div>

      <div className="content-panel">
        <h2 id="why">Why this exists</h2>
        <p>
          Material recovery today runs as a set of islands. A city knows, more or less, what enters
          and leaves its own facilities. It usually has no practical way to know that the district
          twenty kilometres away is landfilling exactly the feedstock its own processor is
          importing. The information exists on both sides. It has no shared shape, so nobody can
          act on it.
        </p>
        <div className="wil-network">
          <div className="wil-network-side">
            <p className="wil-network-label">Today</p>
            <div className="wil-network-row wil-network-row--isolated">
              {[0, 1, 2, 3].map((n) => (
                <span className="wil-node" key={n}>
                  <i aria-hidden="true" className="ph-bold ph-buildings" />
                </span>
              ))}
            </div>
            <p className="wil-network-note">
              Four neighbouring cities, four separate systems. Each sees only its own flows.
            </p>
          </div>
          <div className="wil-network-side wil-network-side--linked">
            <p className="wil-network-label">With a shared format</p>
            <div className="wil-network-row wil-network-row--linked">
              {[0, 1, 2, 3].map((n) => (
                <span className="wil-node" key={n}>
                  <i aria-hidden="true" className="ph-bold ph-buildings" />
                </span>
              ))}
            </div>
            <p className="wil-network-note">
              The same four cities, exchanging directly. No central database appears here.
            </p>
          </div>
        </div>
        <div className="wil-split">
          <div className="wil-panel wil-panel--warm">
            <p className="wil-panel-head">
              <i className="ph-bold ph-buildings" aria-hidden="true" /> The platform answer
            </p>
            <p>
              One operator, one database, everyone joins. Cities are rightly reluctant: it hands
              operational data and pricing leverage to a third party, and the value of the network
              accrues to whoever runs it.
            </p>
          </div>
          <div className="wil-panel wil-panel--cool">
            <p className="wil-panel-head">
              <i className="ph-bold ph-share-network" aria-hidden="true" /> The protocol answer
            </p>
            <p>
              A shared format and a small set of endpoints, the route email and the web took. Any
              city that speaks the format can exchange with any other. Nobody joins anything, and
              no operator sits in the middle.
            </p>
          </div>
        </div>
        <p className="wil-lead">
          <i className="ph-bold ph-calendar-check" aria-hidden="true" />
          <span>
            There is a second, more immediate reason. Between 2026 and 2027 a series of European
            rules turn material and product information into something that has to be digital,
            structured, and exchangeable. Cities will be asked for structured data whether or not
            they have somewhere to put it. <a href="#regulation">See the dates</a>.
          </span>
        </p>
      </div>

      <div className="content-panel">
        <h2 id="how-it-works">How LOOP works</h2>
        <p>
          The core of the protocol is four steps. The specification calls this the minimal
          interoperability flow: the smallest thing two nodes can do together and still be useful.
        </p>
        <div className="flow-explainer">
          {flow.map((step, index) => (
            <Fragment key={step.title}>
              {index > 0 ? (
                <span className="flow-arrow" aria-hidden="true">
                  <i className="ph-bold ph-arrow-right" />
                </span>
              ) : null}
              <div className="flow-step">
                <div className="flow-step-icon">
                  <i className={`ph-bold ${step.icon}`} aria-hidden="true" />
                </div>
                <span className="flow-step-title">{step.title}</span>
                <span className="flow-step-desc">{step.desc}</span>
              </div>
            </Fragment>
          ))}
        </div>

        <h3 className="wil-sub">Every record has a defined life</h3>
        <p>
          Each entity moves through a fixed set of states. Once something reaches a final state it
          cannot quietly go backwards.
        </p>
        <div className="demo-table-wrap">
          <table className="demo-table wil-table">
            <thead>
              <tr>
                <th scope="col">Record</th>
                <th scope="col">States</th>
                <th scope="col">Final</th>
              </tr>
            </thead>
            <tbody>
              {lifecycle.map((row) => (
                <tr key={row.entity}>
                  <th className="wil-rowhead" scope="row">{row.entity}</th>
                  <td data-label="States">
                    <span className="wil-states">
                      {row.states.map(([label, tone]) => (
                        <span className={`demo-status demo-status-${tone}`} key={label}>
                          {label}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td data-label="Final state">{row.terminal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="wil-sub">Four rules stop the obvious failure</h3>
        <p>
          These constraints stop the same skip of aluminium being sold to three neighbouring
          districts at once. The reference implementation enforces them in the database rather than
          by convention.
        </p>
        <ol className="wil-rules">
          {invariants.map((rule, index) => (
            <li key={rule}>
              <span aria-hidden="true">{index + 1}</span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
        <div className="wil-specs">
          {wireFacts.map((fact) => (
            <div className="wil-spec" key={fact.label}>
              <span className="wil-spec-label">{fact.label}</span>
              <span className="wil-spec-value">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="content-panel">
        <h2 id="concepts">The six core concepts</h2>
        <p>
          The specification names six concepts. Two are implemented and exercised in the lab
          demonstration; the economic three, and the metric derived from them, are design models on
          paper. Each card below states which.
        </p>
        <div className="concepts-grid">
          {concepts.map((concept) => (
            <div className="concept-card" key={concept.name}>
              <div className="concept-icon">
                <i className={`ph-bold ${concept.icon}`} aria-hidden="true" />
              </div>
              <h3>{concept.name}</h3>
              <p className="wil-role">
                <span>{concept.role}</span>
                <span className={`wil-tag wil-tag--${concept.tone}`}>{concept.tag}</span>
              </p>
              <p>{concept.body}</p>
              <a href={concept.href}>Explore {concept.name} →</a>
            </div>
          ))}
        </div>
      </div>

      <div className="content-panel">
        <h3>How the economic concepts fit together, on paper</h3>
        <p>
          LoopSignal is the input and LoopCost is the output. A city expresses, as a number between
          zero and one, how strongly it wants to keep or attract a material category. That number
          becomes a penalty on the calculated cost of moving the material across the boundary, in
          both directions equally.
        </p>
        <h3 className="wil-sub">Try the model</h3>
        <p>
          Move the inputs and watch the cost change. A city that badly wants to keep a material
          raises its own signal, which raises the penalty on sending it away.
        </p>
        <LoopCostCalculator />
        <p>
          A transfer inside one city incurs only the base price, so short local loops come out
          structurally cheaper than long ones, without anybody being forbidden from trading further
          afield when it genuinely makes sense. LoopCoin is the proposed unit those figures would be
          denominated in, with expiry and decay built in to discourage hoarding.
        </p>
        <div className="notice">
          <strong>None of this is implemented.</strong> LoopCoin, LoopSignal, LoopCost, and
          settlement have no route, no data model, and no running code, and they are out of scope in
          the current delivery profile. Treat them as published design intent, not as behaviour you
          could rely on.
        </div>
      </div>

      <div className="content-panel">
        <h2 id="identifiers">Anatomy of an identifier</h2>
        <p>
          Identifiers are readable on purpose. A material identifier encodes country, city, year,
          category, and a unique suffix; a product identifier follows the same shape with a
          different prefix.
        </p>
        <div className="wil-id">
          {identifierParts.map((part) => (
            <div className="wil-id-part" key={part.label}>
              <span className="wil-id-value">{part.value}</span>
              <span className="wil-id-label">{part.label}</span>
            </div>
          ))}
        </div>
        <p className="text-soft">
          A product record for a desk from the same city and year reads PRD-DE-MUC-2025-DESK-F4A7B2.
        </p>
        <p>
          Categories are a fixed list rather than free text, which is what makes cross-city search
          possible.
        </p>
        <div className="wil-chips">
          {categories.map((category) => (
            <span className="chip chip--teal" key={category}>
              {category}
            </span>
          ))}
        </div>
        <p>
          A product record can point at the material records it is composed of, so a desk
          references its steel and its particle board without duplicating either.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/library/schemas/">Published schemas</a>
          <a className="button secondary" href="/library/examples/">Worked examples</a>
        </div>
      </div>

      <div className="content-panel">
        <h2 id="glossary">Key terms</h2>
        <p>Canonical definitions live in the specification. These are the short forms.</p>
        <dl className="wil-glossary">
          {glossary.map(([term, definition]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{definition}</dd>
            </div>
          ))}
        </dl>
        <div className="cta-row">
          <a className="button secondary" href="/docs/glossary/">Full glossary</a>
        </div>
      </div>

      <div className="content-panel">
        <h2 id="node">What a node is, and what running one involves</h2>
        <p>
          A node is one city's LOOP implementation. The specification says what a node must be able
          to do, not how to build it. Three of the six components it describes are built; the
          economic three are not.
        </p>
        <div className="grid wil-grid-3">
          {nodeComponents.map((component) => (
            <div className="card has-icon" key={component.label}>
              <span className="card-icon" aria-hidden="true">
                <i className={`ph-bold ${component.icon}`} />
              </span>
              <h3>{component.label}</h3>
              <p>
                <span
                  className={`wil-tag wil-tag--${component.note === 'Implemented' ? 'live' : 'draft'}`}
                >
                  {component.note}
                </span>
              </p>
            </div>
          ))}
        </div>
        <h3 className="wil-sub">What a lab node runs on</h3>
        <ul className="wil-stack">
          {nodeStack.map((item) => (
            <li key={item.label}>
              <span className="card-icon" aria-hidden="true">
                <i className={`ph-bold ${item.icon}`} />
              </span>
              <span className="wil-stack-label">
                {item.label}
                <span className="wil-stack-note">{item.note}</span>
              </span>
              <span className="wil-tag wil-tag--draft">Container</span>
            </li>
          ))}
        </ul>

        <h3 className="wil-sub">Where the money goes</h3>
        <ul className="wil-stack">
          {costLines.map((line) => (
            <li key={line.label}>
              <span className="card-icon" aria-hidden="true">
                <i className="ph-bold ph-currency-eur" />
              </span>
              <span className="wil-stack-label">
                {line.label}
                <span className="wil-stack-note">{line.note}</span>
              </span>
              <span className={`wil-tag wil-tag--${line.tone}`}>{line.value}</span>
            </li>
          ))}
        </ul>
        <p className="wil-lead">
          <i className="ph-bold ph-wrench" aria-hidden="true" />
          <span>
            Integration, not hosting, is the line that varies. Connecting a node to an existing
            enterprise resource planning or waste-management system depends entirely on what a
            city already runs. The <a href="/docs/implementation/">implementation guide</a> sets
            out a minimum viable checklist.
          </span>
        </p>
      </div>

      <div className="content-panel">
        <h2 id="data">Data, privacy, and residency</h2>
        <p>
          The most consequential design decision in LOOP is what it refuses to carry. If personal
          data is never in the shared payload, cross-boundary exchange does not become a
          personal-data transfer question: the awkward part of the assessment disappears instead of
          being managed.
        </p>
        <div className="wil-split">
          <div className="wil-panel wil-panel--cool">
            <p className="wil-panel-head">
              <i className="ph-bold ph-check-circle" aria-hidden="true" /> Permitted in payloads
            </p>
            <ul className="wil-marks wil-marks--yes">
              <li><i className="ph-bold ph-check" aria-hidden="true" /><span>Node identifiers</span></li>
              <li><i className="ph-bold ph-check" aria-hidden="true" /><span>City names</span></li>
              <li><i className="ph-bold ph-check" aria-hidden="true" /><span>Organisation identifiers</span></li>
              <li><i className="ph-bold ph-check" aria-hidden="true" /><span>Facility and operator references</span></li>
            </ul>
          </div>
          <div className="wil-panel">
            <p className="wil-panel-head">
              <i className="ph-bold ph-prohibit" aria-hidden="true" /> Never in payloads
            </p>
            <ul className="wil-marks wil-marks--no">
              <li><i className="ph-bold ph-x" aria-hidden="true" /><span>Personal names</span></li>
              <li><i className="ph-bold ph-x" aria-hidden="true" /><span>Email addresses</span></li>
              <li><i className="ph-bold ph-x" aria-hidden="true" /><span>Phone numbers</span></li>
              <li><i className="ph-bold ph-x" aria-hidden="true" /><span>Any other personal data</span></li>
            </ul>
          </div>
        </div>
        <h3 className="wil-sub">What a node operator is expected to hold up</h3>
        <ul className="wil-stack">
          {operatorDuties.map((duty) => (
            <li key={duty.label}>
              <span className="card-icon" aria-hidden="true">
                <i className={`ph-bold ${duty.icon}`} />
              </span>
              <span className="wil-stack-label">
                {duty.label}
                <span className="wil-stack-note">{duty.note}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="wil-lead">
          <i className="ph-bold ph-shield-check" aria-hidden="true" />
          <span>
            Federation exchanges agreed material-flow metadata, not raw records. Nothing is pooled
            centrally because there is no centre. A baseline data-protection assessment for the lab
            demonstration is published at <a href="/docs/dpia-lite/">the DPIA Lite page</a>; any
            real deployment would need its own.
          </span>
        </p>
      </div>

      <div className="content-panel">
        <h2 id="architecture">How the pieces fit together</h2>
        <p>
          The word LOOP covers four distinct things: the written specification, the schemas that
          make it checkable, the software that implements it, and this documentation hub.
        </p>
        <ol className="wil-layers">
          {layers.map((layer) => (
            <li className="wil-layer" data-owner={layer.owner} key={layer.name}>
              <span className="wil-layer-body">
                <span className="wil-layer-name">{layer.name}</span>
                <span className="wil-layer-note">{layer.note}</span>
              </span>
              <span className="wil-layer-owner">{layer.ownedBy}</span>
            </li>
          ))}
        </ol>
        <p className="wil-caption">
          A city can replace the bottom two entirely and still interoperate.
        </p>
        <p className="wil-lead">
          <i className="ph-bold ph-graph" aria-hidden="true" />
          <span>
            Nodes discover each other through a registry of peers and sign requests with a node
            identifier, a signature, and a recent timestamp. Announcements propagate with a limited
            hop count rather than flooding the network, so a working node needs to know its
            immediate neighbours, not the whole world.
          </span>
        </p>
      </div>

      <div className="content-panel">
        <h2 id="regulation">LOOP and the regulatory landscape</h2>
        <div className="notice">
          <strong>Read this first.</strong> This section is informational and is not legal advice.
          localLOOP is lab-demo software with no public pilots and no deployments, and nothing here
          is a claim of compliance, certification, or regulatory readiness for LOOP or for any city
          using it. Regulatory status is summarised as of {REGULATORY_STATUS_DATE}; the maintained
          version, with sources, lives on the{' '}
          <a href="/docs/regulatory-alignment/">regulatory alignment page</a>.
        </div>
        <p>
          European rules are moving material and product information from paper and spreadsheets
          into structured, machine-readable records. Several are already operative. The pattern is
          consistent: an identifier that travels with the thing, structured data behind it, and an
          authority or counterparty able to look it up.
        </p>

        <h3 className="wil-sub">The dates that matter</h3>
        <ul className="wil-timeline">
          {timeline.map((entry) => (
            <li data-state={entry.state} key={entry.title}>
              <span className="wil-timeline-date">{entry.date}</span>
              <span className="wil-timeline-title">{entry.title}</span>
              <span className="wil-timeline-note">{entry.note}</span>
            </li>
          ))}
        </ul>

        <h3 className="wil-sub">What a city can do about each</h3>
        <div className="demo-table-wrap">
          <table className="demo-table wil-table">
            <thead>
              <tr>
                <th scope="col">Regulation</th>
                <th scope="col">Status</th>
                <th scope="col">City action</th>
                <th scope="col">Where LOOP could help</th>
              </tr>
            </thead>
            <tbody>
              {regulations.map((row) => (
                <tr key={row.ref}>
                  <th className="wil-rowhead" scope="row">
                    {row.name}
                    <span className="text-soft">{row.ref}</span>
                  </th>
                  <td data-label="Status">
                    <span className={`wil-tag wil-tag--${row.tone}`}>{row.date}</span>
                  </td>
                  <td data-label="City action">{row.action}</td>
                  <td data-label="Where LOOP could help">{row.loop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="wil-split">
          <div className="wil-panel">
            <p className="wil-panel-head">
              <i className="ph-bold ph-puzzle-piece" aria-hidden="true" /> Extension points, not claims
            </p>
            <p>
              LOOP carries optional passport, classification, and traceability blocks alongside its
              core fields. They are draft discussion fields designed to be extensible toward
              passport-style requirements, so adopting one later is an addition rather than a
              rebuild. They are not a readiness claim.
            </p>
          </div>
          <div className="wil-panel wil-panel--cool">
            <p className="wil-panel-head">
              <i className="ph-bold ph-arrows-in" aria-hidden="true" /> A converging design
            </p>
            <p>
              The EU registry that went live in July 2026 indexes identifiers and metadata only:
              passport content stays with whoever holds it. That decentralised,
              reference-by-identifier shape is the one LOOP arrived at independently.
            </p>
          </div>
        </div>
        <div className="wil-split">
          <div className="wil-panel wil-panel--warm">
            <p className="wil-panel-head">
              <i className="ph-bold ph-warning" aria-hidden="true" /> Caution one
            </p>
            <p>
              Several acts that would define exact data formats are late. The packaging
              data-carrier format, and the battery passport format and access rules, are all still
              unadopted. Any vendor telling you today exactly which fields you will need is
              guessing. Keep your data structured and your format commitments loose.
            </p>
          </div>
          <div className="wil-panel wil-panel--warm">
            <p className="wil-panel-head">
              <i className="ph-bold ph-warning" aria-hidden="true" /> Caution two
            </p>
            <p>
              The international framework that several passport-style field names draw on is itself
              still pre-release. Any description of a LOOP field as aligned to it is directional,
              not a conformance statement.
            </p>
          </div>
        </div>
        <div className="cta-row">
          <a className="button secondary" href="/docs/regulatory-alignment/">
            Full roadmap with official sources
          </a>
          <a
            className="button secondary"
            href="https://eur-lex.europa.eu/"
            rel="noreferrer noopener"
            target="_blank"
          >
            EUR-Lex
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h2 id="status">What exists today, and what does not</h2>
        <p>
          The protocol is at an early stage. The line between what runs and what is still on paper
          is drawn below.
        </p>
        <div className="wil-split">
          <div className="wil-panel wil-panel--cool">
            <p className="wil-panel-head">
              <i className="ph-bold ph-check-circle" aria-hidden="true" /> Exists today
            </p>
            <ul className="wil-marks wil-marks--yes">
              {exists.map((item) => (
                <li key={item}>
                  <i className="ph-bold ph-check" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="wil-panel">
            <p className="wil-panel-head">
              <i className="ph-bold ph-prohibit" aria-hidden="true" /> Does not exist
            </p>
            <ul className="wil-marks wil-marks--no">
              {doesNotExist.map((item) => (
                <li key={item}>
                  <i className="ph-bold ph-x" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="wil-lead">
          <i className="ph-bold ph-flask" aria-hidden="true" />
          <span>
            The smallest checkable profile covers exactly two nodes, registry and search, the
            offer-to-transfer sequence, signed messages, an append-only evidence log, and error
            handling. It is profile conformance, not full protocol conformance, and it says so.
          </span>
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/platform/demo-city/">Watch the flow run</a>
          <a className="button secondary" href="/docs/lab-demo/">Lab demo walkthrough</a>
        </div>
      </div>

      <div className="content-panel">
        <h2 id="governance">Governance, and how to take part</h2>
        <p>
          Protocol changes go through a public Request for Comments process. Anyone can open a
          discussion and submit a proposal against a published template; substantial changes need
          community review before adoption, and each proposal moves through documented states so the
          reasoning stays on the record.
        </p>
        <div className="wil-split">
          <div className="wil-panel">
            <p className="wil-panel-head">
              <i className="ph-bold ph-git-branch" aria-hidden="true" /> Versioning is a policy
            </p>
            <p>
              Minor versions are additive and must not remove or rename existing required fields.
              Receivers accept additive versions and preserve fields they do not recognise. Payloads
              written against the previous version stay valid. What you write today should not stop
              parsing next year.
            </p>
          </div>
          <div className="wil-panel">
            <p className="wil-panel-head">
              <i className="ph-bold ph-scales" aria-hidden="true" /> Candid about its limits
            </p>
            <p>
              A public proposal records that the standing two-person review quorum is not currently
              meetable with one active maintainer, and documents the narrower substitute rather than
              quietly ignoring the rule. A published claims policy forbids asserting pilots,
              deployments, or compliance without current evidence.
            </p>
          </div>
        </div>
        <p className="wil-lead">
          <i className="ph-bold ph-megaphone" aria-hidden="true" />
          <span>
            Cities can shape the vocabulary while it is still soft. Tell us what would have to be
            true for this to be worth running, and which existing systems it would need to talk to.
          </span>
        </p>
        <div className="cta-row">
          <a className="button primary" href="/interest/">Register interest</a>
          <a className="button secondary" href="/governance/">Governance documents</a>
          <a className="button secondary" href="/governance/rfcs/">Read the proposals</a>
        </div>
      </div>

      <div className="content-panel">
        <h2 id="faq">Questions cities ask</h2>
        <div className="wil-faq">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p className="wil-faq-body">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="content-panel">
        <h2 className="section-title">Where to go next</h2>
        <div className="quick-start">
          <a className="quick-start-card" href="/protocol/spec/">
            <span className="card-icon" aria-hidden="true"><i className="ph-bold ph-scroll" /></span>
            <h3>The specification</h3>
            <p>Normative requirements, endpoints, and federation flows in full.</p>
          </a>
          <a className="quick-start-card" href="/docs/regulatory-alignment/">
            <span className="card-icon" aria-hidden="true"><i className="ph-bold ph-scales" /></span>
            <h3>Regulatory alignment</h3>
            <p>The maintained regulation roadmap, with official sources and dates.</p>
          </a>
          <a className="quick-start-card" href="/interest/">
            <span className="card-icon" aria-hidden="true"><i className="ph-bold ph-paper-plane-tilt" /></span>
            <h3>Register interest</h3>
            <p>Tell us what your city would need before this is worth running.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
