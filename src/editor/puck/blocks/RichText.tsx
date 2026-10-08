import { Fields } from '@measured/puck';

export interface RichTextProps {
  content: string;
}

export default function RichText({ content }: RichTextProps) {
  // Safe paragraph splitting and rendering without unsafe dangerouslySetInnerHTML
  const paragraphs = (content || '').split('\n').filter((p) => p.trim().length > 0);

  return (
    <div
      style={{
        fontFamily: 'var(--ppx-font-body, inherit)',
        color: 'var(--ppx-fg, #1a1a1a)',
        fontSize: '1rem',
        lineHeight: 1.7,
        margin: '12px 0',
      }}
    >
      {paragraphs.map((p, index) => (
        <p key={index} style={{ margin: '0 0 16px 0' }}>
          {p}
        </p>
      ))}
    </div>
  );
}

export const fields: Fields<RichTextProps> = {
  content: { type: 'textarea' },
};

export const defaultProps: RichTextProps = {
  content:
    'PlusPix lets you create fast, lightweight static websites directly inside your web browser. No accounts or databases required — your data stays right on your device.',
};
