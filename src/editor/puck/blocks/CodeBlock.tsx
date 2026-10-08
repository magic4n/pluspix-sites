import { Fields } from '@measured/puck';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLanguageLabel: boolean;
}

export default function CodeBlock({ code, language, showLanguageLabel }: CodeBlockProps) {
  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        borderRadius: 'var(--ppx-radius, 8px)',
        overflow: 'hidden',
        margin: '20px 0',
        fontFamily: 'var(--ppx-font-mono, monospace)',
        fontSize: '0.9rem',
      }}
    >
      {showLanguageLabel && language && (
        <div
          style={{
            backgroundColor: '#2d2d2d',
            padding: '6px 16px',
            fontSize: '0.75rem',
            color: '#888888',
            borderBottom: '1px solid #333333',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {language}
        </div>
      )}
      <pre style={{ margin: 0, padding: 16, overflowX: 'auto', lineHeight: 1.5 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export const fields: Fields<CodeBlockProps> = {
  code: { type: 'textarea' },
  language: { type: 'text' },
  showLanguageLabel: {
    type: 'radio',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
};

export const defaultProps: CodeBlockProps = {
  code: `// PlusPix - Client-Side Site Builder\nconst config = {\n  backend: false,\n  offlineReady: true,\n};`,
  language: 'typescript',
  showLanguageLabel: true,
};
