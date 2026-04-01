import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import LoadingSpinner from '../../components/LoadingSpinner'

const ManageStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false })
    
    if (!error) setStudents(data)
    setLoading(false)
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.phone.includes(searchTerm)
  )

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>إدارة الطلاب</h1>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>بحث بالاسم أو رقم الهاتف</label>
          <input 
            type="text" 
            placeholder="ابحث هنا..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead style={{ background: 'var(--gray-100)' }}>
              <tr>
                <th style={{ padding: '15px' }}>الاسم</th>
                <th style={{ padding: '15px' }}>رقم الهاتف</th>
                <th style={{ padding: '15px' }}>رقم ولي الأمر</th>
                <th style={{ padding: '15px' }}>الصف</th>
                <th style={{ padding: '15px' }}>النوع</th>
                <th style={{ padding: '15px' }}>تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '15px' }}>{student.name}</td>
                  <td style={{ padding: '15px' }}>{student.phone}</td>
                  <td style={{ padding: '15px' }}>{student.parent_phone}</td>
                  <td style={{ padding: '15px' }}>{student.grade}</td>
                  <td style={{ padding: '15px' }}>{student.education_type}</td>
                  <td style={{ padding: '15px' }}>{new Date(student.created_at).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center' }}>لا يوجد طلاب مطابقين للبحث</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageStudents
