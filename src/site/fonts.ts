export interface FontPair {
  id: string;
  name: string;
  heading: string;
  body: string;
  mono: string;
  googleFamilies: string[];
}

export const FONT_PAIRS: FontPair[] = [
  {
    id: 'inter-playfair',
    name: 'Inter + Playfair Display',
    heading: 'Playfair Display',
    body: 'Inter',
    mono: 'JetBrains Mono',
    googleFamilies: ['Playfair+Display:ital,wght@0,600;0,800;1,400', 'Inter:wght@400;500;600', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'inter-merriweather',
    name: 'Inter + Merriweather',
    heading: 'Merriweather',
    body: 'Inter',
    mono: 'JetBrains Mono',
    googleFamilies: ['Merriweather:wght@400;700;900', 'Inter:wght@400;500;600', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'roboto-roboto-slab',
    name: 'Roboto + Roboto Slab',
    heading: 'Roboto Slab',
    body: 'Roboto',
    mono: 'Roboto Mono',
    googleFamilies: ['Roboto+Slab:wght@600;700;800', 'Roboto:wght@400;500', 'Roboto+Mono:wght@400'],
  },
  {
    id: 'open-sans-lora',
    name: 'Open Sans + Lora',
    heading: 'Lora',
    body: 'Open Sans',
    mono: 'JetBrains Mono',
    googleFamilies: ['Lora:ital,wght@0,600;0,700;1,400', 'Open+Sans:wght@400;500;600', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'montserrat-merriweather',
    name: 'Montserrat + Merriweather',
    heading: 'Montserrat',
    body: 'Merriweather',
    mono: 'JetBrains Mono',
    googleFamilies: ['Montserrat:wght@700;800', 'Merriweather:wght@300;400', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'dm-sans-dm-serif',
    name: 'DM Sans + DM Serif Display',
    heading: 'DM Serif Display',
    body: 'DM Sans',
    mono: 'JetBrains Mono',
    googleFamilies: ['DM+Serif+Display:wght@400', 'DM+Sans:wght@400;500;700', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'plus-jakarta-newsreader',
    name: 'Plus Jakarta Sans + Newsreader',
    heading: 'Newsreader',
    body: 'Plus Jakarta Sans',
    mono: 'JetBrains Mono',
    googleFamilies: ['Newsreader:ital,opsz,wght@0,6..72,600;0,6..72,800;1,6..72,400', 'Plus+Jakarta+Sans:wght@400;500;600', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'space-grotesk-space-mono',
    name: 'Space Grotesk + Space Mono',
    heading: 'Space Grotesk',
    body: 'Space Grotesk',
    mono: 'Space Mono',
    googleFamilies: ['Space+Grotesk:wght@500;700', 'Space+Mono:wght@400;700'],
  },
  {
    id: 'manrope-fraunces',
    name: 'Manrope + Fraunces',
    heading: 'Fraunces',
    body: 'Manrope',
    mono: 'JetBrains Mono',
    googleFamilies: ['Fraunces:opsz,wght@9..144,700;9..144,900', 'Manrope:wght@400;500;600', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'outfit-young-serif',
    name: 'Outfit + Young Serif',
    heading: 'Young Serif',
    body: 'Outfit',
    mono: 'JetBrains Mono',
    googleFamilies: ['Young+Serif:wght@400', 'Outfit:wght@400;500;600', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'poppins-pt-serif',
    name: 'Poppins + PT Serif',
    heading: 'Poppins',
    body: 'PT Serif',
    mono: 'JetBrains Mono',
    googleFamilies: ['Poppins:wght@600;700;800', 'PT+Serif:wght@400;700', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'work-sans-bitter',
    name: 'Work Sans + Bitter',
    heading: 'Bitter',
    body: 'Work Sans',
    mono: 'JetBrains Mono',
    googleFamilies: ['Bitter:wght@600;700;800', 'Work+Sans:wght@400;500', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'raleway-cormorant',
    name: 'Raleway + Cormorant Garamond',
    heading: 'Cormorant Garamond',
    body: 'Raleway',
    mono: 'JetBrains Mono',
    googleFamilies: ['Cormorant+Garamond:wght@600;700', 'Raleway:wght@400;500', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'figtree-literata',
    name: 'Figtree + Literata',
    heading: 'Literata',
    body: 'Figtree',
    mono: 'JetBrains Mono',
    googleFamilies: ['Literata:opsz,wght@7..72,600;7..72,800', 'Figtree:wght@400;500;600', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'rubik-lora',
    name: 'Rubik + Lora',
    heading: 'Rubik',
    body: 'Lora',
    mono: 'JetBrains Mono',
    googleFamilies: ['Rubik:wght@600;700;800', 'Lora:ital,wght@0,400;0,500;1,400', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'syne-inter',
    name: 'Syne + Inter',
    heading: 'Syne',
    body: 'Inter',
    mono: 'JetBrains Mono',
    googleFamilies: ['Syne:wght@700;800', 'Inter:wght@400;500', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'epilogue-space-mono',
    name: 'Epilogue + Space Mono',
    heading: 'Epilogue',
    body: 'Epilogue',
    mono: 'Space Mono',
    googleFamilies: ['Epilogue:wght@600;700;800', 'Space+Mono:wght@400'],
  },
  {
    id: 'alegreya-alegreya-sans',
    name: 'Alegreya + Alegreya Sans',
    heading: 'Alegreya',
    body: 'Alegreya Sans',
    mono: 'JetBrains Mono',
    googleFamilies: ['Alegreya:wght@700;800', 'Alegreya+Sans:wght@400;500', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'quicksand-playfair',
    name: 'Quicksand + Playfair Display',
    heading: 'Playfair Display',
    body: 'Quicksand',
    mono: 'JetBrains Mono',
    googleFamilies: ['Playfair+Display:wght@700;800', 'Quicksand:wght@500;600', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'sora-crimson-pro',
    name: 'Sora + Crimson Pro',
    heading: 'Crimson Pro',
    body: 'Sora',
    mono: 'JetBrains Mono',
    googleFamilies: ['Crimson+Pro:wght@600;800', 'Sora:wght@400;500', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'cinzel-fauna-one',
    name: 'Cinzel + Fauna One',
    heading: 'Cinzel',
    body: 'Fauna One',
    mono: 'JetBrains Mono',
    googleFamilies: ['Cinzel:wght@700;800', 'Fauna+One:wght@400', 'JetBrains+Mono:wght@400'],
  },
  {
    id: 'jetbrains-mono-system',
    name: 'JetBrains Mono + System Sans',
    heading: 'JetBrains Mono',
    body: 'system-ui, sans-serif',
    mono: 'JetBrains Mono',
    googleFamilies: ['JetBrains+Mono:wght@400;700'],
  },
];

export const DEFAULT_FONT_PAIR_ID = 'inter-playfair';

export function getFontPair(id: string): FontPair {
  return FONT_PAIRS.find((f) => f.id === id) || FONT_PAIRS[0];
}
