import { Fields } from '@measured/puck';

export interface MapEmbedProps {
  lat: number;
  lng: number;
  zoom: number;
}

export default function MapEmbed({ lat, lng, zoom }: MapEmbedProps) {
  const latitude = Number(lat) || 51.505;
  const longitude = Number(lng) || -0.09;
  const delta = 0.02 / Math.pow(2, (Number(zoom) || 13) - 13);

  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div
      style={{
        width: '100%',
        height: 380,
        borderRadius: 'var(--ppx-radius, 8px)',
        overflow: 'hidden',
        border: '1px solid var(--ppx-border, #e5e0d8)',
        margin: '20px 0',
      }}
    >
      <iframe
        title="OpenStreetMap"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={iframeSrc}
        style={{ border: 0 }}
      />
    </div>
  );
}

export const fields: Fields<MapEmbedProps> = {
  lat: { type: 'number', label: 'Latitude' },
  lng: { type: 'number', label: 'Longitude' },
  zoom: { type: 'number', label: 'Zoom Level' },
};

export const defaultProps: MapEmbedProps = {
  lat: 48.8584,
  lng: 2.2945,
  zoom: 14,
};
