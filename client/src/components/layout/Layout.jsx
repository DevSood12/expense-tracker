import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const Layout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;