import { Fields, DropZone } from '@measured/puck';

export interface SectionProps {
  padding: 'sm' | 'md' | 'lg' | 'xl';
  variant: 'default' | 'muted' | 'accent';
}

export default function Section({ padding, variant }: SectionProps) {
  const paddingMap = {
    sm: '24px 16px',
    md: '48px 24px',
    lg: '80px 24px',
    xl: '120px 24px',
  };

  const bgStyles: Record<string, { bg: string; fg: string }> = {
    default: { bg: 'var(--ppx-bg, #ffffff)', fg: 'var(--ppx-fg, #1a1a1a)' },
    muted: { bg: 'color-mix(in srgb, var(--ppx-fg, #000) 5%, var(--ppx-bg, #fff))', fg: 'var(--ppx-fg, #1a1a1a)' },
    accent: { bg: 'var(--ppx-accent, #6750A4)', fg: '#ffffff' },
  };

  const currentBg = bgStyles[variant] || bgStyles.default;

  return (
    <section
      style={{
        padding: paddingMap[padding] || paddingMap.md,
        backgroundColor: currentBg.bg,
        color: currentBg.fg,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 1140, margin: '0 auto', width: '100%' }}>
        <DropZone zone="content" />
      </div>
    </section>
  );
}

export const fields: Fields<SectionProps> = {
  padding: {
    type: 'select',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
      { label: 'Extra Large', value: 'xl' },
    ],
  },
  variant: {
    type: 'select',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Muted', value: 'muted' },
      { label: 'Accent', value: 'accent' },
    ],
  },
};

export const defaultProps: SectionProps = {
  padding: 'md',
  variant: 'default',
};
