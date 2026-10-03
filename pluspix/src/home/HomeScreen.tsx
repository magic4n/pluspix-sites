import i18n from '../i18n';

/**
 * Home screen (M1): empty state with a friendly inline-SVG illustration and
 * a single CTA. The real project grid arrives in M2.
 */
export default function HomeScreen() {
  return (
    <section className="home-empty" aria-label={i18n.t('home.title')}>
      <svg
        className="empty-illustration"
        viewBox="0 0 240 160"
        width="240"
        height="160"
        role="img"
        aria-hidden="true"
      >
        <rect x="20" y="20" width="200" height="120" rx="12" fill="currentColor" opacity="0.08" />
        <rect x="36" y="36" width="168" height="20" rx="6" fill="currentColor" opacity="0.25" />
        <rect x="36" y="68" width="80" height="56" rx="8" fill="currentColor" opacity="0.18" />
        <rect x="128" y="68" width="76" height="12" rx="4" fill="currentColor" opacity="0.3" />
        <rect x="128" y="88" width="60" height="12" rx="4" fill="currentColor" opacity="0.2" />
        <rect x="128" y="108" width="44" height="16" rx="8" fill="var(--ppx-accent, #6750A4)" opacity="0.9" />
      </svg>
      <h2>{i18n.t('home.emptyTitle')}</h2>
      <p>{i18n.t('home.emptyText')}</p>
      {/* M2 will wire this to the create-project dialog. */}
      <button className="cta-button" type="button" disabled>
        + {i18n.t('home.newProject')}
      </button>
    </section>
  );
}
