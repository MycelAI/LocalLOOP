import { SiteHeader } from '../SiteHeader';
import { SiteFooter } from '../SiteFooter';
import { Sidebar } from './Sidebar';

/**
 * Unified ContentLayout component - replaces 6 duplicate layout patterns
 *
 * @param {string} section - Section key for sidebar (docs, protocol, governance, library, platform, engage)
 * @param {string} subtitle - Header subtitle text
 * @param {boolean} showSidebar - Whether to show sidebar (default: true)
 * @param {React.ReactNode} children - Page content
 */
export function ContentLayout({
  section,
  subtitle,
  showSidebar = true,
  children
}) {
  return (
    <>
      <SiteHeader subtitle={subtitle} />
      <main className="content-main">
        {showSidebar ? (
          <div className="content-layout">
            <Sidebar section={section} />
            <div className="content-body">
              {children}
            </div>
          </div>
        ) : (
          <div className="content-body content-body--full">
            {children}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * Pre-configured layouts for each section
 */
export function DocsLayout({ children }) {
  return (
    <ContentLayout section="docs" subtitle="Operator & Developer Docs">
      {children}
    </ContentLayout>
  );
}

export function ProtocolLayout({ children }) {
  return (
    <ContentLayout section="protocol" subtitle="LOOP Protocol">
      {children}
    </ContentLayout>
  );
}

export function GovernanceLayout({ children }) {
  return (
    <ContentLayout section="governance" subtitle="Governance">
      {children}
    </ContentLayout>
  );
}

export function LibraryLayout({ children }) {
  return (
    <ContentLayout section="library" subtitle="Library">
      {children}
    </ContentLayout>
  );
}

export function PlatformLayout({ children }) {
  return (
    <ContentLayout section="platform" subtitle="Platform">
      {children}
    </ContentLayout>
  );
}

export function EngageLayout({ children }) {
  return (
    <ContentLayout section="engage" subtitle="Engage">
      {children}
    </ContentLayout>
  );
}
