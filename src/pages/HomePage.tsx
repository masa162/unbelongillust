import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { illustrationsApi, type Illustration } from '../lib/api';
import { getImageUrl } from '../lib/utils';

export default function HomePage() {
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIllustrations();
  }, []);

  const fetchIllustrations = async () => {
    try {
      const response = await illustrationsApi.list();
      if (response.data.success && response.data.data) {
        // 公開済みのイラストのみ表示
        const published = response.data.data.filter(ill => ill.status === 'published');
        setIllustrations(published);
      }
    } catch (error) {
      console.error('Failed to fetch illustrations:', error);
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

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>イラストギャラリー</h2>
      
      {illustrations.length === 0 ? (
        <p>まだイラストが投稿されていません。</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {illustrations.map((illustration) => (
            <Link
              key={illustration.id}
              to={`/illustrations/${illustration.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid #eee',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                aspectRatio: '1',
                background: '#f5f5f5',
                overflow: 'hidden'
              }}>
                <img
                  src={getImageUrl(illustration.image_id, { width: 400, height: 400, fit: 'cover' })}
                  alt={illustration.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                />
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                  {illustration.title}
                </h3>
                {illustration.description && (
                  <p style={{
                    margin: '0.5rem 0 0',
                    fontSize: '0.875rem',
                    color: '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {illustration.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
