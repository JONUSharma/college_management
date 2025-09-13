import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, ClipboardList, Bell, LogOut } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const [username, setUserName] = useState("");
    // Redirect if user not logged in (check token)
    useEffect(() => {
        const token = localStorage.getItem("token");
        const Username = localStorage.getItem("username")
        if (!token) {
            navigate("/auth"); // redirect back to login
        }
        else {
            setUserName(Username || "Student")
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-700 text-white flex flex-col p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-8">🎓 College Portal</h2>
                <nav className="space-y-4 flex-1">
                    <button
                        onClick={() => navigate("/courses")}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition w-full text-left"
                    >
                        <BookOpen className="w-5 h-5" />
                        <span>My Courses</span>
                    </button>
                    <button
                        onClick={() => navigate("/attendance")}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition w-full text-left"
                    >
                        <Calendar className="w-5 h-5" />
                        <span>Attendance</span>
                    </button>
                    <button
                        onClick={() => navigate("/assignments")}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition w-full text-left"
                    >
                        <ClipboardList className="w-5 h-5" />
                        <span>Assignments</span>
                    </button>
                    <button
                        onClick={() => navigate("/notices")}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition w-full text-left"
                    >
                        <Bell className="w-5 h-5" />
                        <span>Notices</span>
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Welcome back, {username}!
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Here’s an overview of your academics 📊
                        </p>
                    </div>
                </header>

                {/* Dashboard content */}
                <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        onClick={() => navigate("/courses")}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
                    >
                        <BookOpen className="text-indigo-600 w-10 h-10 mb-2" />
                        <h2 className="font-semibold text-lg">My Courses</h2>
                        <p className="text-gray-500 text-sm">
                            View enrolled courses & materials
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/attendance")}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
                    >
                        <Calendar className="text-green-600 w-10 h-10 mb-2" />
                        <h2 className="font-semibold text-lg">Attendance</h2>
                        <p className="text-gray-500 text-sm">
                            Check your daily & monthly attendance
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/assignments")}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
                    >
                        <ClipboardList className="text-orange-600 w-10 h-10 mb-2" />
                        <h2 className="font-semibold text-lg">Assignments</h2>
                        <p className="text-gray-500 text-sm">
                            Submit assignments and check grades
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/notices")}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
                    >
                        <Bell className="text-red-600 w-10 h-10 mb-2" />
                        <h2 className="font-semibold text-lg">Notices</h2>
                        <p className="text-gray-500 text-sm">
                            Stay updated with college announcements
                        </p>
                    </div>
                </main>

                {/* Announcements */}
                {/* <section className="bg-white shadow-inner p-6 mt-4 mx-8 rounded-xl">
          <h2 className="font-bold text-lg mb-3">📢 Latest Announcements</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Semester exams start from 20th Sept</li>
            <li>Workshop on AI/ML scheduled for next week</li>
            <li>Submit assignments before 18th Sept</li>
          </ul>
        </section> */}
            </div>
        </div>
    );
}
