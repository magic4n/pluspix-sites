import { Fields } from '@measured/puck';
import { useProjectContext } from '../context';
import { AssetPicker } from '../fields/AssetPicker';

export interface NavbarProps {
  logoText: string;
  logoImage?: string;
  sticky: boolean;
}

export default function Navbar({ logoText, logoImage, sticky }: NavbarProps) {
  const { rootPages, activePageId } = useProjectContext();

  return (
    <header
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--ppx-bg, #ffffff)',
        borderBottom: '1px solid var(--ppx-border, #e5e0d8)',
        padding: '0 24px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {logoImage && (
            <img
              src={logoImage}
              alt={logoText || 'Logo'}
              style={{ height: 32, width: 'auto', objectFit: 'contain' }}
            />
          )}
          <span
            style={{
              fontFamily: 'var(--ppx-font-heading, inherit)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--ppx-fg, #1a1a1a)',
            }}
          >
            {logoText || 'My Brand'}
          </span>
        </div>

        {/* Navigation links automatically populated from root pages */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {rootPages.map((page) => {
            const isActive = activePageId === page.id;
            const href = page.slug === 'index' ? '/' : `/${page.slug}`;

            return (
              <a
                key={page.id}
                href={href}
                style={{
                  fontFamily: 'var(--ppx-font-body, inherit)',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive
                    ? 'var(--ppx-accent, #6750A4)'
                    : 'var(--ppx-fg, #1a1a1a)',
                  textDecoration: 'none',
                  borderBottom: isActive
                    ? '2px solid var(--ppx-accent, #6750A4)'
                    : '2px solid transparent',
                  padding: '6px 0',
                }}
              >
                {page.title}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export const fields: Fields<NavbarProps> = {
  logoText: { type: 'text' },
  logoImage: AssetPicker,
  sticky: {
    type: 'radio',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
};

export const defaultProps: NavbarProps = {
  logoText: 'PlusPix',
  sticky: true,
};
