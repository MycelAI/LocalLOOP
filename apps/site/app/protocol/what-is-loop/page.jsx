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

const sections = [
  { id: 'why', label: 'Why this exists', icon: 'ph-warning-circle' },
  { id: 'how-it-works', label: 'How LOOP works', icon: 'ph-flow-arrow' },
  { id: 'concepts', label: 'The six core concepts', icon: 'ph-cube' },
  { id: 'identifiers', label: 'What an identifier looks like', icon: 'ph-fingerprint' },
  { id: 'glossary', label: 'Key terms', icon: 'ph-book-open' },
  { id: 'node', label: 'What a node is', icon: 'ph-buildings' },
  { id: 'data', label: 'Data, privacy, residency', icon: 'ph-lock-key' },
  { id: 'architecture', label: 'How the pieces fit', icon: 'ph-stack' },
  { id: 'regulation', label: 'LOOP and regulation', icon: 'ph-scales' },
  { id: 'status', label: 'What exists today', icon: 'ph-flask' },
  { id: 'governance', label: 'Governance and taking part', icon: 'ph-users-three' },
  { id: 'faq', label: 'Questions cities ask', icon: 'ph-question' },
];

const glossary = [
  ['LOOP', 'Short for Local Optimization with Overflow Protocol. An open, federated protocol standard for describing material and product flows between autonomous municipal nodes.'],
  ['Node', 'One autonomous LOOP implementation, typically run by a municipality. A node holds its own records and decides which peers it talks to.'],
  ['Node operator', 'The municipality, cooperative, or authorised entity accountable for running a node, its data governance, its security configuration, and its federation decisions.'],
  ['Federation', 'The peer-to-peer arrangement by which nodes discover each other and exchange material-flow metadata across boundaries, with no central authority in the middle.'],
  ['MaterialDNA', 'The digital identity of a physical material or batch: composition, category, origin, quantity, quality, and chain of custody.'],
  ['ProductDNA', 'The digital identity of a finished or semi-finished product. A product record may reference the material records it is made from.'],
  ['Offer', 'A published statement that a given material or product is available, from one city to another, in a stated quantity, until a stated date.'],
  ['Match', 'A proposed and then accepted pairing between an offer and a receiving party.'],
  ['Transfer', 'The record of the material actually moving: scheduled, in transit, then completed or cancelled.'],
  ['LoopCoin', 'A draft model for a node-issued local unit of account with expiry and decay properties. It is a design on paper; no currency is issued or settled.'],
  ['LoopSignal', 'A draft model for a community preference value, between 0 and 1, expressing how strongly a city wants to retain or attract a material category.'],
  ['LoopCost', 'A draft routing-cost formula combining a base price, an export penalty, an import penalty, and a distance cost.'],
  ['Overflow', 'The routing idea the protocol is named after: what happens to surplus material when local demand is not sufficient to absorb it.'],
  ['Settlement', 'The step that confirms a transfer and its payment. Modelled in the specification, not implemented.'],
  ['Audit trail', 'The recorded sequence of registration, offer, match, and transfer events held by a node. Intended to support reporting and traceability evidence.'],
  ['Evidence log', 'An append-only record of protocol events, each with a hash and a retention date. Append-only storage, not blockchain-style permanence.'],
  ['Data residency', 'The property that a city keeps its own material and product records in its own infrastructure. Federation exchanges agreed metadata, not raw records.'],
  ['Access-scope tier', 'One of public, operator, or regulator. A cumulative vocabulary describing who a given passport field is meant to be visible to.'],
  ['Digital Product Passport', 'The EU concept, introduced by the Ecodesign for Sustainable Products Regulation, of a machine-readable record that travels with a product. Usually shortened to DPP.'],
  ['Core-DP', 'The smallest machine-checkable LOOP profile: two lab nodes, registry and search, the offer-to-transfer sequence, signed messages, and an evidence log.'],
  ['Profile', 'A document that narrows the protocol for one interoperability target without changing the base schemas.'],
  ['RFC', 'Request for Comments. The written proposal format used to change the protocol in public.'],
];

