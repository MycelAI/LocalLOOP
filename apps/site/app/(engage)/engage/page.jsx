// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { createAliasMetadata } from '@/app/config/metadata';
import { Redirect } from '@/app/components/Redirect';

export const metadata = createAliasMetadata({
  title: 'Expression of interest',
  description: 'This legacy path redirects to the localLOOP expression-of-interest page.',
  canonical: '/interest',
});

export default function EngageAliasPage() {
  return <Redirect to="/interest/" label="Continue to expression of interest" />;
}
