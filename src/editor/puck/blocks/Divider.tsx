import { Fields } from '@measured/puck';

export interface DividerProps {
  spacing: 'sm' | 'md' | 'lg';
  variant: 'solid' | 'dashed' | 'dotted';
}

export default function Divider({ spacing, variant }: DividerProps) {
  const marginMap = {
    sm: '16px 0',
    md: '32px 0',
    lg: '64px 0',
  };

  return (
    <hr
      style={{
        border: 'none',
        borderTop: `1px ${variant} var(--ppx-border, #e5e0d8)`,
        margin: marginMap[spacing] || marginMap.md,
        width: '100%',
        boxSizing: 'border-box',
      }}
    />
  );
}

export const fields: Fields<DividerProps> = {
  spacing: {
    type: 'select',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ],
  },
  variant: {
    type: 'select',
    options: [
      { label: 'Solid', value: 'solid' },
      { label: 'Dashed', value: 'dashed' },
      { label: 'Dotted', value: 'dotted' },
    ],
  },
};

export const defaultProps: DividerProps = {
  spacing: 'md',
  variant: 'solid',
};
