import { Fields } from '@measured/puck';
import { AssetPicker } from '../fields/AssetPicker';
import { LinkPicker } from '../fields/LinkPicker';

export interface HeroProps {
  title: string;
  subtitle: string;
  bgImage?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align: 'left' | 'center' | 'right';
}

export default function Hero({
  title,
  subtitle,
  bgImage,
  ctaLabel,
  ctaHref,
  align,
}: HeroProps) {
  const alignStyle = {
    textAlign: align || 'center',
    alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: '96px 24px',
        width: '100%',
        boxSizing: 'border-box',
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'var(--ppx-bg, #ffffff)',
        color: bgImage ? '#ffffff' : 'var(--ppx-fg, #1a1a1a)',
        display: 'flex',
        flexDirection: 'column',
        ...alignStyle,
      }}
    >
      {bgImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 1,
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 800,
          display: 'flex',
          flexDirection: 'column',
          ...alignStyle,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--ppx-font-heading, inherit)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 16px 0',
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              fontFamily: 'var(--ppx-font-body, inherit)',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              lineHeight: 1.6,
              margin: '0 0 32px 0',
              opacity: 0.9,
            }}
          >
            {subtitle}
          </p>
        )}

        {ctaLabel && (
          <a
            href={ctaHref || '#'}
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'var(--ppx-accent, #6750A4)',
              color: '#ffffff',
              borderRadius: 'var(--ppx-radius, 8px)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}

export const fields: Fields<HeroProps> = {
  title: { type: 'text' },
  subtitle: { type: 'textarea' },
  bgImage: AssetPicker,
  ctaLabel: { type: 'text' },
  ctaHref: LinkPicker,
  align: {
    type: 'select',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ],
  },
};

export const defaultProps: HeroProps = {
  title: 'Make Something Great',
  subtitle: 'A clean, modern website built entirely client-side without any backend.',
  ctaLabel: 'Get Started',
  ctaHref: '#',
  align: 'center',
};
