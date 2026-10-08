import { Fields } from '@measured/puck';
import { IconPicker } from '../fields/IconPicker';
import { ICONS } from '../fields/icons';

export interface FeatureItem {
  icon: string;
  title: string;
  text: string;
}

export interface FeatureGridProps {
  items: FeatureItem[];
  columns: 2 | 3 | 4;
}

export default function FeatureGrid({ items, columns }: FeatureGridProps) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns || 3}, minmax(0, 1fr))`,
        gap: 32,
        margin: '32px 0',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {list.map((item, idx) => {
        const iconDef = ICONS[item.icon] || ICONS.check;

        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--ppx-radius, 8px)',
                backgroundColor: 'color-mix(in srgb, var(--ppx-accent, #6750A4) 15%, transparent)',
                color: 'var(--ppx-accent, #6750A4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              {iconDef.svg({ width: 22, height: 22 })}
            </div>
            <h4
              style={{
                fontFamily: 'var(--ppx-font-heading, inherit)',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--ppx-fg, #1a1a1a)',
                margin: '0 0 8px 0',
              }}
            >
              {item.title}
            </h4>
            <p
              style={{
                fontFamily: 'var(--ppx-font-body, inherit)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: 'var(--ppx-muted, #6b6b6b)',
                margin: 0,
              }}
            >
              {item.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export const fields: Fields<FeatureGridProps> = {
  columns: {
    type: 'select',
    options: [
      { label: '2 Columns', value: 2 },
      { label: '3 Columns', value: 3 },
      { label: '4 Columns', value: 4 },
    ],
  },
  items: {
    type: 'array',
    arrayFields: {
      icon: IconPicker,
      title: { type: 'text', label: 'Feature Title' },
      text: { type: 'textarea', label: 'Feature Description' },
    },
    getItemSummary: (item) => item.title || 'Feature',
  },
};

export const defaultProps: FeatureGridProps = {
  columns: 3,
  items: [
    {
      icon: 'globe',
      title: 'Local First',
      text: 'No cloud storage needed. Your projects are stored directly in your browser.',
    },
    {
      icon: 'code',
      title: 'Semantic HTML',
      text: 'Produces ultra clean, accessible static HTML without proprietary runtime tags.',
    },
    {
      icon: 'star',
      title: 'Zero Overhead',
      text: 'Exported websites open offline instantly by double-clicking index.html.',
    },
  ],
};
