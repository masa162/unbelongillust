const ACCOUNT_HASH = 'wdR9enbrkaPsEgUtgFORrw';
const CDN_URL = 'https://img.unbelong.xyz';

export interface ImageOptions {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'json';
}

export function getImageUrl(imageId: string, options: ImageOptions = {}): string {
  // 短縮 ID の場合（4-6桁）
  if (imageId.length >= 4 && imageId.length <= 6) {
    const ext = options.format === 'avif' ? 'avif' : 'webp';
    return `${CDN_URL}/${imageId}.${ext}`;
  }

  // フル UUID の場合
  const params = new URLSearchParams();
  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.fit) params.set('fit', options.fit);
  if (options.quality) params.set('quality', options.quality.toString());
  if (options.format) params.set('format', options.format);

  const queryString = params.toString();
  return `https://imagedelivery.net/${ACCOUNT_HASH}/${imageId}/public${queryString ? '?' + queryString : ''}`;
}
