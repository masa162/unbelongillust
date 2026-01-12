import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { illustrationsApi, worksApi, type Illustration, type Work } from '../lib/api';
import { getImageUrl } from '../lib/utils';

export default function IllustrationPage() {
  const { id: slug } = useParams<{ id: string }>();
  const [illustration, setIllustration] = useState<Illustration | null>(null);
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchIllustration(slug);
    }
  }, [slug]);

  const fetchIllustration = async (idOrSlug: string) => {
    try {
      // IDまたはSlugで直接取得
      const response = await illustrationsApi.get(idOrSlug);
      
      if (response.data.success && response.data.data) {
        const found = response.data.data;

        if (found.status !== 'published') {
          setError('このイラストは公開されていません');
          setLoading(false);
          return;
        }

        setIllustration(found);

        // 作品情報を取得
        if (found.work_id) {
          const workResponse = await worksApi.get(found.work_id);
          if (workResponse.data.success && workResponse.data.data) {
            setWork(workResponse.data.data);
          }
        }
      } else {
        setError('イラストが見つかりませんでした');
      }
    } catch (error) {
      console.error('Failed to fetch illustration:', error);
      setError('イラストの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !illustration) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error || 'イラストが見つかりませんでした'}</p>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← ギャラリーに戻る
        </Link>
      </div>
    );
  }

  const tags = illustration.tags ? JSON.parse(illustration.tags) : [];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← ギャラリーに戻る
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        {/* 画像エリア */}
        <div>
          <div style={{
            background: '#f5f5f5',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <img
              src={getImageUrl(illustration.image_id, { width: 1200 })}
              alt={illustration.title}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        </div>

        {/* 情報エリア */}
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
            {illustration.title}
          </h1>

          {work && (
            <div style={{
              padding: '0.75rem',
              background: '#f8f9fa',
              borderRadius: '6px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                作品
              </div>
              <div style={{ fontWeight: 600 }}>
                {work.title}
              </div>
            </div>
          )}

          {illustration.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>説明</h3>
              <p style={{ color: '#666', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {illustration.description}
              </p>
            </div>
          )}

          {tags.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>タグ</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: '#e9ecef',
                      borderRadius: '16px',
                      fontSize: '0.875rem',
                      color: '#495057'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: '#666'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>閲覧数:</strong> {illustration.view_count.toLocaleString()}
            </div>
            <div>
              <strong>投稿日:</strong>{' '}
              {new Date(illustration.created_at * 1000).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
