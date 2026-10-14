// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

export function MaturityStatus({ className = '', children = 'Lab-only: exploratory documentation and demo evidence; not a public deployment or compliance claim.' }) {
  return (
    <p className={`maturity-status ${className}`.trim()}>
      <span aria-hidden="true" className="maturity-status__dot" />
      <span><strong>Lab-only status.</strong> {children}</span>
    </p>
  );
}
