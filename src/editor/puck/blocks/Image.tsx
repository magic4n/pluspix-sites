import { Fields } from '@measured/puck';
import { AssetPicker } from '../fields/AssetPicker';

export interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  rounded: boolean;
  width: 'auto' | 'sm' | 'md' | 'lg' | 'full';
}

export default function ImageBlock({ src, alt, caption, rounded, width }: ImageProps) {
  const widthMap = {
    auto: 'auto',
    sm: '320px',
    md: '540px',
    lg: '768px',
    full: '100%',
  };

  return (
    <figure style={{ margin: '20px 0', textAlign: 'center', width: '100%' }}>
      <img
        src={src || 'https://via.placeholder.com/600x400'}
        alt={alt || 'Image'}
        style={{
          width: widthMap[width] || '100%',
          maxWidth: '100%',
          height: 'auto',
          borderRadius: rounded ? 'var(--ppx-radius, 8px)' : 0,
          display: 'inline-block',
        }}
      />
      {caption && (
        <figcaption
          style={{
            fontFamily: 'var(--ppx-font-body, inherit)',
            fontSize: '0.85rem',
            color: 'var(--ppx-muted, #6b6b6b)',
            marginTop: 8,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const fields: Fields<ImageProps> = {
  src: AssetPicker,
  alt: { type: 'text' },
  caption: { type: 'text' },
  rounded: {
    type: 'radio',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
  width: {
    type: 'select',
    options: [
      { label: 'Auto', value: 'auto' },
      { label: 'Small (320px)', value: 'sm' },
      { label: 'Medium (540px)', value: 'md' },
      { label: 'Large (768px)', value: 'lg' },
      { label: 'Full Width', value: 'full' },
    ],
  },
};

export const defaultProps: ImageProps = {
  src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  alt: 'Scenic coastline',
  caption: 'Calm ocean waters under a clear blue sky.',
  rounded: true,
  width: 'full',
};
