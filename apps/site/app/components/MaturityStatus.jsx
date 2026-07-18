export function MaturityStatus({ className = '', children = 'Lab-only: exploratory documentation and demo evidence; not a public deployment or compliance claim.' }) {
  return (
    <p className={`maturity-status ${className}`.trim()} role="status">
      <span aria-hidden="true" className="maturity-status__dot" />
      <span><strong>Lab-only status.</strong> {children}</span>
    </p>
  );
}
