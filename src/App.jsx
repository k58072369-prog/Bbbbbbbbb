import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import LessonView from './pages/LessonView'
import Profile from './pages/Profile'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ManageCourses from './pages/admin/ManageCourses'
import ManageLessons from './pages/admin/ManageLessons'
import ManageEnrollments from './pages/admin/ManageEnrollments'
import ManageStudents from './pages/admin/ManageStudents'
import ProtectedRoute from './components/ProtectedRoute'
import { initAdmin } from './utils/initAdmin'

function App() {
  useEffect(() => {
    initAdmin()
  }, [])

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/lesson/:id" element={<LessonView />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="lessons" element={<ManageLessons />} />
              <Route path="enrollments" element={<ManageEnrollments />} />
              <Route path="students" element={<ManageStudents />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
