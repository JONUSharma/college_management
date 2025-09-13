import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthPage from './Components/Auth'
import Assignment from './Pages/Assignment'
import Attendance from './Pages/Attendance'
import Courses from './Pages/Courses'
import Dashboard from './Pages/Dashboard'
import Notices from './Pages/notices'
function App() {


  return (
    <>
      <div >
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/assignments" element={<Assignment />} />
            <Route path="/notices" element={<Notices />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
