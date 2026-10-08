import { Fields } from '@measured/puck';
import { ICONS } from '../fields/icons';

export interface ContactInfoProps {
  address: string;
  email: string;
  phone: string;
  hours: string;
}

export default function ContactInfo({ address, email, phone, hours }: ContactInfoProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 24,
        padding: '28px 0',
        margin: '24px 0',
        borderTop: '1px solid var(--ppx-border, #e5e0d8)',
        borderBottom: '1px solid var(--ppx-border, #e5e0d8)',
      }}
    >
      {address && (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ color: 'var(--ppx-accent, #6750A4)', marginTop: 2 }}>
            {ICONS.mapPin.svg({ width: 20, height: 20 })}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ppx-fg, #1a1a1a)' }}>Address</div>
            <div style={{ color: 'var(--ppx-muted, #6b6b6b)', fontSize: '0.875rem', marginTop: 4 }}>{address}</div>
          </div>
        </div>
      )}

      {email && (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ color: 'var(--ppx-accent, #6750A4)', marginTop: 2 }}>
            {ICONS.mail.svg({ width: 20, height: 20 })}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ppx-fg, #1a1a1a)' }}>Email</div>
            <a
              href={`mailto:${email}`}
              style={{ color: 'var(--ppx-accent, #6750A4)', fontSize: '0.875rem', marginTop: 4, display: 'block', textDecoration: 'none' }}
            >
              {email}
            </a>
          </div>
        </div>
      )}

      {phone && (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ color: 'var(--ppx-accent, #6750A4)', marginTop: 2 }}>
            {ICONS.phone.svg({ width: 20, height: 20 })}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ppx-fg, #1a1a1a)' }}>Phone</div>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              style={{ color: 'var(--ppx-fg, #1a1a1a)', fontSize: '0.875rem', marginTop: 4, display: 'block', textDecoration: 'none' }}
            >
              {phone}
            </a>
          </div>
        </div>
      )}

      {hours && (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ color: 'var(--ppx-accent, #6750A4)', marginTop: 2 }}>
            {ICONS.star.svg({ width: 20, height: 20 })}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ppx-fg, #1a1a1a)' }}>Working Hours</div>
            <div style={{ color: 'var(--ppx-muted, #6b6b6b)', fontSize: '0.875rem', marginTop: 4 }}>{hours}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export const fields: Fields<ContactInfoProps> = {
  address: { type: 'text' },
  email: { type: 'text' },
  phone: { type: 'text' },
  hours: { type: 'text' },
};

export const defaultProps: ContactInfoProps = {
  address: '100 Sunset Boulevard, Suite 400',
  email: 'hello@pluspix.local',
  phone: '+1 (555) 234-5678',
  hours: 'Mon - Fri: 9:00 - 18:00',
};
