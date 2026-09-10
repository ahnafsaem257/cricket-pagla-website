import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Trophy, Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { loginUser, registerUser } from '../../services/firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'PLAYER': return '/player/dashboard';
      case 'MANAGEMENT': return '/management/dashboard';
      default: return '/';
    }
  };

  const { currentUser, userData } = useAuth();

  useEffect(() => {
    if (currentUser && userData) {
      navigate(from || getRedirectPath(userData.role), { replace: true });
    }
  }, [currentUser, userData, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        if (!name) throw new Error('Name is required for registration');
        await registerUser(email, password, name);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during authentication');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cricket-dark">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cricket-gold/10 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-cricket-gold" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {isLogin ? 'Welcome Back' : 'Join Cricket Pagla'}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mt-6">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    id="name" name="name" type="text" required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cricket-gold focus:ring-1 focus:ring-cricket-gold transition-all text-sm"
                    placeholder="Enter your full name"
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  id="email" name="email" type="email" autoComplete="email" required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cricket-gold focus:ring-1 focus:ring-cricket-gold transition-all text-sm"
                  placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  id="password" name="password" type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"} required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cricket-gold focus:ring-1 focus:ring-cricket-gold transition-all text-sm"
                  placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center py-3 px-4 bg-cricket-gold hover:bg-cricket-gold-light text-cricket-dark font-bold rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:shadow-cricket-gold/20"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-gray-800">
            <button
              type="button"
              className="text-sm text-cricket-gold hover:text-cricket-gold-light transition-colors"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
