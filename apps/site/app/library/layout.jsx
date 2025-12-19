import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { LibrarySidebar } from './components/LibrarySidebar';

export default function LibraryLayout({ children }) {
  return (
    <>
      <SiteHeader subtitle="Schema Library" />
      <main className="content-main">
        <div className="content-layout">
          <LibrarySidebar />
          <div className="content-body">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
