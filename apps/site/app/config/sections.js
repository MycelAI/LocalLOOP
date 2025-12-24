/**
 * Unified sidebar configuration for all sections
 * This replaces 6 separate sidebar components with a single config-driven approach
 */

export const sectionConfigs = {
  docs: {
    title: 'Docs',
    groups: [
      {
        label: 'Overview',
        links: [
          { href: '/docs', label: 'Documentation home' }
        ]
      },
      {
        label: 'Guides',
        links: [
          { href: '/docs/implementation', label: 'Implementation' },
          { href: '/docs/lab-demo', label: 'Lab demo' },
          { href: '/docs/federation', label: 'Federation handshake' },
          { href: '/docs/security', label: 'Security guide' },
          { href: '/docs/secure-coding', label: 'Secure coding' },
          { href: '/docs/incident-response', label: 'Incident response' },
          { href: '/docs/api', label: 'API docs' },
          { href: '/docs/metrics', label: 'Metrics' }
        ]
      },
      {
        label: 'Reference',
        links: [
          { href: '/docs/faq', label: 'FAQ' },
          { href: '/docs/glossary', label: 'Glossary' },
          { href: '/viewer.html?path=projects/loop-protocol/docs/compliance/threat-model.md&title=Threat%20Model', label: 'Threat model', external: true },
          { href: '/viewer.html?path=projects/loop-protocol/docs/compliance/dpia-lite.md&title=DPIA%20Lite', label: 'DPIA lite', external: true }
        ]
      }
    ],
    note: {
      text: 'Need the protocol spec?',
      link: { href: '/protocol/spec', label: 'Open specification' }
    }
  },

  protocol: {
    title: 'Protocol',
    groups: [
      {
        label: 'Overview',
        links: [
          { href: '/protocol', label: 'Protocol hub' }
        ]
      },
      {
        label: 'Reference',
        links: [
          { href: '/protocol/spec', label: 'Specification' },
          { href: '/protocol/changelog', label: 'Changelog' },
          { href: '/protocol/security', label: 'Security policy' }
        ]
      }
    ],
    note: {
      text: 'Looking for operator guidance?',
      link: { href: '/docs/security', label: 'Open security guide' }
    }
  },

  governance: {
    title: 'Governance',
    groups: [
      {
        label: 'Overview',
        links: [
          { href: '/governance', label: 'Governance hub' }
        ]
      },
      {
        label: 'RFCs',
        links: [
          { href: '/governance/rfcs', label: 'RFC guide' },
          { href: '/governance/template', label: 'RFC template' },
          { href: '/governance/smart-contracts', label: 'Smart contract RFC' }
        ]
      }
    ],
    note: {
      text: 'Need protocol context?',
      link: { href: '/protocol', label: 'Open protocol hub' }
    }
  },

  library: {
    title: 'Library',
    groups: [
      {
        label: 'Overview',
        links: [
          { href: '/library', label: 'Library hub' }
        ]
      },
      {
        label: 'Artifacts',
        links: [
          { href: '/library/schemas', label: 'Schemas' },
          { href: '/library/examples', label: 'Examples' }
        ]
      }
    ],
    note: {
      text: 'Need the protocol rules?',
      link: { href: '/protocol/spec', label: 'Open specification' }
    }
  },

  platform: {
    title: 'Platform',
    groups: [
      {
        label: 'Overview',
        links: [
          { href: '/', label: 'Platform overview' }
        ]
      },
      {
        label: 'Portals',
        links: [
          { href: '/materialDNA', label: 'MaterialDNA' },
          { href: '/cities', label: 'City portals' },
          { href: '/DEMO-City', label: 'DEMO City' }
        ]
      }
    ],
    note: {
      text: 'Need protocol details?',
      link: { href: '/protocol', label: 'Open protocol overview' }
    }
  },

  engage: {
    title: 'Engage',
    groups: [
      {
        label: 'Engage',
        links: [
          { href: '/interest', label: 'Expression of interest' },
          { href: '/projects', label: 'Project hub' },
          { href: '/contribute', label: 'Contribute' }
        ]
      }
    ],
    note: {
      text: 'Need protocol context?',
      link: { href: '/protocol', label: 'Open protocol overview' }
    }
  }
};
