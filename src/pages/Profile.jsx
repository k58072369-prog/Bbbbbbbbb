import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { supabase } from '../supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { user } = useAuth()
  const { profile, loading: profileLoading, setProfile } = useProfile(user?.id)
  const [enrollments, setEnrollments] = useState([])
  const [loadingEnrollments, setLoadingEnrollments] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone,
        parent_phone: profile.parent_phone,
        grade: profile.grade,
        education_type: profile.education_type
      })
    }
  }, [profile])

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select('*, courses(title, image_url)')
          .eq('student_id', user.id)
        
        if (!error) setEnrollments(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingEnrollments(false)
      }
    }
    fetchEnrollments()
  }, [user])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error
      setProfile({ ...profile, ...formData })
      setMessage({ type: 'success', text: 'تم تحديث البيانات بنجاح' })
      setIsEditing(false)
    } catch (err) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء التحديث' })
    } finally {
      setSaving(false)
    }
  }

  if (profileLoading) return <LoadingSpinner />

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Profile Info */}
        <div>
          <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '100px', height: '100px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', margin: '0 auto 15px' }}>
                👤
              </div>
              <h2>{profile.name}</h2>
              <p style={{ color: 'var(--gray-600)' }}>{user?.email}</p>
              <span className={`badge ${profile.role === 'admin' ? 'badge-approved' : 'badge-pending'}`} style={{ marginTop: '10px', display: 'inline-block' }}>
                {profile.role === 'admin' ? 'مسؤول' : 'طالب'}
              </span>
            </div>

            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--gray-100)' }} />

            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div><strong>رقم الهاتف:</strong> {profile.phone}</div>
                <div><strong>رقم ولي الأمر:</strong> {profile.parent_phone}</div>
                <div><strong>الصف:</strong> {profile.grade}</div>
                <div><strong>النوع:</strong> {profile.education_type}</div>
                <button onClick={() => setIsEditing(true)} className="btn-secondary" style={{ marginTop: '10px' }}>تعديل البيانات</button>
              </div>
            ) : (
              <form onSubmit={handleUpdate}>
                {message.text && <div className={`alert-${message.type}`}>{message.text}</div>}
                <div className="form-group">
                  <label>الاسم</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>رقم ولي الأمر</label>
                  <input type="text" value={formData.parent_phone} onChange={(e) => setFormData({...formData, parent_phone: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>حفظ</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{ flex: 1 }}>إلغاء</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* My Courses */}
        <div>
          <h2 style={{ marginBottom: '25px' }}>كورساتي</h2>
          {loadingEnrollments ? (
            <LoadingSpinner />
          ) : enrollments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {enrollments.map(enroll => (
                <div key={enroll.id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <img 
                    src={enroll.courses.image_url || 'https://via.placeholder.com/150x100/16a34a/ffffff?text=Bio'} 
                    alt={enroll.courses.title} 
                    style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '5px' }}>{enroll.courses.title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge badge-${enroll.status}`}>
                        {enroll.status === 'pending' ? 'قيد المراجعة' : enroll.status === 'approved' ? 'مفعل' : 'مرفوض'}
                      </span>
                      {enroll.status === 'approved' && (
                        <Link to={`/course/${enroll.course_id}`} className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>دخول الكورس</Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--gray-600)', marginBottom: '20px' }}>أنت غير مشترك في أي كورس حالياً.</p>
              <Link to="/courses" className="btn-primary">استعرض الكورسات المتاحة</Link>
            </div>
          )}
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

export default Profile
