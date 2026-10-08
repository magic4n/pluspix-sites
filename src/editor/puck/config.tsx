import { Config } from '@measured/puck';

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

export const config: Config<BlockPropsMap, RootProps> = {
  categories: {
    Layout: {
      components: ['Section', 'Columns', 'Divider', 'Spacer'],
    },
    Content: {
      components: ['Hero', 'Heading', 'RichText', 'Quote', 'Card', 'FAQ'],
    },
    Media: {
      components: ['Image', 'Gallery', 'VideoEmbed', 'MapEmbed', 'CodeBlock'],
    },
    Navigation: {
      components: ['Navbar', 'Footer', 'LinksList', 'Button'],
    },
    Data: {
      components: ['Stats', 'FeatureGrid', 'Testimonial', 'ContactInfo'],
    },
  },
  components: {
    // Layout
    Section: {
      render: Section,
      fields: sectionFields,
      defaultProps: sectionDefaults,
    },
    Columns: {
      render: Columns,
      fields: columnsFields,
      defaultProps: columnsDefaults,
    },
    Divider: {
      render: Divider,
      fields: dividerFields,
      defaultProps: dividerDefaults,
    },
    Spacer: {
      render: Spacer,
      fields: spacerFields,
      defaultProps: spacerDefaults,
    },

    // Content
    Hero: {
      render: Hero,
      fields: heroFields,
      defaultProps: heroDefaults,
    },
    Heading: {
      render: Heading,
      fields: headingFields,
      defaultProps: headingDefaults,
    },
    RichText: {
      render: RichText,
      fields: richTextFields,
      defaultProps: richTextDefaults,
    },
    Quote: {
      render: Quote,
      fields: quoteFields,
      defaultProps: quoteDefaults,
    },
    Card: {
      render: Card,
      fields: cardFields,
      defaultProps: cardDefaults,
    },
    FAQ: {
      render: FAQ,
      fields: faqFields,
      defaultProps: faqDefaults,
    },

    // Media
    Image: {
      render: ImageBlock,
      fields: imageFields,
      defaultProps: imageDefaults,
    },
    Gallery: {
      render: Gallery,
      fields: galleryFields,
      defaultProps: galleryDefaults,
    },
    VideoEmbed: {
      render: VideoEmbed,
      fields: videoEmbedFields,
      defaultProps: videoEmbedDefaults,
    },
    MapEmbed: {
      render: MapEmbed,
      fields: mapEmbedFields,
      defaultProps: mapEmbedDefaults,
    },
    CodeBlock: {
      render: CodeBlock,
      fields: codeBlockFields,
      defaultProps: codeBlockDefaults,
    },

    // Navigation
    Navbar: {
      render: Navbar,
      fields: navbarFields,
      defaultProps: navbarDefaults,
    },
    Footer: {
      render: Footer,
      fields: footerFields,
      defaultProps: footerDefaults,
    },
    LinksList: {
      render: LinksList,
      fields: linksListFields,
      defaultProps: linksListDefaults,
    },
    Button: {
      render: ButtonBlock,
      fields: buttonFields,
      defaultProps: buttonDefaults,
    },

    // Data
    Stats: {
      render: Stats,
      fields: statsFields,
      defaultProps: statsDefaults,
    },
    FeatureGrid: {
      render: FeatureGrid,
      fields: featureGridFields,
      defaultProps: featureGridDefaults,
    },
    Testimonial: {
      render: Testimonial,
      fields: testimonialFields,
      defaultProps: testimonialDefaults,
    },
    ContactInfo: {
      render: ContactInfo,
      fields: contactInfoFields,
      defaultProps: contactInfoDefaults,
    },
  },
};
