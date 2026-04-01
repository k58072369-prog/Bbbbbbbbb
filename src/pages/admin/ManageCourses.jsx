import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import LoadingSpinner from '../../components/LoadingSpinner'

const ManageCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    image_url: '',
    is_published: false
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setCourses(data)
    setLoading(false)
  }

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course)
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price,
        image_url: course.image_url,
        is_published: course.is_published
      })
    } else {
      setEditingCourse(null)
      setFormData({
        title: '',
        description: '',
        price: 0,
        image_url: '',
        is_published: false
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', editingCourse.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('courses')
          .insert(formData)
        if (error) throw error
      }
      
      setIsModalOpen(false)
      fetchCourses()
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الكورس؟ سيتم حذف جميع الدروس والاشتراكات المتعلقة به.')) return
    
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
    
    if (!error) fetchCourses()
    else alert('حدث خطأ أثناء الحذف')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>إدارة الكورسات</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary">إضافة كورس جديد</button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead style={{ background: 'var(--gray-100)' }}>
              <tr>
                <th style={{ padding: '15px' }}>العنوان</th>
                <th style={{ padding: '15px' }}>السعر</th>
                <th style={{ padding: '15px' }}>منشور</th>
                <th style={{ padding: '15px' }}>تاريخ الإنشاء</th>
                <th style={{ padding: '15px' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '15px' }}>{course.title}</td>
                  <td style={{ padding: '15px' }}>{course.price} ج.م</td>
                  <td style={{ padding: '15px' }}>
                    <span className={`badge ${course.is_published ? 'badge-approved' : 'badge-pending'}`}>
                      {course.is_published ? 'نعم' : 'لا'}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>{new Date(course.created_at).toLocaleDateString('ar-EG')}</td>
                  <td style={{ padding: '15px' }}>
                    <button onClick={() => handleOpenModal(course)} className="btn-secondary" style={{ marginLeft: '10px', padding: '5px 10px' }}>تعديل</button>
                    <button onClick={() => handleDelete(course.id)} className="btn-danger" style={{ padding: '5px 10px', background: '#fee2e2', color: '#b91c1c' }}>حذف</button>
                  </td>
                </tr>
              ))}
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
            <h2 style={{ marginBottom: '20px' }}>{editingCourse ? 'تعديل كورس' : 'إضافة كورس جديد'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>عنوان الكورس</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>وصف الكورس</label>
                <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--gray-200)' }}></textarea>
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label>السعر (ج.م)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>رابط الصورة</label>
                  <input type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} style={{ width: 'auto' }} />
                <label style={{ marginBottom: 0 }}>نشر الكورس للطلاب</label>
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

export default ManageCourses
