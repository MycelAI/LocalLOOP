import { ContentLayout } from '../components/layout';

export default function Layout({ children }) {
  return (
    <ContentLayout section="engage" subtitle="Engage & Contribute">
      {children}
    </ContentLayout>
  );
}
