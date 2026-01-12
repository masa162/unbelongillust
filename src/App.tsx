import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import IllustrationPage from './pages/IllustrationPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="illustrations/:id" element={<IllustrationPage />} />
      </Route>
    </Routes>
  );
}

export default App;
