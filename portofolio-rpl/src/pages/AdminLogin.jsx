import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // 🌟 BERSIHKAN TOKEN & DATA LAMA: Agar middleware guestOnly di backend tidak memblokir
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  try {
    const result = await login(email, password);
    
    if (result.success && result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user || { email }));
      
      if (result.user?.role === 'user' || email === 'user@gmail.com') {
        navigate('/');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      setError(result.message || 'Login gagal. Periksa kembali data Anda.');
    }
  } catch (err) {
    setError('Tidak dapat terhubung ke server. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <i className="fas fa-shield-alt"></i>
          <h2>Admin Portal</h2>
          <p>Portofolio XI RPL</p>
        </div>
        
        {error && <div className="error-alert" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <div className="input-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Login'}
            {!loading && ' — Masuk Dashboard'}
          </button>
        </form>
        
        <div className="login-footer">
          <a href="/">← Kembali ke Portofolio</a>
        </div>
      </div>
    </div>
  );
}