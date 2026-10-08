export interface SiteThemeDefinition {
  id: string;
  label: string;
  vars: Record<string, string>;
  css?: string;
}
