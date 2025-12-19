import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { ProtocolSidebar } from './components/ProtocolSidebar';

export default function ProtocolLayout({ children }) {
  return (
    <>
      <SiteHeader subtitle="LOOP Protocol" />
      <main className="content-main">
        <div className="content-layout">
          <ProtocolSidebar />
          <div className="content-body">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
