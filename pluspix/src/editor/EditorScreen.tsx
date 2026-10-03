import i18n from '../i18n';

/**
 * Editor screen placeholder for M1. The three-column layout (page tree,
 * Puck canvas, field panel) is built in M3/M4.
 */
export default function EditorScreen() {
  return (
    <section className="editor-placeholder">
      <p>{i18n.t('editor.noPageSelected')}</p>
    </section>
  );
}
