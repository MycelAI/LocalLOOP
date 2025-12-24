import { ContentLayout } from '../components/layout';

export default function Layout({ children }) {
  return (
    <ContentLayout section="library" subtitle="Schema Library">
      {children}
    </ContentLayout>
  );
}
