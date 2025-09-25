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
export default function AdminDashboard() {
  const [username, setUserName] = useState("");
  const [activeState, setActiveState] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const Name = localStorage.getItem("username");
    if (Name) setUserName(Name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUserName(false);
    toast.success("Logout succcessfully")
    navigate("/");
  };

  // cards data
  const cardsData = [
    { title: "Total Users", value: 1200, icon: Users, color: "text-indigo-600" },
    { title: "Courses", value: 5, icon: BookOpen, color: "text-green-600" },
    { title: "Notices", value: 15, icon: Bell, color: "text-orange-600" },
    { title: "Admins", value: 1, icon: Shield, color: "text-red-600" },
  ];

  // Sidebar buttons data
  const menuItems = [
    { label: "Dashboard", icon: BarChart, onClick: () => setActiveState("dashboard") },
    // { label: "Roles", icon: Shield, onClick: () => setActiveState("roles") },
    { label: "Courses", icon: BookOpen, onClick: () => setActiveState("courses") },
    { label: "Attendance", icon: Calendar, onClick: () => setActiveState("attendance") },
    { label: "Assignment", icon: School, onClick: () => setActiveState("assignment") },
    { label: "Notices", icon: Bell, onClick: () => setActiveState("notices") },
  ];
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar menuItems={menuItems} handleLogout={handleLogout} heading = {"🖥️ Admin Panel"} />

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
          activeState === "dashboard" ? <AllUsers  /> : activeState === "courses" ? <CourseManagement /> :
            activeState === "notice" ? <Notices /> : activeState === "assignment" ? <Assignment /> :activeState === "roles" ? <UserUpdateForm/>: <p>❌ Not Found</p>
        }
      </main>
    </div>
  );
}
