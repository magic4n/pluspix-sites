import { Config, Fields } from '@measured/puck';
import type { TFunction } from 'i18next';

// Layout Blocks
import Section, { fields as sectionFields, defaultProps as sectionDefaults, SectionProps } from './blocks/Section';
import Columns, { fields as columnsFields, defaultProps as columnsDefaults, ColumnsProps } from './blocks/Columns';
import Divider, { fields as dividerFields, defaultProps as dividerDefaults, DividerProps } from './blocks/Divider';
import Spacer, { fields as spacerFields, defaultProps as spacerDefaults, SpacerProps } from './blocks/Spacer';

// Content Blocks
import Hero, { fields as heroFields, defaultProps as heroDefaults, HeroProps } from './blocks/Hero';
import Heading, { fields as headingFields, defaultProps as headingDefaults, HeadingProps } from './blocks/Heading';
import RichText, { fields as richTextFields, defaultProps as richTextDefaults, RichTextProps } from './blocks/RichText';
import Quote, { fields as quoteFields, defaultProps as quoteDefaults, QuoteProps } from './blocks/Quote';
import Card, { fields as cardFields, defaultProps as cardDefaults, CardProps } from './blocks/Card';
import FAQ, { fields as faqFields, defaultProps as faqDefaults, FAQProps } from './blocks/FAQ';

// Media Blocks
import ImageBlock, { fields as imageFields, defaultProps as imageDefaults, ImageProps } from './blocks/Image';
import Gallery, { fields as galleryFields, defaultProps as galleryDefaults, GalleryProps } from './blocks/Gallery';
import VideoEmbed, { fields as videoEmbedFields, defaultProps as videoEmbedDefaults, VideoEmbedProps } from './blocks/VideoEmbed';
import MapEmbed, { fields as mapEmbedFields, defaultProps as mapEmbedDefaults, MapEmbedProps } from './blocks/MapEmbed';
import CodeBlock, { fields as codeBlockFields, defaultProps as codeBlockDefaults, CodeBlockProps } from './blocks/CodeBlock';

// Navigation Blocks
import Navbar, { fields as navbarFields, defaultProps as navbarDefaults, NavbarProps } from './blocks/Navbar';
import Footer, { fields as footerFields, defaultProps as footerDefaults, FooterProps } from './blocks/Footer';
import LinksList, { fields as linksListFields, defaultProps as linksListDefaults, LinksListProps } from './blocks/LinksList';
import ButtonBlock, { fields as buttonFields, defaultProps as buttonDefaults, ButtonProps } from './blocks/Button';

// Data Blocks
import Stats, { fields as statsFields, defaultProps as statsDefaults, StatsProps } from './blocks/Stats';
import FeatureGrid, { fields as featureGridFields, defaultProps as featureGridDefaults, FeatureGridProps } from './blocks/FeatureGrid';
import Testimonial, { fields as testimonialFields, defaultProps as testimonialDefaults, TestimonialProps } from './blocks/Testimonial';
import ContactInfo, { fields as contactInfoFields, defaultProps as contactInfoDefaults, ContactInfoProps } from './blocks/ContactInfo';

export interface BlockPropsMap {
  // Layout
  Section: SectionProps;
  Columns: ColumnsProps;
  Divider: DividerProps;
  Spacer: SpacerProps;

  // Content
  Hero: HeroProps;
  Heading: HeadingProps;
  RichText: RichTextProps;
  Quote: QuoteProps;
  Card: CardProps;
  FAQ: FAQProps;

  // Media
  Image: ImageProps;
  Gallery: GalleryProps;
  VideoEmbed: VideoEmbedProps;
  MapEmbed: MapEmbedProps;
  CodeBlock: CodeBlockProps;

  // Navigation
  Navbar: NavbarProps;
  Footer: FooterProps;
  LinksList: LinksListProps;
  Button: ButtonProps;

  // Data
  Stats: StatsProps;
  FeatureGrid: FeatureGridProps;
  Testimonial: TestimonialProps;
  ContactInfo: ContactInfoProps;
}

export type RootProps = Record<string, never>;

function localizeFields(fields: Fields<any>, t?: TFunction | any): Fields<any> {
  if (!t) return fields;
  const result: any = {};
  for (const [key, field] of Object.entries(fields)) {
    if (!field) continue;
    const fallback = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    const label = t(`puck.fields.${key}`, fallback);

    if (field.type === 'select' || field.type === 'radio') {
      const options = field.options?.map((opt: any) => {
        const optVal = String(opt.value);
        const optLabel = t(`puck.options.${optVal}`, opt.label || optVal);
        return {
          ...opt,
          label: optLabel,
        };
      });
      result[key] = {
        ...field,
        label,
        options,
      };
    } else if (field.type === 'array' && (field as any).arrayFields) {
      result[key] = {
        ...field,
        label,
        arrayFields: localizeFields((field as any).arrayFields, t),
      };
    } else if (field.type === 'object' && (field as any).objectFields) {
      result[key] = {
        ...field,
        label,
        objectFields: localizeFields((field as any).objectFields, t),
      };
    } else {
      result[key] = {
        ...field,
        label,
      };
    }
  }
  return result;
}

