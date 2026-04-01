import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="admin-container" style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ 
        width: '250px', 
        background: 'var(--white)', 
        borderLeft: '1px solid var(--gray-200)', 
        padding: '30px 0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>لوحة التحكم</h2>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ display: 'flex', flexDirection: 'column' }}>
            <li>
              <Link to="/admin" style={{ 
                display: 'block', 
                padding: '12px 20px', 
                background: isActive('/admin') ? 'var(--primary-light)' : 'transparent',
                color: isActive('/admin') ? 'var(--primary-dark)' : 'var(--gray-600)',
                fontWeight: isActive('/admin') ? 'bold' : 'normal'
              }}>
                🏠 الإحصائيات
              </Link>
            </li>
            <li>
              <Link to="/admin/courses" style={{ 
                display: 'block', 
                padding: '12px 20px', 
                background: isActive('/admin/courses') ? 'var(--primary-light)' : 'transparent',
                color: isActive('/admin/courses') ? 'var(--primary-dark)' : 'var(--gray-600)',
                fontWeight: isActive('/admin/courses') ? 'bold' : 'normal'
              }}>
                📚 إدارة الكورسات
              </Link>
            </li>
            <li>
              <Link to="/admin/lessons" style={{ 
                display: 'block', 
                padding: '12px 20px', 
                background: isActive('/admin/lessons') ? 'var(--primary-light)' : 'transparent',
                color: isActive('/admin/lessons') ? 'var(--primary-dark)' : 'var(--gray-600)',
                fontWeight: isActive('/admin/lessons') ? 'bold' : 'normal'
              }}>
                🎬 إدارة الدروس
              </Link>
            </li>
            <li>
              <Link to="/admin/enrollments" style={{ 
                display: 'block', 
                padding: '12px 20px', 
                background: isActive('/admin/enrollments') ? 'var(--primary-light)' : 'transparent',
                color: isActive('/admin/enrollments') ? 'var(--primary-dark)' : 'var(--gray-600)',
                fontWeight: isActive('/admin/enrollments') ? 'bold' : 'normal'
              }}>
                📝 طلبات الاشتراك
              </Link>
            </li>
            <li>
              <Link to="/admin/students" style={{ 
                display: 'block', 
                padding: '12px 20px', 
                background: isActive('/admin/students') ? 'var(--primary-light)' : 'transparent',
                color: isActive('/admin/students') ? 'var(--primary-dark)' : 'var(--gray-600)',
                fontWeight: isActive('/admin/students') ? 'bold' : 'normal'
              }}>
                👥 إدارة الطلاب
              </Link>
            </li>
          </ul>
        </nav>

        <div style={{ padding: '20px' }}>
          <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%' }}>تسجيل خروج</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content" style={{ flex: 1, padding: '40px', background: 'var(--gray-50)' }}>
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-container { flex-direction: column !important; }
          .admin-sidebar { 
            width: 100% !important; 
            border-left: none !important; 
            border-bottom: 1px solid var(--gray-200) !important;
            padding: 10px 0 !important;
          }
          .admin-sidebar nav ul { flex-direction: row !important; overflow-x: auto; padding: 0 10px; }
          .admin-sidebar nav ul li { white-space: nowrap; }
          .admin-sidebar .btn-secondary { display: none; }
        }
      `}</style>
    </div>
  )
}

export default AdminLayout
