import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { GovernanceSidebar } from './components/GovernanceSidebar';

export default function GovernanceLayout({ children }) {
  return (
    <>
      <SiteHeader subtitle="Governance" />
      <main className="content-main">
        <div className="content-layout">
          <GovernanceSidebar />
          <div className="content-body">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
