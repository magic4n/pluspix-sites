import { Fields } from '@measured/puck';
import { LinkPicker } from '../fields/LinkPicker';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  copyright: string;
  links: FooterLink[];
}

export default function Footer({ copyright, links }: FooterProps) {
  const linkList = Array.isArray(links) ? links : [];

  return (
    <footer
      style={{
        borderTop: '1px solid var(--ppx-border, #e5e0d8)',
        backgroundColor: 'var(--ppx-bg, #ffffff)',
        padding: '36px 24px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--ppx-font-body, inherit)',
            fontSize: '0.875rem',
            color: 'var(--ppx-muted, #6b6b6b)',
          }}
        >
          {copyright || `© ${new Date().getFullYear()} All rights reserved.`}
        </span>

        <nav style={{ display: 'flex', gap: 20 }}>
          {linkList.map((link, idx) => (
            <a
              key={idx}
              href={link.href || '#'}
              style={{
                fontFamily: 'var(--ppx-font-body, inherit)',
                fontSize: '0.875rem',
                color: 'var(--ppx-muted, #6b6b6b)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export const fields: Fields<FooterProps> = {
  copyright: { type: 'text' },
  links: {
    type: 'array',
    arrayFields: {
      label: { type: 'text' },
      href: LinkPicker,
    },
    getItemSummary: (item) => item.label || 'Footer Link',
  },
};

export const defaultProps: FooterProps = {
  copyright: '© 2026 PlusPix. Built with privacy in mind.',
  links: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};
