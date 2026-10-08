import { Fields } from '@measured/puck';
import { AssetPicker } from '../fields/AssetPicker';

export interface GalleryItem {
  src: string;
  alt: string;
}

export interface GalleryProps {
  images: GalleryItem[];
  columns: 2 | 3 | 4;
  gap: 'sm' | 'md' | 'lg';
}

export default function Gallery({ images, columns, gap }: GalleryProps) {
  const gapMap = {
    sm: '12px',
    md: '20px',
    lg: '32px',
  };

  const list = Array.isArray(images) ? images : [];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns || 3}, minmax(0, 1fr))`,
        gap: gapMap[gap] || gapMap.md,
        margin: '24px 0',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {list.map((img, idx) => (
        <div
          key={idx}
          style={{
            borderRadius: 'var(--ppx-radius, 8px)',
            overflow: 'hidden',
            aspectRatio: '4 / 3',
            backgroundColor: 'action.hover',
          }}
        >
          <img
            src={img.src}
            alt={img.alt || `Gallery item ${idx + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      ))}
    </div>
  );
}

export const fields: Fields<GalleryProps> = {
  columns: {
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
  images: {
    type: 'array',
    arrayFields: {
      src: AssetPicker,
      alt: { type: 'text' },
    },
    getItemSummary: (item) => item.alt || item.src || 'Image',
  },
};

export const defaultProps: GalleryProps = {
  columns: 3,
  gap: 'md',
  images: [
    { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80', alt: 'Misty Mountains' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80', alt: 'Deep Forest' },
    { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80', alt: 'Calm River' },
  ],
};
