import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProtectedRoute } from './components/common/ProtectedRoute';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { Login } from './pages/auth/Login';
import { Home } from './pages/public/Home';
import { Players } from './pages/public/Players';
import { PlayerProfile } from './pages/public/PlayerProfile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPlayers } from './pages/admin/AdminPlayers';
import { PlayerForm } from './pages/admin/PlayerForm';
import { AdminMatches } from './pages/admin/AdminMatches';
import { MatchForm } from './pages/admin/MatchForm';
import { PlayerDashboard } from './pages/player/PlayerDashboard';
import { ManagementDashboard } from './pages/management/ManagementDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<div>About</div>} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/matches" element={<div>Matches</div>} />
            <Route path="/gallery" element={<div>Gallery</div>} />
            <Route path="/notices" element={<div>Notices</div>} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<div>Users</div>} />
            <Route path="players" element={<AdminPlayers />} />
            <Route path="players/add" element={<PlayerForm />} />
            <Route path="players/edit/:id" element={<PlayerForm />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="matches/add" element={<MatchForm />} />
            <Route path="matches/edit/:id" element={<MatchForm />} />
            <Route path="tournaments" element={<div>Tournaments</div>} />
            <Route path="gallery" element={<div>Gallery</div>} />
            <Route path="notices" element={<div>Notices</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>

          {/* Player Routes */}
          <Route path="/player" element={
            <RoleProtectedRoute allowedRoles={['PLAYER']}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }>
            <Route path="dashboard" element={<PlayerDashboard />} />
            <Route path="profile" element={<div>Profile</div>} />
            <Route path="matches" element={<div>Matches</div>} />
            <Route path="notices" element={<div>Notices</div>} />
          </Route>

          {/* Management Routes */}
          <Route path="/management" element={
            <RoleProtectedRoute allowedRoles={['MANAGEMENT']}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }>
            <Route path="dashboard" element={<ManagementDashboard />} />
            <Route path="players" element={<div>Players</div>} />
            <Route path="matches" element={<div>Matches</div>} />
            <Route path="notices" element={<div>Notices</div>} />
            <Route path="gallery" element={<div>Gallery</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
