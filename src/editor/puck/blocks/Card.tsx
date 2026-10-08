import { Fields } from '@measured/puck';
import { AssetPicker } from '../fields/AssetPicker';
import { LinkPicker } from '../fields/LinkPicker';

export interface CardProps {
  image?: string;
  title: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
}

export default function Card({ image, title, body, linkHref, linkLabel }: CardProps) {
  return (
    <div
      style={{
        border: '1px solid var(--ppx-border, #e5e0d8)',
        borderRadius: 'var(--ppx-radius, 8px)',
        backgroundColor: 'var(--ppx-bg, #ffffff)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        margin: '12px 0',
      }}
    >
      {image && (
        <img
          src={image}
          alt={title}
          style={{ width: '100%', height: 200, objectFit: 'cover' }}
        />
      )}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3
          style={{
            fontFamily: 'var(--ppx-font-heading, inherit)',
            margin: '0 0 10px 0',
            fontSize: '1.25rem',
            color: 'var(--ppx-fg, #1a1a1a)',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--ppx-font-body, inherit)',
            margin: '0 0 16px 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--ppx-muted, #6b6b6b)',
            flexGrow: 1,
          }}
        >
          {body}
        </p>
        {linkLabel && (
          <a
            href={linkHref || '#'}
            style={{
              color: 'var(--ppx-accent, #6750A4)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              alignSelf: 'flex-start',
            }}
          >
            {linkLabel} →
          </a>
        )}
      </div>
    </div>
  );
}

export const fields: Fields<CardProps> = {
  image: AssetPicker,
  title: { type: 'text' },
  body: { type: 'textarea' },
  linkHref: LinkPicker,
  linkLabel: { type: 'text' },
};

export const defaultProps: CardProps = {
  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
  title: 'Modern Architecture',
  body: 'Built with local-first persistence, ensuring complete privacy and fast offline load times.',
  linkHref: '#',
  linkLabel: 'Learn more',
};
