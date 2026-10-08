import { Fields, DropZone } from '@measured/puck';

export interface ColumnsProps {
  count: 2 | 3 | 4;
  gap: 'sm' | 'md' | 'lg';
}

export default function Columns({ count, gap }: ColumnsProps) {
  const gapMap = {
    sm: '16px',
    md: '24px',
    lg: '40px',
  };

  const colArray = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        gap: gapMap[gap] || gapMap.md,
        width: '100%',
        boxSizing: 'border-box',
        margin: '16px 0',
      }}
    >
      {colArray.map((num) => (
        <div key={num} style={{ minWidth: 0 }}>
          <DropZone zone={`column-${num}`} />
        </div>
      ))}
    </div>
  );
}

export const fields: Fields<ColumnsProps> = {
  count: {
    type: 'select',
    options: [
      { label: '2 Columns', value: 2 },
      { label: '3 Columns', value: 3 },
      { label: '4 Columns', value: 4 },
    ],
  },
  gap: {
    type: 'select',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ],
  },
};

export const defaultProps: ColumnsProps = {
  count: 2,
  gap: 'md',
};
