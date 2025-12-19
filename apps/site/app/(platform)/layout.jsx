import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { PlatformSidebar } from './components/PlatformSidebar';

export default function PlatformLayout({ children }) {
  return (
    <>
      <SiteHeader subtitle="Platform" />
      <main className="content-main">
        <div className="content-layout">
          <PlatformSidebar />
          <div className="content-body">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
