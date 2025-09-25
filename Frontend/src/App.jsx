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
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <div >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/attendance" element={<Attendance />} />
            <Route path="/assignments" element={<Assignment />} />
            <Route path="/notices" element={<Notices />} />  */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/forget-password" element={<ForgetPassword />} />

          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"   // "light" | "dark" | "colored"
        />
      </div>
    </>
  )
}

export default App
