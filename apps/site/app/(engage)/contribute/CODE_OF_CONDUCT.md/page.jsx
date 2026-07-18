import { createAliasMetadata } from '@/app/config/metadata';
import { Redirect } from '@/app/components/Redirect';

export const metadata = createAliasMetadata({
  title: 'Contribute',
  description: 'This legacy path redirects to the localLOOP contribution page.',
  canonical: '/contribute',
});

export default function CocRedirect() {
  return <Redirect to="/contribute" label="Continue to contribution guidance" />;
}
