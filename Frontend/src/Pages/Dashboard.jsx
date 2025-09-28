import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Bell,
  LogOut,
  Menu,
  School
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { toast } from "react-toastify";
import Attendance from "./Attendance";
import CourseManagement from "./Courses";
import Assignment from "./Assignment";
import Notices from "./notices";
import Available_courses from "../Components/Available_courses";
import instance from "../Components/Axios/instance";

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [Student_id, setStudent_id] = useState("")
  const [Course_id, setCourse_id] = useState("")
  const [activeState, setActiveState] = useState("courses")
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userAuth, setUserAuth] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const Username = localStorage.getItem("username");


  useEffect(() => {
    if (token) {
      if (role === "admin") {
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
    navigate("/auth");
  };


  useEffect(() => {
    const fetch_current_user = async () => {
      try {
        if (!token) return;

        const result = await instance.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent_id(result.data.id);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetch_current_user();
  }, []);

  // Enroll function called when child sends course_id
  const Enroll_course = async (course_id) => {
    if (!Student_id) {
      toast.error("Student not logged in!");
      return;
    }

    try {
      if (role === "teacher" || role === "Hod") {
        toast.warning("Teacher can't enroll themselves for course!")
      } else {
        const result = await instance.post("/enroll", {
          student_id: Student_id,
          course_id: course_id,

        },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        toast.success(`${username} successfully enroll for course`);
      }
    } catch (error) {
      console.error("Enrollment error:", error.response?.data || error.message);
      toast.error(error.response?.data?.detail || "Enrollment failed");
    }
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
          <Sidebar menuItems={menuItems} handleLogout={handleLogout} heading={"🎓 College Portal"} />
        </aside>
      )}

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
      {userAuth && (
        // Main content
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

            {/* For mobile view */}
            <div className="flex items-center space-x-2 sm:space-x-4">
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

          {
            activeState === "attendance" ? <Attendance /> : activeState === "courses" ? <Available_courses Enroll_course={Enroll_course} /> :
              activeState === "assignment" ? <Assignment /> : activeState === "notices" ? <Notices /> : "NOT FOUND"
          }
        </div>
      )}

    </div >
  );
}
