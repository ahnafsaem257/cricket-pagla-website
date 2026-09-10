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
import { Notices } from './pages/public/Notices';
import { GalleryPage } from './pages/public/GalleryPage';
import { MatchesPage } from './pages/public/MatchesPage';
import { About } from './pages/public/About';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPlayers } from './pages/admin/AdminPlayers';
import { PlayerForm } from './pages/admin/PlayerForm';
import { AdminMatches } from './pages/admin/AdminMatches';
import { MatchForm } from './pages/admin/MatchForm';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminNotices } from './pages/admin/AdminNotices';
import { NoticeForm } from './pages/admin/NoticeForm';
import { AdminTournaments } from './pages/admin/AdminTournaments';
import { TournamentForm } from './pages/admin/TournamentForm';
import { AdminUsers } from './pages/admin/AdminUsers';
import { UserForm } from './pages/admin/UserForm';
import { PlayerDashboard } from './pages/player/PlayerDashboard';
import { PlayerProfileSettings } from './pages/player/PlayerProfileSettings';
import { ManagementDashboard } from './pages/management/ManagementDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/add" element={<UserForm />} />
            <Route path="players" element={<AdminPlayers />} />
            <Route path="players/add" element={<PlayerForm />} />
            <Route path="players/edit/:id" element={<PlayerForm />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="matches/add" element={<MatchForm />} />
            <Route path="matches/edit/:id" element={<MatchForm />} />
            <Route path="tournaments" element={<AdminTournaments />} />
            <Route path="tournaments/add" element={<TournamentForm />} />
            <Route path="tournaments/edit/:id" element={<TournamentForm />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="notices/add" element={<NoticeForm />} />
            <Route path="notices/edit/:id" element={<NoticeForm />} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>

          {/* Player Routes */}
          <Route path="/player" element={
            <RoleProtectedRoute allowedRoles={['PLAYER']}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }>
            <Route path="dashboard" element={<PlayerDashboard />} />
            <Route path="profile" element={<PlayerProfileSettings />} />
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
