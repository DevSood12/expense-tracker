import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Wait for the /auth/me session check before deciding
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;