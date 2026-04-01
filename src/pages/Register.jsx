import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    parent_phone: '',
    grade: 'أولى ثانوي',
    education_type: 'عام'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Create user in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            phone: formData.phone,
            parent_phone: formData.parent_phone,
            grade: formData.grade,
            education_type: formData.education_type,
            role: 'student'
          })

        if (profileError) throw profileError
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '550px', padding: '60px 20px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>إنشاء حساب جديد</h2>
        
        {error && <div className="alert-error">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>الاسم بالكامل</label>
            <input name="name" type="text" onChange={handleChange} required placeholder="أدخل اسمك" />
          </div>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input name="email" type="email" onChange={handleChange} required placeholder="example@mail.com" />
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input name="password" type="password" onChange={handleChange} required placeholder="********" />
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>رقم الهاتف</label>
              <input name="phone" type="text" onChange={handleChange} required placeholder="01xxxxxxxxx" />
            </div>
            <div className="form-group">
              <label>رقم ولي الأمر</label>
              <input name="parent_phone" type="text" onChange={handleChange} required placeholder="01xxxxxxxxx" />
            </div>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>الصف الدراسي</label>
              <select name="grade" onChange={handleChange}>
                <option value="أولى ثانوي">أولى ثانوي</option>
                <option value="تانية ثانوي">تانية ثانوي</option>
                <option value="تالتة ثانوي">تالتة ثانوي</option>
              </select>
            </div>
            <div className="form-group">
              <label>نوع التعليم</label>
              <select name="education_type" onChange={handleChange}>
                <option value="عام">عام</option>
                <option value="أزهر">أزهر</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--gray-600)' }}>
          عندك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>سجل دخول</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
