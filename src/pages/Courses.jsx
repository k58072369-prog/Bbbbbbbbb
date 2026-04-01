import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setCourses(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>جميع الكورسات المتاحة</h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert-error">{error}</div>
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
              <p style={{ color: 'var(--gray-600)', marginBottom: '20px', flex: 1 }}>{course.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>{course.price} ج.م</span>
                <Link to={`/course/${course.id}`} className="btn-primary">عرض التفاصيل</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--gray-600)' }}>لا توجد كورسات متاحة حالياً.</p>
      )}
    </div>
  )
}

export default Courses
