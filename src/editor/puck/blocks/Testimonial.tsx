import { Fields } from '@measured/puck';
import { AssetPicker } from '../fields/AssetPicker';

export interface TestimonialProps {
  quote: string;
  avatar?: string;
  name: string;
  role: string;
}

export default function Testimonial({ quote, avatar, name, role }: TestimonialProps) {
  return (
    <div
      style={{
        padding: '32px 28px',
        backgroundColor: 'var(--ppx-bg, #ffffff)',
        border: '1px solid var(--ppx-border, #e5e0d8)',
        borderRadius: 'var(--ppx-radius, 8px)',
        margin: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--ppx-font-body, inherit)',
          fontSize: '1.1rem',
          fontStyle: 'italic',
          lineHeight: 1.6,
          margin: '0 0 24px 0',
          color: 'var(--ppx-fg, #1a1a1a)',
        }}
      >
        "{quote}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {avatar && (
          <img
            src={avatar}
            alt={name}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        )}
        <div>
          <div
            style={{
              fontFamily: 'var(--ppx-font-heading, inherit)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--ppx-fg, #1a1a1a)',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: 'var(--ppx-font-body, inherit)',
              fontSize: '0.85rem',
              color: 'var(--ppx-muted, #6b6b6b)',
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

export const fields: Fields<TestimonialProps> = {
  quote: { type: 'textarea' },
  avatar: AssetPicker,
  name: { type: 'text' },
  role: { type: 'text' },
};

export const defaultProps: TestimonialProps = {
  quote:
    'PlusPix is hands down the cleanest website builder I have ever used. Being able to export a completely static ZIP offline in seconds is a game changer.',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  name: 'Elena Rostova',
  role: 'Creative Director at Studio Pulse',
};
