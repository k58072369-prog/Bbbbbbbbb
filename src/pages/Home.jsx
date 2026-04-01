import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .limit(3)
        .order('created_at', { ascending: false })

      if (!error) setCourses(data)
      setLoading(false)
    }
    fetchCourses()
  }, [])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', 
        color: 'var(--white)', 
        padding: '100px 0', 
        textAlign: 'center' 
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 'bold' }}>فكرة في الأحياء</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '40px', opacity: 0.9 }}>منصة مستر يوسف للأحياء - طريقك نحو التميز</p>
          <Link to="/courses" className="btn-primary" style={{ background: 'var(--white)', color: 'var(--primary)', fontSize: '1.2rem', padding: '15px 40px' }}>
            استعرض الكورسات
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="grid grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✏️</div>
              <h3 style={{ marginBottom: '10px' }}>شرح مبسط</h3>
              <p style={{ color: 'var(--gray-600)' }}>تبسيط أصعب المفاهيم في مادة الأحياء بأسلوب ممتع وسهل.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎥</div>
              <h3 style={{ marginBottom: '10px' }}>فيديوهات عالية الجودة</h3>
              <p style={{ color: 'var(--gray-600)' }}>تصوير احترافي وصوت نقي لضمان أفضل تجربة تعليمية.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏆</div>
              <h3 style={{ marginBottom: '10px' }}>متابعة مستمرة</h3>
              <p style={{ color: 'var(--gray-600)' }}>متابعة دورية واختبارات لتقييم مستواك وتطويره.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Courses Section */}
      <section style={{ padding: '80px 0', background: 'var(--gray-100)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2.5rem' }}>أحدث الكورسات</h2>
          
          {loading ? (
            <LoadingSpinner />
          ) : courses.length > 0 ? (
            <div className="grid grid-3">
              {courses.map(course => (
                <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <img 
                    src={course.image_url || 'https://via.placeholder.com/400x250/16a34a/ffffff?text=Biology'} 
                    alt={course.title} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                  />
                  <h3 style={{ marginBottom: '10px' }}>{course.title}</h3>
                  <p style={{ color: 'var(--gray-600)', marginBottom: '20px', flex: 1 }}>{course.description?.substring(0, 100)}...</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>{course.price} ج.م</span>
                    <Link to={`/course/${course.id}`} className="btn-primary">عرض الكورس</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--gray-600)' }}>لا توجد كورسات متاحة حالياً.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
