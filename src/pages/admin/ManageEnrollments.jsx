import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import LoadingSpinner from '../../components/LoadingSpinner'

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, profiles(name, phone), courses(title)')
      .order('created_at', { ascending: false })
    
    if (!error) setEnrollments(data)
    setLoading(false)
  }

  const handleStatusUpdate = async (id, status) => {
    const { error } = await supabase
      .from('enrollments')
      .update({ status })
      .eq('id', id)
    
    if (!error) {
      setEnrollments(enrollments.map(e => e.id === id ? { ...e, status } : e))
    } else {
      alert('حدث خطأ أثناء التحديث')
    }
  }

  const filteredEnrollments = filter === 'all' 
    ? enrollments 
    : enrollments.filter(e => e.status === filter)

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>إدارة طلبات الاشتراك</h1>

      <div className="card" style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 16px' }}>الكل</button>
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 16px' }}>معلق</button>
        <button onClick={() => setFilter('approved')} className={filter === 'approved' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 16px' }}>مفعل</button>
        <button onClick={() => setFilter('rejected')} className={filter === 'rejected' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '8px 16px' }}>مرفوض</button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead style={{ background: 'var(--gray-100)' }}>
              <tr>
                <th style={{ padding: '15px' }}>اسم الطالب</th>
                <th style={{ padding: '15px' }}>الكورس</th>
                <th style={{ padding: '15px' }}>الحالة</th>
                <th style={{ padding: '15px' }}>التاريخ</th>
                <th style={{ padding: '15px' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map(enroll => (
                <tr key={enroll.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '15px' }}>
                    <div>{enroll.profiles?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{enroll.profiles?.phone}</div>
                  </td>
                  <td style={{ padding: '15px' }}>{enroll.courses?.title}</td>
                  <td style={{ padding: '15px' }}>
                    <span className={`badge badge-${enroll.status}`}>
                      {enroll.status === 'pending' ? 'معلق' : enroll.status === 'approved' ? 'مفعل' : 'مرفوض'}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>{new Date(enroll.created_at).toLocaleDateString('ar-EG')}</td>
                  <td style={{ padding: '15px' }}>
                    {enroll.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(enroll.id, 'approved')} className="btn-primary" style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8rem' }}>تفعيل</button>
                        <button onClick={() => handleStatusUpdate(enroll.id, 'rejected')} className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#fee2e2', color: '#b91c1c' }}>رفض</button>
                      </>
                    )}
                    {enroll.status !== 'pending' && (
                      <button onClick={() => handleStatusUpdate(enroll.id, 'pending')} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>إعادة للمعلق</button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredEnrollments.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>لا توجد طلبات اشتراك</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageEnrollments
