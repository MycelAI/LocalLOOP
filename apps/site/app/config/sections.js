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
          { href: '/docs', label: 'Docs' }
        ]
      },
      {
        label: 'Guides',
        links: [
          { href: '/docs/implementation', label: 'Implementation' },
          { href: '/docs/regulatory-alignment', label: 'Regulatory Alignment' },
          { href: '/docs/lab-demo', label: 'Lab Demo' },
          { href: '/docs/federation', label: 'Federation Handshake' },
          { href: '/docs/security', label: 'Security Guide' },
          { href: '/docs/secure-coding', label: 'Secure Coding' },
          { href: '/docs/incident-response', label: 'Incident Response' },
          { href: '/docs/api', label: 'API Docs' },
          { href: '/docs/metrics', label: 'Metrics' }
        ]
      },
      {
        label: 'Reference',
        links: [
          { href: '/docs/faq', label: 'FAQ' },
          { href: '/docs/glossary', label: 'Glossary' },
          { href: '/docs/threat-model', label: 'Threat Model' },
          { href: '/docs/dpia-lite', label: 'DPIA Lite' }
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
          { href: '/protocol', label: 'Protocol' }
        ]
      },
      {
        label: 'Reference',
        links: [
          { href: '/protocol/spec', label: 'Specification' },
          { href: '/protocol/changelog', label: 'Changelog' },
          { href: '/protocol/security', label: 'Security Policy' },
          { href: '/docs/regulatory-alignment', label: 'Compatibility Roadmap' }
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
          { href: '/governance', label: 'Governance' }
        ]
      },
      {
        label: 'RFCs',
        links: [
          { href: '/governance/rfcs', label: 'RFC Guide' },
          { href: '/governance/template', label: 'RFC Template' },
          { href: '/governance/smart-contracts', label: 'Smart Contract RFC' }
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
          { href: '/library', label: 'Library' }
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
          { href: '/platform', label: 'Platform' }
        ]
      },
      {
        label: 'Identity Layers',
        links: [
          { href: '/platform/materialdna', label: 'MaterialDNA' },
          { href: '/platform/productdna', label: 'ProductDNA' }
        ]
      },
      {
        label: 'City Portals',
        links: [
          { href: '/platform/city-portals', label: 'City Portals' },
          { href: '/platform/demo-city', label: 'DEMO City' }
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
          { href: '/interest', label: 'Expression of Interest' },
          { href: '/projects', label: 'Project Hub' },
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
