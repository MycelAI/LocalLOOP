// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { ContentLayout } from '../components/layout';

export default function Layout({ children }) {
  return (
    <ContentLayout section="engage" subtitle="Engage & Contribute">
      {children}
    </ContentLayout>
  );
}
