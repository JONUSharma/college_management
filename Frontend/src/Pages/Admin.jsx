import { useState, useEffect } from "react";
import { Users, Shield, BookOpen, Bell, BarChart,LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [username, setUserName] = useState("");
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
    navigate("/");
  };
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">⚙️ Admin Panel</h2>
        <nav className="space-y-3">
          <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 w-full text-left">
            <BarChart className="w-5 h-5" /> <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 w-full text-left">
            <Users className="w-5 h-5" /> <span>Manage Users</span>
          </button>
          <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 w-full text-left">
            <Shield className="w-5 h-5" /> <span>Roles</span>
          </button>
          <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 w-full text-left">
            <BookOpen className="w-5 h-5" /> <span>Courses</span>
          </button>
          <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 w-full text-left">
            <Bell className="w-5 h-5" /> <span>Notices</span>
          </button>
           <button
          onClick={handleLogout}
          className="flex absolute bottom-3 w-36 items-center space-x-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome, Admin 👋 {username}</h1>
       
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Users className="text-indigo-600 w-8 h-8 mb-2" />
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-gray-600">1200</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <BookOpen className="text-green-600 w-8 h-8 mb-2" />
            <h2 className="text-lg font-semibold">Courses</h2>
            <p className="text-gray-600">32</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Bell className="text-orange-600 w-8 h-8 mb-2" />
            <h2 className="text-lg font-semibold">Notices</h2>
            <p className="text-gray-600">15</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Shield className="text-red-600 w-8 h-8 mb-2" />
            <h2 className="text-lg font-semibold">Admins</h2>
            <p className="text-gray-600">3</p>
          </div>
        </div>

        {/* User Management Table (skeleton example) */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">User Management</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Email</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">John Doe</td>
                <td className="p-2">Student</td>
                <td className="p-2">john@example.com</td>
                <td className="p-2">
                  <button className="px-2 py-1 bg-green-500 text-white rounded text-sm">
                    Edit
                  </button>
                  <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm">
                    Delete
                  </button>
                </td>
              </tr>
              {/* Map more users here */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
