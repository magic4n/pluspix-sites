import { Fields } from '@measured/puck';

export interface SpacerProps {
  height: number;
}

export default function Spacer({ height }: SpacerProps) {
  return <div style={{ height: `${height || 32}px`, width: '100%' }} />;
}

export const fields: Fields<SpacerProps> = {
  height: {
    type: 'select',
    options: [
      { label: '16px', value: 16 },
      { label: '32px', value: 32 },
      { label: '48px', value: 48 },
      { label: '64px', value: 64 },
      { label: '96px', value: 96 },
      { label: '128px', value: 128 },
    ],
  },
};

export const defaultProps: SpacerProps = {
  height: 32,
};
