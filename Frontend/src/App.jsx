import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthPage from './Components/Auth'
import Assignment from './Pages/Assignment'
import Attendance from './Pages/Attendance'
import Courses from './Pages/Courses'
import Dashboard from './Pages/Dashboard'
import Notices from './Pages/notices'
import AdminDashboard from './Pages/Admin'
import ForgetPassword from './Pages/ForgetPassword'
import AllUsers from './Components/AllUsers'
function App() {
  return (
    <>
      <div >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/auth" element={<AuthPage/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/assignments" element={<Assignment />} />
            <Route path="/notices" element={<Notices />} /> 
            <Route path="/admin" element={<AdminDashboard />} /> 
            <Route path="/forget-password" element={<ForgetPassword />} /> 

          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
