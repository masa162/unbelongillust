import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import IllustrationPage from './pages/IllustrationPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminIllustrations from './pages/admin/Illustrations';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="illustrations/:id" element={<IllustrationPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="illustrations" element={<AdminIllustrations />} />
      </Route>
    </Routes>
  );
}

export default App;
