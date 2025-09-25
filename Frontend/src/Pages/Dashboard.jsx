import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Bell,
  LogOut,
  Menu,
  School
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { toast } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userAuth, setUserAuth] = useState(false);

  useEffect(() => {
    const Username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token) {
      if(role === "admin")
      {
        navigate('/admin')
      }
      setUserAuth(true);
      setUserName(Username || "Student");
    } else {
      setUserAuth(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUserAuth(false);
    toast.success("Logout successgully.")
    navigate("/");
  };
  const menuItems = [
    { label: " My Courses", icon: BookOpen, onClick: () => setActiveState("courses") },
    { label: "Attendance", icon: Calendar, onClick: () => setActiveState("attendance") },
    { label: "Assignment", icon: School, onClick: () => setActiveState("assignment") },
    { label: "Notices", icon: Bell, onClick: () => setActiveState("notices") },
  ];

  

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Desktop Sidebar */}
      {userAuth && (
        <aside className="hidden md:flex w-64 bg-indigo-700 text-white shadow-lg">
          {/* <SidebarContent /> */}
          <Sidebar menuItems={menuItems} handleLogout={handleLogout} heading = {"🎓 College Portal"} />
        </aside>
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-indigo-700 text-white">
            <Sidebar menuItems={menuItems} handleLogout={handleLogout} heading = {"🎓 College Portal"} />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white rounded-md shadow p-4 sm:p-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">
              {userAuth
                ? `Welcome back, ${username}!`
                : "Welcome to College Portal 🎓"}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Here’s an overview of your academics 📊
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!userAuth && (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => navigate("/auth")}
                  className="px-4 py-2 rounded shadow text-white bg-indigo-400 hover:text-white  hover:scale-105 text-base sm:text-base"
                >
                  Signup
                </button>
                <button
                  onClick={() => navigate("/auth")}
                  className="px-4 py-2 rounded bg-green-500 text-white hover:scale-105 text-sm sm:text-base"
                >
                  Login
                </button>
              </div>
            )}

            {userAuth && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>
        </header>

        {/* Dashboard cards */}
        
        <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            onClick={() => navigate("/courses")}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
          >
            <BookOpen className="text-indigo-600 w-8 h-8 sm:w-10 sm:h-10 mb-2" />
            <h2 className="font-semibold text-base sm:text-lg">My Courses</h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              View enrolled courses & materials
            </p>
          </div>
          <div
            onClick={() => navigate("/attendance")}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
          >
            <Calendar className="text-green-600 w-8 h-8 sm:w-10 sm:h-10 mb-2" />
            <h2 className="font-semibold text-base sm:text-lg">Attendance</h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Check your daily & monthly attendance
            </p>
          </div>
          <div
            onClick={() => navigate("/assignments")}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
          >
            <ClipboardList className="text-orange-600 w-8 h-8 sm:w-10 sm:h-10 mb-2" />
            <h2 className="font-semibold text-base sm:text-lg">Assignments</h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Submit assignments and check grades
            </p>
          </div>
          <div
            onClick={() => navigate("/notices")}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
          >
            <Bell className="text-red-600 w-8 h-8 sm:w-10 sm:h-10 mb-2" />
            <h2 className="font-semibold text-base sm:text-lg">Notices</h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Stay updated with college announcements
            </p>
          </div>
        </main>
          

      </div>
    </div>
  );
}
