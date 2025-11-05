import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Fetch_course_Thunk } from "../Store/Courses/CourseThunk";
import { fetchCurrentUser, fetchUsers } from "../Store/Auth/AuthThunk";
import {
  Fetch_Attendance_Thunk,
  Submit_Attendance_Thunk,
} from "../Store/Attendance/AttendanceThunk";

const Attendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local storage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Local state
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [userAuth, setUserAuth] = useState(false);

  // Redux state
  const { attendance } = useSelector((state) => state.AttendanceSlice);
  const { courses } = useSelector((state) => state.CourseSlice);
  const { users } = useSelector((state) => state.auth);

  // console.log(attendance)

  // ✅ On mount → check login + fetch current user
  useEffect(() => {
    if (!token) {
      setUserAuth(false);
      navigate("/auth");
    } else {
      setUserAuth(true);
    }
  }, [token, navigate, dispatch]);

  // ✅ Fetch courses, users, attendance
  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token)).then((res) => {
        const user = res.payload;
        if (role === "student" && user?.id) {
          dispatch(Fetch_Attendance_Thunk({ role, studentId: user?.id }));
        } else {
          dispatch(Fetch_Attendance_Thunk({ role, studentId: null }));
        }
      });

      dispatch(Fetch_course_Thunk());
      dispatch(fetchUsers(token));
    }
  }, [dispatch, token, role]);

  // ✅ Handle attendance select change
  const handleChange = (studentId, value) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: value }));
  };

  // ✅ Submit attendance
  const handleSubmit = () => {
    if (!selectedCourse) {
      toast.error("Please select a course first.");
      return;
    }

    const attendancePayload = Object.keys(attendanceData).map((studentId) => ({
      student_id: Number(studentId),
      course_id: Number(selectedCourse),
      status: attendanceData[studentId],
    }));

    if (!attendancePayload.length > 0) {
      toast.error("Select the students first.");
      return;
    }
    dispatch(Submit_Attendance_Thunk({ token, attendancePayload }));
  };

  return (
    <div>
      {userAuth ? (
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Attendance</h1>

          {/* ================= Student View ================= */}
          {role === "student" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">My Attendance</h2>
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <tr>
                      <th className="p-2">Course ID</th>
                      <th className="p-2">Course Name</th>
                      <th className="p-2">Student ID</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-gray-200  divide-y   ">
                    {attendance.map((rec) => (
                      <tr key={rec.id}>
                        <td className="p-2 pl-10">{rec.course_id}</td>
                        <td className="p-2 ">{rec.course_name}</td>
                        <td className="pl-8">{rec.student_id}</td>
                        <td
                          className={`pl-8 py-4 font-semibold ${rec.status === "Present"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                        >
                          {rec.status}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(rec.date).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= Teacher/Admin View ================= */}
          {(role === "Teacher" || role === "admin") && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Manage Attendance</h2>

              {/* Select Course */}
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">
                  Select Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.Course_name}
                    </option>
                  ))}
                </select>
              </div>

              <h2 className="font-semibold mb-2">Students</h2>
              {users && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">Student ID</th>
                        <th className="px-6 py-3 text-left">Student Name</th>
                        <th className="px-6 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users
                        .filter((s) => s.role === "student")
                        .map((s) => (
                          <tr key={s.id}>
                            <td className="px-6 py-3">{s.id}</td>
                            <td className="px-6 py-3">{s.username}</td>
                            <td className="px-6 py-3">
                              <select
                                value={attendanceData[s.id] || "status"}
                                onChange={(e) =>
                                  handleChange(s.id, e.target.value)
                                }
                                className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="status">---Status---</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Submit Button */}
              {users.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition"
                  >
                    Submit Attendance
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= HOD View ================= */}
          {role === "Hod" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Department Attendance Overview
              </h2>
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map((rec) => (
                      <tr key={rec.id}>
                        <td className="px-6 py-4">{rec.student_id}</td>
                        <td className="px-6 py-4">{rec.course_id}</td>
                        <td
                          className={`px-6 py-4 font-semibold ${rec.status === "Present"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                        >
                          {rec.status}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(rec.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toast.success("Approved!")}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => toast.error("Rejected!")}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1>To access courses you should login first</h1>
        </div>
      )}
    </div>
  );
};

export default Attendance;
