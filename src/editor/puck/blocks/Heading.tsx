import { Fields } from '@measured/puck';

export interface HeadingProps {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  align: 'left' | 'center' | 'right';
}

export default function Heading({ level, text, size, align }: HeadingProps) {
  const Tag = (level || 'h2') as keyof JSX.IntrinsicElements;

  const sizeMap = {
    sm: '1.25rem',
    md: '1.75rem',
    lg: '2.5rem',
    xl: '3.25rem',
  };

  return (
    <Tag
      style={{
        fontFamily: 'var(--ppx-font-heading, inherit)',
        fontSize: sizeMap[size] || sizeMap.md,
        fontWeight: 700,
        textAlign: align || 'left',
        color: 'var(--ppx-fg, #1a1a1a)',
        margin: '16px 0 8px 0',
        lineHeight: 1.25,
      }}
    >
      {text}
    </Tag>
  );
}

export const fields: Fields<HeadingProps> = {
  text: { type: 'text' },
  level: {
    type: 'select',
    options: [
      { label: 'H1', value: 'h1' },
      { label: 'H2', value: 'h2' },
      { label: 'H3', value: 'h3' },
      { label: 'H4', value: 'h4' },
      { label: 'H5', value: 'h5' },
      { label: 'H6', value: 'h6' },
    ],
  },
  size: {
    type: 'select',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
      { label: 'Extra Large', value: 'xl' },
    ],
  },
  align: {
    type: 'select',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ],
  },
};

export const defaultProps: HeadingProps = {
  level: 'h2',
  text: 'Section Heading',
  size: 'lg',
  align: 'left',
};
