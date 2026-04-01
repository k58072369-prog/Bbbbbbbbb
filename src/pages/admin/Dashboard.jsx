import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import LoadingSpinner from '../../components/LoadingSpinner'

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    enrollments: 0,
    pendingEnrollments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: studentsCount },
          { count: coursesCount },
          { count: enrollmentsCount },
          { count: pendingCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ])

        setStats({
          students: studentsCount || 0,
          courses: coursesCount || 0,
          enrollments: enrollmentsCount || 0,
          pendingEnrollments: pendingCount || 0
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>نظرة عامة</h1>
      
      <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="card" style={{ borderRight: '5px solid var(--primary)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '5px' }}>إجمالي الطلاب</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.students}</div>
        </div>
        <div className="card" style={{ borderRight: '5px solid var(--warning)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '5px' }}>إجمالي الكورسات</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.courses}</div>
        </div>
        <div className="card" style={{ borderRight: '5px solid #3b82f6' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '5px' }}>إجمالي الاشتراكات</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.enrollments}</div>
        </div>
        <div className="card" style={{ borderRight: '5px solid var(--danger)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '5px' }}>طلبات معلقة</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pendingEnrollments}</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
