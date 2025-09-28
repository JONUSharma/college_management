import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import instance from "../Components/Axios/instance"
const Attendance = ({ courseId, students }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [userAuth, setUserAuth] = useState(false);

  const fetchAttendanceRecords = async () => {
    try {
      if (role === "student") {
        const res = await instance.get("/attendance/student/me"); // backend returns attendance of current student
        setAttendanceRecords(res.data);
      } else {
        const res = await instance.get("/attendance/"); // all students attendance for teacher/admin
        setAttendanceRecords(res.data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    if (token) {
      setUserAuth(true);
      if (role === "teacher" || role === "admin") {
        const initialData = {};
        students?.forEach((s) => (initialData[s.id] = "Present"));
        setAttendanceData(initialData);
      }
    } else {
      setUserAuth(false);
      navigate("/auth")
    }
  }, [students]);

  const handleChange = (studentId, value) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        attendances: students.map((s) => ({
          student_id: s.id,
          course_id: courseId,
          status: attendanceData[s.id],
        })),
      };
      await instance.post("/attendance/bulk/", payload);
      alert("Attendance submitted successfully!");
      fetchAttendanceRecords();
    } catch (error) {
      console.error(error);
      alert("Error submitting attendance");
    }
  };
  return (
    <div>
      {
        userAuth ? <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Attendance</h1>

          {role === "student" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">My Attendance</h2>
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th>Course</th>
                      <th>Teacher</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceRecords.map((rec) => (
                      <tr key={rec.id}>
                        <td className="px-6 py-4">{rec.course_name}</td>
                        <td className="px-6 py-4">{rec.teacher_name}</td>
                        <td className={`px-6 py-4 font-semibold ${rec.status === "Present" ? "text-green-600" : "text-red-600"}`}>{rec.status}</td>
                        <td className="px-6 py-4">{new Date(rec.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(role === "teacher" || role === "admin") && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Attendance</h2>
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th>Student</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students?.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4">{student.name}</td>
                        <td className="px-6 py-4">
                          <select
                            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={attendanceData[student.id]}
                            onChange={(e) => handleChange(student.id, e.target.value)}
                          >
                            <option>Present</option>
                            <option>Absent</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition"
                >
                  Submit Attendance
                </button>
              </div>
            </div>
          )}

          {role === "Hod" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Department Attendance Overview</h2>
              {/* HOD can only view attendance, maybe add approve/feedback later */}
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Teacher</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceRecords.map((rec) => (
                      <tr key={rec.id}>
                        <td className="px-6 py-4">{rec.student_name}</td>
                        <td className="px-6 py-4">{rec.course_name}</td>
                        <td className="px-6 py-4">{rec.teacher_name}</td>
                        <td className={`px-6 py-4 font-semibold ${rec.status === "Present" ? "text-green-600" : "text-red-600"}`}>{rec.status}</td>
                        <td className="px-6 py-4">{new Date(rec.date).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                          <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div> :
          <div>
            <h1>TO access courses you should login first</h1>
          </div>
      }

    </div>
  )
}


export default Attendance