const concepts = [
  {
    name: 'MaterialDNA',
    role: 'Material identity',
    icon: 'ph-atom',
    href: '/platform/materialdna/',
    body: 'The digital identity of a physical material or batch: what it is made of, its category, quantity, quality, where it came from, and every hand it has passed through. This is the primary record the whole flow revolves around.',
    state: 'Implemented in the lab reference node.',
  },
  {
    name: 'ProductDNA',
    role: 'Product identity',
    icon: 'ph-package',
    href: '/platform/productdna/',
    body: 'The same idea one layer up, for a finished or semi-finished product: category, condition, manufacturer, lifecycle stage, and a link to the material records it is composed of. A desk can point at its steel without duplicating it.',
    state: 'Implemented in the lab reference node.',
  },
  {
    name: 'LoopCoin',
    role: 'Local unit of account',
    icon: 'ph-coins',
    href: '/platform/loopcoin/',
    body: 'A design for a node-issued local unit with expiry and decay built in, so value circulates rather than accumulates. Each node would set its own backing, rate, and issuance ceiling.',
    state: 'Design model only. Not implemented, and no value is issued or settled.',
  },
  {
    name: 'LoopSignal',
    role: 'Community preference',
    icon: 'ph-broadcast',
    href: '/platform/loopsignal/',
    body: 'A number between zero and one per material category, expressing how strongly a community wants to keep or attract that material. Changes are capped per period and must apply equally to imports and exports.',
    state: 'Design model only. No preferences are collected anywhere.',
  },
  {
    name: 'LoopCost',
    role: 'Routing metric',
    icon: 'ph-path',
    href: '/platform/loopcost/',
    body: 'The figure derived from the signals: a base price plus an export penalty, an import penalty, and a distance component. Same-city transfers incur only the base price.',
    state: 'Design model only. No routing decisions are computed from it.',
  },
  {
    name: 'Node and federation',
    role: 'The network shape',
    icon: 'ph-share-network',
    href: '/docs/federation/',
    body: 'One node per city, holding its own records, signing its own messages, and choosing its own peers. Announcements travel a limited number of hops rather than flooding the network.',
    state: 'A two-node handshake and exchange runs in the lab demonstration.',
  },
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

const regulations = [
  {
    name: 'Waste Shipment Regulation and DIWASS',
    ref: 'Regulation (EU) 2024/1157',
    applies: 'Electronic handling of cross-border waste shipment documents',
    date: 'In force since 21 May 2026',
    action: 'Confirm your waste contractors can submit and retrieve shipment documents electronically. Annex VII green-list shipments may still use paper until 31 December 2026. Records must be kept at least five years.',
    loop: 'Transfer records carry a waste shipment document reference, facility and operator identifiers, and a retention date.',
  },
  {
    name: 'Packaging and Packaging Waste Regulation',
    ref: 'Regulation (EU) 2025/40',
    applies: 'Packaging identification, substance limits, conformity documentation',
    date: 'Applies since 12 August 2026',
    action: 'Map which packaging categories appear in city procurement. Do not commit to a specific label or data-carrier format yet: the implementing act that defines it has not been adopted.',
    loop: 'Packaging can be described as a product record with pool and batch references, so identifiers survive a reuse cycle.',
  },
  {
    name: 'Green claims rules for consumers',
    ref: 'Directive (EU) 2024/825',
    applies: 'How sustainability claims may be presented',
    date: 'Binding from 27 September 2026',
    action: 'Review any published circularity or material-flow statistics against tightened substantiation rules before you put them in front of residents.',
    loop: 'The protocol deliberately separates recorded data from any environmental claim about it. Metadata is not evidence of performance.',
  },
  {
    name: 'Ecodesign Regulation and the Digital Product Passport',
    ref: 'Regulation (EU) 2024/1781',
    applies: 'Product passports, introduced product group by product group',
    date: 'No product-specific delegated act adopted yet; iron and steel is furthest along',
    action: 'Assess procurement volumes in the first-wave categories. The cross-sectoral DPP Registry went live on 20 July 2026 and indexes identifiers and metadata only.',
    loop: 'Optional passport, classification, and traceability blocks exist as extension points. They are draft discussion fields, not a readiness claim.',
  },
  {
    name: 'Batteries Regulation',
    ref: 'Regulation (EU) 2023/1542',
    applies: 'Digital passports for EV, light means of transport, and industrial batteries above 2 kWh',
    date: '18 February 2027',
    action: 'Audit fleet and depot batteries now. Treat the exact data requirements as unconfirmed: the acts defining passport format and access rights are overdue. The separate raw-materials due-diligence duty starts 18 August 2027.',
    loop: 'Battery category, passport identifier, a backup copy location, and a due-diligence reference are all expressible fields.',
  },
  {
    name: 'German circular-economy policy',
    ref: 'NKWS and the Circular Economy Act',
    applies: 'National strategy direction rather than a dated obligation',
    date: 'Strategy adopted December 2024; amendment of the Act under discussion',
    action: 'Useful framing for municipal reuse and repair programmes and for arguing the case for better cross-boundary material data.',
    loop: 'Municipal node interoperability and reusable material identity are first-class design goals rather than add-ons.',
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
        <h1 className="hub-heading">What is LOOP?</h1>
        <p>
          LOOP is an open, draft protocol that lets cities describe the materials and products
          they hold, publish what is surplus, and record transfers to other cities in one shared
          machine-readable format. Each city keeps its own records in its own infrastructure.
          The name stands for Local Optimization with Overflow Protocol.
        </p>
        <p>
          This page is the executive version, written for people who have to make a decision
          about circular-economy data infrastructure rather than implement one. It explains what
          LOOP is, what it is not, and how it sits alongside the European and German rules that
          are arriving between now and 2027.
        </p>
        <MaturityStatus>
          Everything described here exists as a specification, published schemas, and a
          reference implementation running a scripted demonstration. There are no public
          pilots, no deployments, and no compliance claims.
        </MaturityStatus>
        <div className="cta-row">
          <a className="button primary" href="/protocol/spec/">Read the specification</a>
          <a className="button secondary" href="/docs/regulatory-alignment/">Regulatory alignment</a>
          <a className="button secondary" href="/interest/">Register interest</a>
        </div>
      </div>

      <div className="content-panel">
        <h2>LOOP in sixty seconds</h2>
        <ul>
          <li>
            Every material batch and every product gets a durable identifier and a record
            describing what it is, where it is, and how much of it there is.
          </li>
          <li>
            A city publishes an offer against that record. Another city accepts it as a match.
            The physical movement is recorded as a transfer. Four steps, and that is the whole
            core flow.
          </li>
          <li>
            Cities run their own nodes and federate directly with each other. There is no central
            operator, no central database, and no company in the middle.
          </li>
          <li>
            Records are plain JSON-LD sent over ordinary HTTPS, validated against published
            schemas. No blockchain is required and none is used.
          </li>
          <li>
            The protocol carries no personal data by design, which is both a privacy decision and
            what makes cross-boundary exchange straightforward to reason about.
          </li>
          <li>
            It is early. There is a written specification, published schemas, and a reference
            implementation that runs a scripted lab demonstration. There are no public pilots and
            no deployments.
          </li>
        </ul>
      </div>

      <div className="content-panel">
        <h2 className="section-title">On this page</h2>
        <div className="grid">
          {sections.map((section) => (
            <a className="card has-icon" href={`#${section.id}`} key={section.id}>
              <span aria-hidden="true" className="card-icon">
                <i className={`ph-bold ${section.icon}`} />
              </span>
              <h3>{section.label}</h3>
            </a>
          ))}
        </div>
      </div>

      <div className="content-panel">
        <h2 id="why">Why this exists</h2>
        <p>
          Material recovery today runs as a set of islands. A city knows, more or less, what
          enters and leaves its own facilities. It usually has no practical way to know that the
          district twenty kilometres away is landfilling exactly the feedstock its own processor
          is importing. The information exists on both sides. It simply has no shared shape, so
          nobody can act on it.
        </p>
        <p>
          The usual answer is a platform: one operator, one database, everyone joins. Cities are
          rightly reluctant. It means handing operational data and pricing leverage to a third
          party, and it means the value of the network is captured by whoever runs it.
        </p>
        <p>
          LOOP takes the other route, the one email and the web took. Instead of a shared
          platform, a shared format and a small set of endpoints. Any city that speaks the format
          can exchange with any other. Nobody has to join anything, and no operator sits in the
          middle. The design goals stated in the specification follow from that: preserve local
          autonomy, keep routing transparent, and stay implementable in more than one way.
        </p>
        <p>
          There is a second, more immediate reason. Between 2026 and 2027 a series of European
          rules turn material and product information into something that has to be digital,
          structured, and exchangeable. Cities will be asked for structured data whether or not
          they have somewhere to put it.
        </p>
      </div>

      <div className="content-panel">
        <h2 id="how-it-works">How LOOP works</h2>
        <p>
          The core of the protocol is four steps. The specification calls this the minimal
          interoperability flow, and it is deliberately the smallest thing two nodes can do
          together and still be useful.
        </p>
        <ol className="table-list">
          <li>
            <span>1. Register</span>
            <div>
              A node records a material batch or a product as a MaterialDNA or ProductDNA entry:
              what it is, its category, quantity, quality, where it came from, where it is now,
              and when it becomes available.
            </div>
          </li>
          <li>
            <span>2. Offer</span>
            <div>
              The node publishes an offer against that record, stating quantity, origin city,
              destination city, and how long the offer stands.
            </div>
          </li>
          <li>
            <span>3. Match</span>
            <div>
              Another party proposes a match against an open offer. When the match is accepted,
              the offer is reserved so the same batch cannot be promised twice.
            </div>
          </li>
          <li>
            <span>4. Transfer</span>
            <div>
              The physical handover is recorded and moves from scheduled to in transit to
              completed. This is the record that carries shipment document references, route
              information, and retention dates.
            </div>
          </li>
        </ol>
        <p>
          Each of those has a defined set of states and defined rules about which state can follow
          which. An offer is open, then reserved or withdrawn. A match is proposed, then accepted
          or rejected. A transfer is scheduled, in transit, then completed or cancelled. Once
          something reaches a final state it cannot quietly go backwards.
        </p>
        <p>
          The rules that connect them matter more than they look. A match can only be created
          against an open offer. Only one active match may exist per offer. A transfer requires an
          accepted match. An offer cannot promise more than the batch actually contains. Those
          four constraints are what stop the same skip of aluminium being sold to three
          neighbouring districts at once, and they are enforced in the reference implementation at
          the database level rather than by convention.
        </p>
        <p>
          Everything moves as JSON-LD over HTTPS, with timestamps in UTC. Nodes authenticate each
          other with signed requests rather than shared passwords.
        </p>
      </div>

      <div className="content-panel">
        <h2 id="concepts">The six core concepts</h2>
        <p>
          The specification defines six named concepts. Two of them, MaterialDNA and ProductDNA,
          are implemented and exercised in the lab demonstration. The other three, plus the metric
          derived from them, are design models on paper. The distinction is worth holding onto
          while reading anything else about LOOP.
        </p>
      </div>

      <div className="content-panel">
        <div className="grid">
          {concepts.map((concept) => (
            <a className="card has-icon" href={concept.href} key={concept.name}>
              <span aria-hidden="true" className="card-icon">
                <i className={`ph-bold ${concept.icon}`} />
              </span>
              <h3>{concept.name}</h3>
              <p className="text-soft">{concept.role}</p>
              <p>{concept.body}</p>
              <p className="text-soft">{concept.state}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="content-panel">
        <h3>How the economic concepts fit together, on paper</h3>
        <p>
          LoopSignal is the input and LoopCost is the output. A city expresses, as a number
          between zero and one, how strongly it wants to keep or attract a material category.
          That number becomes a penalty on the calculated cost of moving that material across the
          boundary, in both directions equally. The full formula adds a base price, an export
          penalty, an import penalty, and a distance component.
        </p>
        <p>
          The intended effect is that a transfer inside one city incurs only the base price, so
          short local loops are structurally cheaper than long ones, without anybody being
          forbidden from trading further afield when it genuinely makes sense. LoopCoin is the
          proposed unit those figures would be denominated in, with expiry and decay built in to
          discourage hoarding.
        </p>
        <div className="notice">
          None of this is implemented. LoopCoin, LoopSignal, LoopCost, and settlement have no
          route, no data model, and no running code. They are explicitly out of scope in the
          current delivery profile. Treat them as published design intent, not as behaviour you
          could rely on.
        </div>
      </div>

      <div className="content-panel">
        <h2 id="identifiers">What an identifier actually looks like</h2>
        <p>
          Identifiers are readable on purpose. A material identifier encodes country, city, year,
          category, and a unique suffix. A product identifier follows the same shape.
        </p>
        <div className="code-block">
          <pre>
            <code>{`MAT-DE-MUC-2025-PLASTIC-B847F3
PRD-DE-MUC-2025-DESK-F4A7B2`}</code>
          </pre>
        </div>
        <p>
          Categories are a fixed list rather than free text, which is the boring detail that makes
          cross-city search work at all: plastics broken down by polymer, metals, organics, glass,
          paper, textiles, and electronics including battery waste. A product record may point at
          the material records it is composed of, so a desk can reference its steel and its
          particle board without duplicating either.
        </p>
        <p>
          You can read the full field lists in the{' '}
          <a href="/library/schemas/">published JSON schemas</a> or work through the{' '}
          <a href="/library/examples/">worked example payloads</a>.
        </p>
      </div>

      <div className="content-panel">
        <h2 id="glossary">Key terms</h2>
        <p>
          Canonical definitions live in the specification. These are the short forms, in the order
          you are likely to meet them.
        </p>
        <div className="table-list">
          {glossary.map(([term, definition]) => (
            <div key={term}>
              <span>{term}</span>
              <div>{definition}</div>
            </div>
          ))}
        </div>
        <div className="cta-row">
          <a className="button secondary" href="/docs/glossary/">Full glossary</a>
        </div>
      </div>

      <div className="content-panel">
        <h2 id="node">What a node is, and what running one involves</h2>
        <p>
          A node is one city's LOOP implementation. The specification says what a node has to be
          able to do, not how to build it: keep a registry of materials and one of products,
          handle the offer-to-transfer sequence, and record what happened. The economic components
          it also describes, currency and signals and routing, are the unimplemented part.
        </p>
        <p>
          In the lab configuration a node is a small server running a PostgreSQL-compatible
          database, a Redis-compatible cache, and an S3-compatible object store, all as
          containers. Infrastructure cost scales with material-flow volume and how long records
          must be retained. The protocol and the schemas are open source and royalty-free.
        </p>
        <p>
          The honest cost line is integration, not hosting. Connecting a node to an existing
          enterprise resource planning or waste-management system is where the effort goes, and it
          depends entirely on what a given city already runs. The{' '}
          <a href="/docs/implementation/">implementation guide</a> sets out a minimum viable
          checklist.
        </p>
      </div>

      <div className="content-panel">
        <h2 id="data">Data, privacy, and residency</h2>
        <p>
          The most consequential design decision in LOOP is what it refuses to carry. Protocol
          payloads must not contain personal data. Node identifiers, city names, and organisation
          identifiers are permitted. Names, email addresses, and phone numbers are not, and the
          contact field in the material schema is explicitly reserved rather than usable.
        </p>
        <p>
          That is a deliberate structural choice rather than a policy promise. If personal data is
          never in the shared payload, cross-boundary exchange does not become a personal-data
          transfer question, and the awkward part of the assessment disappears instead of being
          managed.
        </p>
        <p>
          Residency follows the same logic. Each city holds its own records in its own
          infrastructure, under its own jurisdiction. Federation exchanges agreed material-flow
          metadata, not raw records. Nothing is pooled centrally because there is no centre.
        </p>
        <p>
          Beyond that, nodes are expected to use current transport security, to expire access
          tokens, to rate-limit, and to keep an immutable log of registrations, settlements,
          signal changes, and node interactions. A baseline data-protection assessment for the lab
          demonstration is published at{' '}
          <a href="/docs/dpia-lite/">the DPIA Lite page</a>; any real deployment would need its
          own, based on its own configuration and national law.
        </p>
      </div>

      <div className="content-panel">
        <h2 id="architecture">How the pieces fit together</h2>
        <p>
          The word LOOP gets used for four different things. Separating them makes the rest of the
          documentation much easier to read.
        </p>
        <div className="table-list">
          <div>
            <span>The protocol</span>
            <div>
              The written specification: terminology, message formats, required endpoints,
              federation rules, and security requirements. This is the normative document.
            </div>
          </div>
          <div>
            <span>The schemas</span>
            <div>
              Published JSON Schema and JSON-LD context files that make the specification
              machine-checkable. Any implementation validates against these.
            </div>
          </div>
          <div>
            <span>A node</span>
            <div>
              Any software that implements the protocol. There is one reference backend, used to
              run the lab demonstration; it is a reference, not the only permitted implementation.
            </div>
          </div>
          <div>
            <span>This documentation hub</span>
            <div>
              The public site you are reading, which mirrors the specification, the schemas, the
              examples, and the governance documents.
            </div>
          </div>
        </div>
        <p>
          On the wire it is unremarkable, which is the point. Requests carry JSON-LD, over
          transport-layer security, with timestamps in UTC. Nodes discover each other through a
          registry of peers and sign their requests with a node identifier, a signature, and a
          timestamp that must be recent. Announcements propagate to peers with a limited hop count
          rather than flooding the network. A working node needs to know its immediate neighbours,
          not the whole world.
        </p>
      </div>

      <div className="content-panel">
        <h2 id="regulation">LOOP and the regulatory landscape</h2>
        <div className="notice">
          <strong>Read this first.</strong> This section is informational and is not legal advice.
          localLOOP is lab-demo software with no public pilots and no deployments, and nothing
          here is a claim of compliance, certification, or regulatory readiness for LOOP or for
          any city using it. Regulatory status is summarised as of {REGULATORY_STATUS_DATE}; the
          maintained version, with sources, lives on the{' '}
          <a href="/docs/regulatory-alignment/">regulatory alignment page</a>.
        </div>
        <p>
          European rules are moving material and product information from paper and spreadsheets
          into structured, machine-readable records. Several of those rules are already operative.
          The pattern is consistent: an identifier that travels with the thing, structured data
          behind it, and an authority or counterparty able to look it up.
        </p>
        <p>
          That is the same shape as a protocol record, which is why LOOP carries optional passport,
          classification, and traceability blocks alongside its core fields. Those blocks are draft
          discussion fields and extension points. They are designed to be extensible toward
          passport-style requirements so that adopting one later is an addition rather than a
          rebuild. They are not a readiness claim, and they do not mean LOOP implements any of
          these regimes.
        </p>
        <p>
          One structural detail is worth a city officer's attention. The EU registry that went live
          in July 2026 indexes identifiers and metadata only: the passport content itself stays
          with whoever holds it. That decentralised, reference-by-identifier shape is the same one
          LOOP arrived at independently, which is a reasonable signal that node-held records are
          not a fringe position.
        </p>

        <h3>What applies, when, and what a city can do about it</h3>
        {regulations.map((item) => (
          <section key={item.ref}>
            <h4 className="reg-name">
              {item.name} <span className="text-soft">— {item.ref}</span>
            </h4>
            <div className="table-list">
              <div>
                <span>What applies</span>
                <div>{item.applies}.</div>
              </div>
              <div>
                <span>Timing</span>
                <div>{item.date}</div>
              </div>
              <div>
                <span>City action</span>
                <div>{item.action}</div>
              </div>
              <div>
                <span>Where LOOP could help</span>
                <div>{item.loop}</div>
              </div>
            </div>
          </section>
        ))}

        <h3>Two cautions</h3>
        <p>
          First, several of the acts that would define exact data formats are late. The packaging
          data-carrier format, and the battery passport format and access rules, are all still
          unadopted at the time of writing. Any vendor telling you today exactly which fields you
          will need is guessing. The defensible position is to keep your data structured and your
          format commitments loose.
        </p>
        <p>
          Second, the international framework that several passport-style field names draw on is
          itself still pre-release. Any description of a LOOP field as aligned to it is directional
          and not a conformance statement.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/docs/regulatory-alignment/">
            Full roadmap with official sources
          </a>
          <a className="button secondary" href="https://eur-lex.europa.eu/" rel="noreferrer noopener" target="_blank">
            EUR-Lex
          </a>
        </div>
      </div>

      <div className="content-panel">
        <h2 id="status">What exists today, and what does not</h2>
        <p>
          Being precise about this is more useful to a decision-maker than enthusiasm would be.
        </p>
        <div className="table-list">
          <div>
            <span>Exists</span>
            <div>
              A versioned written specification. Published JSON schemas and JSON-LD contexts.
              Worked example payloads. A reference backend implementing the specification
              endpoints. A scripted lab demonstration of the register-to-transfer flow and of a
              two-node federation handshake. Public governance and security documents.
            </div>
          </div>
          <div>
            <span>Scoped down deliberately</span>
            <div>
              The smallest checkable profile covers exactly two nodes, registry and search, the
              offer-to-transfer sequence, signed messages, an append-only evidence log, and error
              handling. It is profile conformance, not full protocol conformance, and it says so.
            </div>
          </div>
          <div>
            <span>Does not exist</span>
            <div>
              Any public pilot or deployment. Any settlement, currency, or payment behaviour.
              Community preference collection or routing decisions made from it. Generalised
              federation beyond two nodes. Any certification, conformity assessment, or
              regulatory approval.
            </div>
          </div>
          <div>
            <span>Append-only, not immutable</span>
            <div>
              The evidence log is append-only storage with hashes and retention dates. It is not
              blockchain-style permanence and is not described as such anywhere in the protocol.
            </div>
          </div>
        </div>
        <p>
          You can watch the implemented flow run on the{' '}
          <a href="/platform/demo-city/">demonstration city page</a>, which is read-only, or read
          the <a href="/docs/lab-demo/">lab demo walkthrough</a>.
        </p>
      </div>

      <div className="content-panel">
        <h2 id="governance">Governance, and how to take part</h2>
        <p>
          Protocol changes go through a public Request for Comments process. Anyone can open a
          discussion and submit a proposal against a published template; substantial changes need
          community review before adoption, and each proposal moves through documented states so
          the reasoning stays on the record.
        </p>
        <p>
          Versioning is a written policy rather than a habit. Minor versions are additive and must
          not remove or rename existing required fields. Receivers are expected to accept additive
          versions and preserve fields they do not recognise. Payloads written against the previous
          version remain valid against the current schemas. For a city, that is the property that
          matters: what you write today should not stop parsing next year.
        </p>
        <p>
          The project is candid about its own governance limits. A public proposal documents that
          the standing two-person review quorum is not currently meetable with one active
          maintainer, and records the narrower substitute in force instead of quietly ignoring the
          rule. There is also a published claims policy that forbids asserting pilots,
          deployments, compliance, or certification without current scoped evidence, which is the
          reason this page reads the way it does.
        </p>
        <p>
          The useful thing a city can do at this stage is tell us what would have to be true for
          this to be worth running, and which of your existing systems it would have to talk to.
          That input is more valuable now, while the vocabulary is still soft, than after it
          hardens.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/interest/">Register interest</a>
          <a className="button secondary" href="/governance/">Governance documents</a>
          <a className="button secondary" href="/governance/rfcs/">Read the proposals</a>
        </div>
      </div>

      <div className="content-panel">
        <h2 id="faq">Questions cities ask</h2>
        <div className="table-list">
          {faqs.map((item) => (
            <div key={item.q}>
              <span>{item.q}</span>
              <div>{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-panel">
        <h2 id="further-reading">Where to go next</h2>
        <div className="grid">
          <a className="card has-icon" href="/protocol/spec/">
            <span aria-hidden="true" className="card-icon"><i className="ph-bold ph-scroll" /></span>
            <h3>The specification</h3>
            <p>Normative requirements, endpoints, and federation flows in full.</p>
          </a>
          <a className="card has-icon" href="/docs/regulatory-alignment/">
            <span aria-hidden="true" className="card-icon"><i className="ph-bold ph-scales" /></span>
            <h3>Regulatory alignment</h3>
            <p>The maintained regulation roadmap, with official sources and dates.</p>
          </a>
          <a className="card has-icon" href="/library/schemas/">
            <span aria-hidden="true" className="card-icon"><i className="ph-bold ph-brackets-curly" /></span>
            <h3>Schemas and examples</h3>
            <p>Every field of every record type, plus worked payloads.</p>
          </a>
          <a className="card has-icon" href="/docs/faq/">
            <span aria-hidden="true" className="card-icon"><i className="ph-bold ph-question" /></span>
            <h3>Full FAQ</h3>
            <p>Including the decision-maker section on cost, privacy, and timing.</p>
          </a>
          <a className="card has-icon" href="/platform/demo-city/">
            <span aria-hidden="true" className="card-icon"><i className="ph-bold ph-buildings" /></span>
            <h3>Demonstration city</h3>
            <p>A read-only view of the lab flow with seeded data.</p>
          </a>
          <a className="card has-icon" href="/interest/">
            <span aria-hidden="true" className="card-icon"><i className="ph-bold ph-paper-plane-tilt" /></span>
            <h3>Register interest</h3>
            <p>Tell us what your city would need before this is worth running.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
