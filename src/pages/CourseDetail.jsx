import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'

const CourseDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch Course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single()
        
        if (courseError) throw courseError
        setCourse(courseData)

        // Fetch Enrollment if user logged in
        if (user) {
          const { data: enrollData } = await supabase
            .from('enrollments')
            .select('*')
            .eq('course_id', id)
            .eq('student_id', user.id)
            .single()
          
          setEnrollment(enrollData)

          // If approved, fetch lessons
          if (enrollData?.status === 'approved') {
            const { data: lessonsData } = await supabase
              .from('lessons')
              .select('*')
              .eq('course_id', id)
              .order('order_index', { ascending: true })
            
            setLessons(lessonsData || [])
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user])

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          course_id: id,
          student_id: user.id,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error
      setEnrollment(data)
    } catch (err) {
      alert('حدث خطأ أثناء طلب الاشتراك')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!course) return <div className="container" style={{ padding: '60px 20px' }}>الكورس غير موجود</div>

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* Course Info */}
        <div>
          <img 
            src={course.image_url || 'https://via.placeholder.com/800x400/16a34a/ffffff?text=Biology'} 
            alt={course.title} 
            style={{ width: '100%', borderRadius: '12px', marginBottom: '30px' }}
          />
          <h1 style={{ marginBottom: '20px' }}>{course.title}</h1>
          <div className="card" style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>عن الكورس</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{course.description}</p>
          </div>

          {enrollment?.status === 'approved' && (
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>محتوى الكورس</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lessons.length > 0 ? lessons.map((lesson, index) => (
                  <Link 
                    key={lesson.id} 
                    to={`/lesson/${lesson.id}`}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '15px', 
                      background: 'var(--gray-50)', 
                      borderRadius: '8px',
                      border: '1px solid var(--gray-200)'
                    }}
                  >
                    <span>{index + 1}. {lesson.title}</span>
                    <span style={{ color: 'var(--primary)' }}>مشاهدة ←</span>
                  </Link>
                )) : <p>لا توجد دروس مضافة حالياً.</p>}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '20px' }}>
              {course.price} ج.م
            </div>

            {!user ? (
              <Link to="/login" className="btn-primary" style={{ display: 'block' }}>سجل دخول للاشتراك</Link>
            ) : !enrollment ? (
              <button onClick={handleEnroll} className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'جاري الطلب...' : 'اشترك الآن'}
              </button>
            ) : enrollment.status === 'pending' ? (
              <div className="badge-pending" style={{ padding: '15px', borderRadius: '8px' }}>
                طلبك قيد المراجعة، سيتم تفعيل الكورس قريباً
              </div>
            ) : enrollment.status === 'rejected' ? (
              <div className="badge-rejected" style={{ padding: '15px', borderRadius: '8px' }}>
                تم رفض طلب الاشتراك، يرجى التواصل مع الإدارة
              </div>
            ) : (
              <div className="badge-approved" style={{ padding: '15px', borderRadius: '8px' }}>
                أنت مشترك بالفعل في هذا الكورس
              </div>
            )}
            
            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              <p>✓ وصول كامل للمحتوى</p>
              <p>✓ فيديوهات عالية الجودة</p>
              <p>✓ ملفات PDF مرفقة</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default CourseDetail
