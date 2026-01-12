import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <h1>unbelong - イラストギャラリー</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
