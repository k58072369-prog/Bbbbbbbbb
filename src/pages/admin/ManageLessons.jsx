import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import LoadingSpinner from '../../components/LoadingSpinner'
import VideoPlayer from '../../components/VideoPlayer'

const ManageLessons = () => {
  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    video_url: '',
    file_url: '',
    order_index: 0
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourseId) {
      fetchLessons(selectedCourseId)
    } else {
      setLessons([])
    }
  }, [selectedCourseId])

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id, title')
    if (data) setCourses(data)
  }

  const fetchLessons = async (courseId) => {
    setLoading(true)
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })
    
    if (data) setLessons(data)
    setLoading(false)
  }

  const handleOpenModal = (lesson = null) => {
    if (!selectedCourseId) {
      alert('يرجى اختيار كورس أولاً')
      return
    }

    if (lesson) {
      setEditingLesson(lesson)
      setFormData({
        title: lesson.title,
        video_url: lesson.video_url,
        file_url: lesson.file_url,
        order_index: lesson.order_index
      })
    } else {
      setEditingLesson(null)
      setFormData({
        title: '',
        video_url: '',
        file_url: '',
        order_index: lessons.length
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update(formData)
          .eq('id', editingLesson.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert({ ...formData, course_id: selectedCourseId })
        if (error) throw error
      }
      
      setIsModalOpen(false)
      fetchLessons(selectedCourseId)
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) return
    
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (!error) fetchLessons(selectedCourseId)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>إدارة الدروس</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary" disabled={!selectedCourseId}>إضافة درس جديد</button>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>اختر الكورس</label>
          <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
            <option value="">-- اختر كورس --</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      </div>

      {!selectedCourseId ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          يرجى اختيار كورس لعرض دروسه
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead style={{ background: 'var(--gray-100)' }}>
              <tr>
                <th style={{ padding: '15px' }}>الترتيب</th>
                <th style={{ padding: '15px' }}>العنوان</th>
                <th style={{ padding: '15px' }}>رابط الفيديو</th>
                <th style={{ padding: '15px' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(lesson => (
                <tr key={lesson.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '15px' }}>{lesson.order_index}</td>
                  <td style={{ padding: '15px' }}>{lesson.title}</td>
                  <td style={{ padding: '15px', fontSize: '0.8rem', color: 'var(--gray-600)' }}>{lesson.video_url?.substring(0, 30)}...</td>
                  <td style={{ padding: '15px' }}>
                    <button onClick={() => handleOpenModal(lesson)} className="btn-secondary" style={{ marginLeft: '10px', padding: '5px 10px' }}>تعديل</button>
                    <button onClick={() => handleDelete(lesson.id)} className="btn-danger" style={{ padding: '5px 10px', background: '#fee2e2', color: '#b91c1c' }}>حذف</button>
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '30px', textAlign: 'center' }}>لا توجد دروس لهذا الكورس</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>{editingLesson ? 'تعديل درس' : 'إضافة درس جديد'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>عنوان الدرس</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>رابط فيديو YouTube</label>
                <input type="text" value={formData.video_url} onChange={(e) => setFormData({...formData, video_url: e.target.value})} required placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              {formData.video_url && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>معاينة الفيديو:</label>
                  <VideoPlayer url={formData.video_url} />
                </div>
              )}
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label>رابط الملف (PDF)</label>
                  <input type="text" value={formData.file_url} onChange={(e) => setFormData({...formData, file_url: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>الترتيب</label>
                  <input type="number" value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: e.target.value})} required />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'جاري الحفظ...' : 'حفظ'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageLessons
