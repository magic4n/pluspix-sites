import { Fields } from '@measured/puck';

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div style={{ width: '100%', margin: '24px 0' }}>
      {list.map((item, idx) => (
        <details
          key={idx}
          style={{
            borderBottom: '1px solid var(--ppx-border, #e5e0d8)',
            padding: '16px 0',
            cursor: 'pointer',
          }}
        >
          <summary
            style={{
              fontFamily: 'var(--ppx-font-heading, inherit)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--ppx-fg, #1a1a1a)',
              listStyle: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {item.q}
            <span style={{ fontSize: '1.2rem', color: 'var(--ppx-muted, #6b6b6b)' }}>+</span>
          </summary>
          <p
            style={{
              fontFamily: 'var(--ppx-font-body, inherit)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'var(--ppx-muted, #6b6b6b)',
              margin: '12px 0 0 0',
            }}
          >
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

export const fields: Fields<FAQProps> = {
  items: {
    type: 'array',
    arrayFields: {
      q: { type: 'text', label: 'Question' },
      a: { type: 'textarea', label: 'Answer' },
    },
    getItemSummary: (item) => item.q || 'Question',
  },
};

export const defaultProps: FAQProps = {
  items: [
    {
      q: 'Does PlusPix require an internet connection?',
      a: 'No, PlusPix is 100% client-side and stores your sites directly in your browser using IndexedDB.',
    },
    {
      q: 'Can I export my site and host it anywhere?',
      a: 'Yes, you can export a full ZIP package with static HTML, CSS, and images that opens offline and can be hosted on GitHub Pages, Netlify, or any static host.',
    },
  ],
};
