import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { EngageSidebar } from './components/EngageSidebar';

export default function EngageLayout({ children }) {
  return (
    <>
      <SiteHeader subtitle="Engage & Contribute" />
      <main className="content-main">
        <div className="content-layout">
          <EngageSidebar />
          <div className="content-body">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
