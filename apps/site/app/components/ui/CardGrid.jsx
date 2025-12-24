/**
 * CardGrid component - responsive grid layout for cards
 *
 * @param {string} columns - Column configuration: 'auto' | '2' | '3' | '4'
 * @param {string} gap - Gap size: 'sm' | 'md' | 'lg'
 * @param {string} className - Additional CSS classes
 */
export function CardGrid({
  children,
  columns = 'auto',
  gap = 'md',
  className = ''
}) {
  const gridClasses = [
    'card-grid',
    `card-grid--${columns}`,
    `card-grid--gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}
