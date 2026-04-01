import React from 'react'

const Footer = () => {
  return (
    <footer style={{ background: 'var(--primary-dark)', color: 'var(--white)', padding: '40px 0', marginTop: 'auto' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>فكرة في الأحياء - مستر يوسف</p>
        <p style={{ opacity: 0.8 }}>© 2025 جميع الحقوق محفوظة</p>
      </div>
    </footer>
  )
}

export default Footer
