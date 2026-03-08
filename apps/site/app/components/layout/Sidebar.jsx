'use client';

import { usePathname } from 'next/navigation';
import { sectionConfigs } from '../../config/sections';

const normalizePath = (path) => (path || '/').replace(/\/$/, '') || '/';

/**
 * Unified Sidebar component - replaces 6 separate sidebar components
 * @param {string} section - The section key from sectionConfigs (docs, protocol, governance, library, platform, engage)
 */
export function Sidebar({ section }) {
  const pathname = usePathname();
  const config = sectionConfigs[section];

  if (!config) {
    console.warn(`Sidebar: Unknown section "${section}"`);
    return null;
  }

  const current = normalizePath(pathname);
  const isActive = (href) => !href.startsWith('http') && normalizePath(href) === current;
  const isTitleActive = config.href && normalizePath(config.href) === current;

  return (
    <aside className="side-nav">
      {config.href ? (
        <a
          href={config.href}
          className={`side-title${isTitleActive ? ' active' : ''}`}
          aria-current={isTitleActive ? 'page' : undefined}
        >
          {config.title}
        </a>
      ) : (
        <div className="side-title">{config.title}</div>
      )}

      {config.groups.map((group, groupIndex) => (
        <div className="side-group" key={groupIndex}>
          {group.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={!link.external && isActive(link.href) ? 'page' : undefined}
              className={!link.external && isActive(link.href) ? 'active' : ''}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
              {link.crossSection && <span className="side-link-ext">↗</span>}
            </a>
          ))}
        </div>
      ))}

      {config.note && (
        <div className="side-note">
          <span>{config.note.text}</span>
          <a href={config.note.link.href}>{config.note.link.label}</a>
        </div>
      )}
    </aside>
  );
}