export function getPuckConfig(t?: TFunction | any): Config<BlockPropsMap, RootProps> {
  const getLabel = (blockName: string) => (t ? t(`puck.blocks.${blockName}`, blockName) : blockName);

  return {
    categories: {
      [t ? t('puck.categories.layout', 'Layout') : 'Layout']: {
        components: ['Section', 'Columns', 'Divider', 'Spacer'],
      },
      [t ? t('puck.categories.content', 'Content') : 'Content']: {
        components: ['Hero', 'Heading', 'RichText', 'Quote', 'Card', 'FAQ'],
      },
      [t ? t('puck.categories.media', 'Media') : 'Media']: {
        components: ['Image', 'Gallery', 'VideoEmbed', 'MapEmbed', 'CodeBlock'],
      },
      [t ? t('puck.categories.navigation', 'Navigation') : 'Navigation']: {
        components: ['Navbar', 'Footer', 'LinksList', 'Button'],
      },
      [t ? t('puck.categories.data', 'Data') : 'Data']: {
        components: ['Stats', 'FeatureGrid', 'Testimonial', 'ContactInfo'],
      },
    },
    components: {
      // Layout
      Section: {
        label: getLabel('Section'),
        render: Section,
        fields: localizeFields(sectionFields, t),
        defaultProps: sectionDefaults,
      },
      Columns: {
        label: getLabel('Columns'),
        render: Columns,
        fields: localizeFields(columnsFields, t),
        defaultProps: columnsDefaults,
      },
      Divider: {
        label: getLabel('Divider'),
        render: Divider,
        fields: localizeFields(dividerFields, t),
        defaultProps: dividerDefaults,
      },
      Spacer: {
        label: getLabel('Spacer'),
        render: Spacer,
        fields: localizeFields(spacerFields, t),
        defaultProps: spacerDefaults,
      },

      // Content
      Hero: {
        label: getLabel('Hero'),
        render: Hero,
        fields: localizeFields(heroFields, t),
        defaultProps: heroDefaults,
      },
      Heading: {
        label: getLabel('Heading'),
        render: Heading,
        fields: localizeFields(headingFields, t),
        defaultProps: headingDefaults,
      },
      RichText: {
        label: getLabel('RichText'),
        render: RichText,
        fields: localizeFields(richTextFields, t),
        defaultProps: richTextDefaults,
      },
      Quote: {
        label: getLabel('Quote'),
        render: Quote,
        fields: localizeFields(quoteFields, t),
        defaultProps: quoteDefaults,
      },
      Card: {
        label: getLabel('Card'),
        render: Card,
        fields: localizeFields(cardFields, t),
        defaultProps: cardDefaults,
      },
      FAQ: {
        label: getLabel('FAQ'),
        render: FAQ,
        fields: localizeFields(faqFields, t),
        defaultProps: faqDefaults,
      },

      // Media
      Image: {
        label: getLabel('Image'),
        render: ImageBlock,
        fields: localizeFields(imageFields, t),
        defaultProps: imageDefaults,
      },
      Gallery: {
        label: getLabel('Gallery'),
        render: Gallery,
        fields: localizeFields(galleryFields, t),
        defaultProps: galleryDefaults,
      },
      VideoEmbed: {
        label: getLabel('VideoEmbed'),
        render: VideoEmbed,
        fields: localizeFields(videoEmbedFields, t),
        defaultProps: videoEmbedDefaults,
      },
      MapEmbed: {
        label: getLabel('MapEmbed'),
        render: MapEmbed,
        fields: localizeFields(mapEmbedFields, t),
        defaultProps: mapEmbedDefaults,
      },
      CodeBlock: {
        label: getLabel('CodeBlock'),
        render: CodeBlock,
        fields: localizeFields(codeBlockFields, t),
        defaultProps: codeBlockDefaults,
      },

      // Navigation
      Navbar: {
        label: getLabel('Navbar'),
        render: Navbar,
        fields: localizeFields(navbarFields, t),
        defaultProps: navbarDefaults,
      },
      Footer: {
        label: getLabel('Footer'),
        render: Footer,
        fields: localizeFields(footerFields, t),
        defaultProps: footerDefaults,
      },
      LinksList: {
        label: getLabel('LinksList'),
        render: LinksList,
        fields: localizeFields(linksListFields, t),
        defaultProps: linksListDefaults,
      },
      Button: {
        label: getLabel('Button'),
        render: ButtonBlock,
        fields: localizeFields(buttonFields, t),
        defaultProps: buttonDefaults,
      },

      // Data
      Stats: {
        label: getLabel('Stats'),
        render: Stats,
        fields: localizeFields(statsFields, t),
        defaultProps: statsDefaults,
      },
      FeatureGrid: {
        label: getLabel('FeatureGrid'),
        render: FeatureGrid,
        fields: localizeFields(featureGridFields, t),
        defaultProps: featureGridDefaults,
      },
      Testimonial: {
        label: getLabel('Testimonial'),
        render: Testimonial,
        fields: localizeFields(testimonialFields, t),
        defaultProps: testimonialDefaults,
      },
      ContactInfo: {
        label: getLabel('ContactInfo'),
        render: ContactInfo,
        fields: localizeFields(contactInfoFields, t),
        defaultProps: contactInfoDefaults,
      },
    },
  };
}

export const config: Config<BlockPropsMap, RootProps> = getPuckConfig();

