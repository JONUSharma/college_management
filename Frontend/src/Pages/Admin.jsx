import { useState, useEffect } from "react";
import { Users, Shield, BookOpen, Bell, BarChart, LogOut, School, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AllUsers from "../Components/AllUsers";
import CourseManagement from "./Courses";
import Notices from "./notices";
import Assignment from "./Assignment";
import Card from "../Components/Cards";
import Sidebar from "../Components/Sidebar";
import UserUpdateForm from "../Components/UpdateUser";
import { toast } from "react-toastify";
import Attendance from "./Attendance";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../Store/Auth/AuthThunk";
import { Fetch_course_Thunk } from "../Store/Courses/CourseThunk";


export default function AdminDashboard() {
  const [username, setUserName] = useState("");
  const [activeState, setActiveState] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth)

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUsers(token));
    dispatch(Fetch_course_Thunk());
    const Name = localStorage.getItem("username");
    if (Name) setUserName(Name);
  }, [dispatch]);

  const { users } = useSelector(state => state.auth)
  const {courses} = useSelector(state => state.CourseSlice)

  if (!token) navigate("/auth")
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUserName(false);
    toast.success("Logout succcessfully")
    navigate("/auth");
  };

  // cards data
  const cardsData = [
    { title: "Total Users", value: users.length, icon: Users, color: "text-indigo-600" },
    { title: "Courses", value: courses.length, icon: BookOpen, color: "text-green-600" },
    { title: "Notices", value: "Null", icon: Bell, color: "text-orange-600" },
    { title: "Admins", value: 1, icon: Shield, color: "text-red-600" },
  ];

  // Sidebar buttons data
  const menuItems = [
    { label: "Dashboard", icon: BarChart, onClick: () => setActiveState("dashboard") },
    { label: "Courses", icon: BookOpen, onClick: () => setActiveState("courses") },
    { label: "Attendance", icon: Calendar, onClick: () => setActiveState("attendance") },
    { label: "Assignment", icon: School, onClick: () => setActiveState("assignment") },
    { label: "Notices", icon: Bell, onClick: () => setActiveState("notices") },
  ];
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar menuItems={menuItems} handleLogout={handleLogout} heading={"🖥️ Admin Panel"} />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-indigo-700 text-white">
            <Sidebar menuItems={menuItems} handleLogout={handleLogout} heading={"🎓 College Portal"} />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome, Admin 👋 {username}</h1>
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardsData.map((card, idx) => (
            <Card
              key={idx}
              icon={card.icon}
              title={card.title}
              value={card.value}
              color={card.color}
            />
          ))}
        </div>

        {
          activeState === "dashboard" ? <AllUsers /> : activeState === "courses" ? <CourseManagement /> : activeState === "attendance" ? <Attendance /> :
            activeState === "notice" ? <Notices /> : activeState === "assignment" ? <Assignment /> : activeState === "roles" ? <UserUpdateForm /> : <p>❌ Not Found</p>
        }
      </main>
    </div>
  );
}
