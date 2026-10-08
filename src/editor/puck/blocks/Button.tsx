import { Fields } from '@measured/puck';
import { LinkPicker } from '../fields/LinkPicker';

export interface ButtonProps {
  label: string;
  href: string;
  variant: 'filled' | 'outline' | 'text';
  size: 'sm' | 'md' | 'lg';
  align: 'left' | 'center' | 'right';
}

export default function ButtonBlock({ label, href, variant, size, align }: ButtonProps) {
  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '0.85rem' },
    md: { padding: '12px 24px', fontSize: '1rem' },
    lg: { padding: '16px 36px', fontSize: '1.15rem' },
  };

  const variantStyles = {
    filled: {
      backgroundColor: 'var(--ppx-accent, #6750A4)',
      color: '#ffffff',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--ppx-accent, #6750A4)',
      border: '2px solid var(--ppx-accent, #6750A4)',
    },
    text: {
      backgroundColor: 'transparent',
      color: 'var(--ppx-accent, #6750A4)',
      border: 'none',
      paddingLeft: 0,
    },
  };

  const alignStyles = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: alignStyles[align] || 'flex-start',
        margin: '16px 0',
      }}
    >
      <a
        href={href || '#'}
        style={{
          display: 'inline-block',
          fontFamily: 'var(--ppx-font-body, inherit)',
          textDecoration: 'none',
          fontWeight: 600,
          borderRadius: 'var(--ppx-radius, 8px)',
          cursor: 'pointer',
          boxSizing: 'border-box',
          ...sizeStyles[size],
          ...variantStyles[variant],
        }}
      >
        {label}
      </a>
    </div>
  );
}

export const fields: Fields<ButtonProps> = {
  label: { type: 'text' },
  href: LinkPicker,
  variant: {
    type: 'select',
    options: [
      { label: 'Filled', value: 'filled' },
      { label: 'Outline', value: 'outline' },
      { label: 'Text', value: 'text' },
    ],
  },
  size: {
    type: 'select',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
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

export const defaultProps: ButtonProps = {
  label: 'Click Here',
  href: '#',
  variant: 'filled',
  size: 'md',
  align: 'left',
};
