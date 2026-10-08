import { Fields } from '@measured/puck';

export interface QuoteProps {
  text: string;
  author: string;
  variant: 'primary' | 'muted' | 'accent';
}

export default function Quote({ text, author, variant }: QuoteProps) {
  const borderColors = {
    primary: 'var(--ppx-fg, #1a1a1a)',
    muted: 'var(--ppx-border, #e5e0d8)',
    accent: 'var(--ppx-accent, #6750A4)',
  };

  return (
    <blockquote
      style={{
        borderLeft: `4px solid ${borderColors[variant] || borderColors.accent}`,
        margin: '24px 0',
        padding: '16px 24px',
        backgroundColor: 'color-mix(in srgb, var(--ppx-fg, #000) 3%, var(--ppx-bg, #fff))',
        borderRadius: '0 var(--ppx-radius, 8px) var(--ppx-radius, 8px) 0',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--ppx-font-heading, inherit)',
          fontSize: '1.25rem',
          fontStyle: 'italic',
          lineHeight: 1.6,
          margin: '0 0 8px 0',
          color: 'var(--ppx-fg, #1a1a1a)',
        }}
      >
        "{text}"
      </p>
      {author && (
        <cite
          style={{
            display: 'block',
            fontFamily: 'var(--ppx-font-body, inherit)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--ppx-muted, #6b6b6b)',
            fontStyle: 'normal',
          }}
        >
          — {author}
        </cite>
      )}
    </blockquote>
  );
}

export const fields: Fields<QuoteProps> = {
  text: { type: 'textarea' },
  author: { type: 'text' },
  variant: {
    type: 'select',
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Muted', value: 'muted' },
      { label: 'Accent', value: 'accent' },
    ],
  },
};

export const defaultProps: QuoteProps = {
  text: 'Simplicity is about subtracting the obvious and adding the meaningful.',
  author: 'John Maeda',
  variant: 'accent',
};
