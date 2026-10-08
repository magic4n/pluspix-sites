import { Fields } from '@measured/puck';

export interface StatItem {
  number: string;
  label: string;
}

export interface StatsProps {
  items: StatItem[];
}

export default function Stats({ items }: StatsProps) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 24,
        margin: '36px 0',
        padding: '24px 0',
        borderTop: '1px solid var(--ppx-border, #e5e0d8)',
        borderBottom: '1px solid var(--ppx-border, #e5e0d8)',
      }}
    >
      {list.map((item, idx) => (
        <div key={idx} style={{ textAlign: 'center', minWidth: 120 }}>
          <div
            style={{
              fontFamily: 'var(--ppx-font-heading, inherit)',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--ppx-accent, #6750A4)',
              lineHeight: 1.1,
            }}
          >
            {item.number}
          </div>
          <div
            style={{
              fontFamily: 'var(--ppx-font-body, inherit)',
              fontSize: '0.9rem',
              color: 'var(--ppx-muted, #6b6b6b)',
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export const fields: Fields<StatsProps> = {
  items: {
    type: 'array',
    arrayFields: {
      number: { type: 'text', label: 'Number or Metric' },
      label: { type: 'text', label: 'Description Label' },
    },
    getItemSummary: (item) => `${item.number}: ${item.label}`,
  },
};

export const defaultProps: StatsProps = {
  items: [
    { number: '100%', label: 'Client-Side' },
    { number: '0 ms', label: 'Server Latency' },
    { number: '23', label: 'Built-in Blocks' },
    { number: 'Offline', label: 'Ready Out-of-the-Box' },
  ],
};
