import { Fields } from '@measured/puck';

export interface VideoEmbedProps {
  provider: 'youtube' | 'vimeo';
  url: string;
  aspect: '16:9' | '4:3' | '1:1';
}

function getEmbedUrl(provider: 'youtube' | 'vimeo', url: string): string {
  if (!url) return '';
  if (provider === 'youtube') {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = match && match[2].length === 11 ? match[2] : url;
    return `https://www.youtube.com/embed/${id}`;
  } else {
    const regExp = /(?:vimeo)\.com.*(?:videos\/|channels\/|channels\/\w+\/|groups\/[^\/]*\/videos\/|(?:album\/)?\d+\/video\/|)(\d+)/;
    const match = url.match(regExp);
    const id = match ? match[1] : url;
    return `https://player.vimeo.com/video/${id}`;
  }
}

export default function VideoEmbed({ provider, url, aspect }: VideoEmbedProps) {
  const aspectMap = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
  };

  const embedSrc = getEmbedUrl(provider, url);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: aspectMap[aspect] || '56.25%',
        borderRadius: 'var(--ppx-radius, 8px)',
        overflow: 'hidden',
        backgroundColor: '#000000',
        margin: '20px 0',
      }}
    >
      {embedSrc ? (
        <iframe
          src={embedSrc}
          title="Video Embed"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          Enter a video URL
        </div>
      )}
    </div>
  );
}

export const fields: Fields<VideoEmbedProps> = {
  provider: {
    type: 'select',
    options: [
      { label: 'YouTube', value: 'youtube' },
      { label: 'Vimeo', value: 'vimeo' },
    ],
  },
  url: { type: 'text' },
  aspect: {
    type: 'select',
    options: [
      { label: '16:9 (Widescreen)', value: '16:9' },
      { label: '4:3 (Standard)', value: '4:3' },
      { label: '1:1 (Square)', value: '1:1' },
    ],
  },
};

export const defaultProps: VideoEmbedProps = {
  provider: 'youtube',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  aspect: '16:9',
};
