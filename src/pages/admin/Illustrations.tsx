import { useState, useEffect } from 'react';
import { illustrationsApi, worksApi, type Illustration, type Work } from '../../lib/api';
import { getImageUrl } from '../../lib/utils';

export default function AdminIllustrations() {
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [works, setWorks] = useState<Record<string, Work>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // イラスト一覧を取得
      const illustResponse = await illustrationsApi.list();
      if (illustResponse.data.success && illustResponse.data.data) {
        setIllustrations(illustResponse.data.data);

        // 作品情報を取得
        const worksResponse = await worksApi.list('illustration');
        if (worksResponse.data.success && worksResponse.data.data) {
          const worksMap: Record<string, Work> = {};
          worksResponse.data.data.forEach(work => {
            worksMap[work.id] = work;
          });
          setWorks(worksMap);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIllustrations = illustrations.filter(ill => {
    if (filter === 'all') return true;
    return ill.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      published: { bg: '#d4edda', color: '#155724' },
      draft: { bg: '#fff3cd', color: '#856404' },
      archived: { bg: '#f8d7da', color: '#721c24' },
    };
    const style = colors[status as keyof typeof colors] || colors.draft;
    return (
      <span style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 600,
        background: style.bg,
        color: style.color
      }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>イラスト管理</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'all' ? '#007bff' : '#e9ecef',
              color: filter === 'all' ? 'white' : '#495057',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            すべて ({illustrations.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'published' ? '#28a745' : '#e9ecef',
              color: filter === 'published' ? 'white' : '#495057',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            公開 ({illustrations.filter(i => i.status === 'published').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'draft' ? '#ffc107' : '#e9ecef',
              color: filter === 'draft' ? 'white' : '#495057',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            下書き ({illustrations.filter(i => i.status === 'draft').length})
          </button>
        </div>
      </div>

      {filteredIllustrations.length === 0 ? (
        <p>イラストがありません。</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredIllustrations.map((illustration) => (
            <div
              key={illustration.id}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'white'
              }}
            >
              <div style={{
                aspectRatio: '16/9',
                background: '#f8f9fa',
                overflow: 'hidden'
              }}>
                <img
                  src={getImageUrl(illustration.image_id, { width: 600, height: 400, fit: 'cover' })}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, flex: 1 }}>
                    {illustration.title}
                  </h3>
                  {getStatusBadge(illustration.status)}
                </div>
                
                {works[illustration.work_id] && (
                  <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                    作品: {works[illustration.work_id].title}
                  </div>
                )}

                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                  Slug: <code style={{ background: '#f8f9fa', padding: '0.125rem 0.25rem', borderRadius: '2px' }}>{illustration.slug}</code>
                </div>

                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                  画像ID: <code style={{ background: '#f8f9fa', padding: '0.125rem 0.25rem', borderRadius: '2px', fontSize: '0.75rem' }}>{illustration.image_id}</code>
                </div>

                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.75rem' }}>
                  閲覧数: {illustration.view_count.toLocaleString()} | 
                  投稿: {new Date(illustration.created_at * 1000).toLocaleDateString('ja-JP')}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={`https://illust.unbelong.xyz/illustrations/${illustration.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: '#007bff',
                      color: 'white',
                      textAlign: 'center',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}
                  >
                    表示
                  </a>
                  <a
                    href={`https://unbelong-hono-admin.pages.dev/illustrations/${illustration.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: '#6c757d',
                      color: 'white',
                      textAlign: 'center',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}
                  >
                    編集
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
