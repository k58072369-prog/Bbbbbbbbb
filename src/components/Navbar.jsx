import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { supabase } from '../supabaseClient'

const Navbar = () => {
  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav style={{ background: 'var(--white)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          فكرة في الأحياء
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} className="desktop-nav">
          <Link to="/">الرئيسية</Link>
          <Link to="/courses">الكورسات</Link>
          
          {user ? (
            <>
              <Link to="/profile">الملف الشخصي</Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>لوحة التحكم</Link>
              )}
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px' }}>تسجيل خروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px' }}>تسجيل دخول</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px' }}>إنشاء حساب</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          style={{ display: 'none', background: 'none', fontSize: '1.5rem' }} 
          className="mobile-toggle"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{ padding: '20px', background: 'var(--white)', borderTop: '1px solid var(--gray-100)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>الرئيسية</Link>
            <Link to="/courses" onClick={() => setIsMenuOpen(false)}>الكورسات</Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>الملف الشخصي</Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>لوحة التحكم</Link>
                )}
                <button onClick={handleLogout} className="btn-secondary">تسجيل خروج</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>تسجيل دخول</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>إنشاء حساب</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
