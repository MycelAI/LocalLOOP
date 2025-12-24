'use client';

import { usePathname } from 'next/navigation';
import { sectionConfigs } from '../../config/sections';

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

  const isActive = (href) => pathname === href;

  return (
    <aside className="side-nav">
      <div className="side-title">{config.title}</div>

      {config.groups.map((group, groupIndex) => (
        <div className="side-group" key={groupIndex}>
          <span className="side-label">{group.label}</span>
          {group.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={!link.external && isActive(link.href) ? 'page' : undefined}
              className={!link.external && isActive(link.href) ? 'active' : ''}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </div>
      ))}

      {config.note && (
        <div className="side-note">
          {config.note.text} <a href={config.note.link.href}>{config.note.link.label}</a>
        </div>
      )}
    </aside>
  );
}
