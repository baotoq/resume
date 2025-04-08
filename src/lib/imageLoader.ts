export default function imageLoader({ src }: { src: string }) {
  const basePath = process.env.NODE_ENV === 'production' ? '/resume' : '';
  // Remove leading slash if it exists since basePath will add one
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;
  return `${basePath}/${normalizedSrc}`;
}
