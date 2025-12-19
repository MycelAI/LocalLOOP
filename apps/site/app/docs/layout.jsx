import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { DocsSidebar } from './components/DocsSidebar';

export default function DocsLayout({ children }) {
  return (
    <>
      <SiteHeader subtitle="Operator & Developer Docs" />
      <main className="content-main">
        <div className="content-layout">
          <DocsSidebar />
          <div className="content-body">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
