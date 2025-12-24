import Link from 'next/link';

/**
 * Unified Card component - replaces repeated card markup throughout the site
 *
 * @param {string} icon - Icon name (uses Phosphor icons via className)
 * @param {string} title - Card title
 * @param {string} description - Card description text
 * @param {string} href - Link destination (makes card clickable)
 * @param {string} linkText - Text for the link (default: "Learn more")
 * @param {string} variant - Card style variant: 'default' | 'feature' | 'cta'
 * @param {string} size - Card size: 'sm' | 'md' | 'lg'
 * @param {string} className - Additional CSS classes
 */
export function Card({
  icon,
  title,
  description,
  href,
  linkText = 'Learn more',
  variant = 'default',
  size = 'md',
  className = '',
  children
}) {
  const cardClasses = [
    'card',
    icon && 'has-icon',
    `card--${variant}`,
    `card--${size}`,
    className
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {icon && (
        <span className="card-icon">
          <i className={`ph-bold ph-${icon}`}></i>
        </span>
      )}
      {title && <h3 className="card-title">{title}</h3>}
      {description && <p className="card-description">{description}</p>}
      {children}
      {href && linkText && (
        <span className="card-link">{linkText} <span aria-hidden="true">&rarr;</span></span>
      )}
    </>
  );

  if (href) {
    // External links
    if (href.startsWith('http') || href.startsWith('//')) {
      return (
        <a href={href} className={cardClasses} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    // Internal links
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}

/**
 * Feature Card - prominent card for key features
 */
export function FeatureCard(props) {
  return <Card {...props} variant="feature" />;
}

/**
 * CTA Card - call-to-action card with emphasis
 */
export function CTACard(props) {
  return <Card {...props} variant="cta" />;
}
