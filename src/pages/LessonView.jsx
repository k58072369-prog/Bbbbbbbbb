import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import VideoPlayer from '../components/VideoPlayer'

const LessonView = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    const fetchLesson = async () => {
      if (!user) return

      try {
        // 1. Fetch Lesson
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*, courses(title)')
          .eq('id', id)
          .single()

        if (lessonError) throw lessonError
        setLesson(lessonData)

        // 2. Check Enrollment
        const { data: enrollData, error: enrollError } = await supabase
          .from('enrollments')
          .select('status')
          .eq('course_id', lessonData.course_id)
          .eq('student_id', user.id)
          .single()

        if (enrollData?.status === 'approved') {
          setIsEnrolled(true)
        } else {
          // Check if admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          
          if (profile?.role === 'admin') setIsEnrolled(true)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [id, user])

  if (loading) return <LoadingSpinner />
  
  if (!isEnrolled) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div className="card">
          <h2 style={{ color: 'var(--danger)', marginBottom: '20px' }}>غير مصرح لك بمشاهدة هذا الدرس</h2>
          <p style={{ marginBottom: '30px' }}>يجب أن تكون مشتركاً في الكورس لفتح هذا المحتوى.</p>
          <button onClick={() => navigate(-1)} className="btn-primary">الرجوع للخلف</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/course/${lesson.course_id}`} style={{ color: 'var(--primary)' }}>← العودة للكورس: {lesson.courses?.title}</Link>
      </div>
      
      <h1 style={{ marginBottom: '30px' }}>{lesson.title}</h1>
      
      <div className="card" style={{ padding: '0', marginBottom: '30px' }}>
        <VideoPlayer url={lesson.video_url} />
      </div>

      {lesson.file_url && (
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ marginBottom: '5px' }}>ملف الدرس</h3>
            <p style={{ color: 'var(--gray-600)' }}>يمكنك تحميل الملف المرفق مع هذا الدرس</p>
          </div>
          <a href={lesson.file_url} target="_blank" rel="noopener noreferrer" className="btn-primary">تحميل الملف PDF</a>
        </div>
      )}
    </div>
  )
}

export default LessonView
