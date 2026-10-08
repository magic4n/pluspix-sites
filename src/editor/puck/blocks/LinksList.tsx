import { Fields } from '@measured/puck';
import { LinkPicker } from '../fields/LinkPicker';
import { IconPicker } from '../fields/IconPicker';
import { ICONS } from '../fields/icons';

export interface LinksListItem {
  label: string;
  href: string;
  icon?: string;
}

export interface LinksListProps {
  items: LinksListItem[];
}

export default function LinksList({ items }: LinksListProps) {
  const list = Array.isArray(items) ? items : [];

  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {list.map((item, idx) => {
        const iconDef = item.icon ? ICONS[item.icon] : null;

        return (
          <li key={idx}>
            <a
              href={item.href || '#'}
              style={{
                fontFamily: 'var(--ppx-font-body, inherit)',
                fontSize: '1rem',
                color: 'var(--ppx-accent, #6750A4)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 500,
              }}
            >
              {iconDef && iconDef.svg({ width: 18, height: 18 })}
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export const fields: Fields<LinksListProps> = {
  items: {
    type: 'array',
    arrayFields: {
      label: { type: 'text' },
      href: LinkPicker,
      icon: IconPicker,
    },
    getItemSummary: (item) => item.label || 'Link',
  },
};

export const defaultProps: LinksListProps = {
  items: [
    { label: 'Documentation', href: '#', icon: 'code' },
    { label: 'GitHub Repository', href: '#', icon: 'star' },
    { label: 'Community Forum', href: '#', icon: 'globe' },
  ],
};
