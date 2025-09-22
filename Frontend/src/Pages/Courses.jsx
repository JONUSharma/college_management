import { useState } from "react";

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    { id: 1, course_name: "Data Structures", credits: 4, department: "CSE" },
    { id: 2, course_name: "Operating Systems", credits: 3, department: "CSE" },
  ]);

  const [form, setForm] = useState({ id: null, course_name: "", credits: "", department: "" });
  const [editing, setEditing] = useState(false);

  // Generate next ID
  const getNextId = () => {
    if (courses.length === 0) return 1;
    return Math.max(...courses.map((c) => c.id)) + 1;
  };

  // Add course
  const addCourse = () => {
    if (!form.course_name || !form.credits) return alert("Please fill all fields");
    const newCourse = { ...form, id: getNextId() };
    setCourses([...courses, newCourse]);
    setForm({ id: null, course_name: "", credits: "", department: "" });
  };

  // Delete course
  const deleteCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  // Edit course
  const startEdit = (course) => {
    setForm(course);
    setEditing(true);
  };

  // Update course
  const updateCourse = () => {
    setCourses(courses.map((c) => (c.id === form.id ? form : c)));
    setForm({ id: null, course_name: "", credits: "", department: "" });
    setEditing(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📚 Course Management</h2>

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">{editing ? "Update Course" : "Add Course"}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Course Name"
            className="border p-2 flex-1 rounded"
            value={form.course_name}
            onChange={(e) => setForm({ ...form, course_name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Credits"
            className="border p-2 w-24 rounded"
            value={form.credits}
            onChange={(e) => setForm({ ...form, credits: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department"
            className="border p-2 flex-1 rounded"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
        </div>
        <button
          className={`px-4 py-2 rounded text-white ${
            editing ? "bg-green-500" : "bg-blue-500"
          }`}
          onClick={editing ? updateCourse : addCourse}
        >
          {editing ? "Update Course" : "Add Course"}
        </button>
        {editing && (
          <button
            className="ml-2 px-4 py-2 rounded bg-gray-500 text-white"
            onClick={() => {
              setForm({ id: null, course_name: "", credits: "", department: "" });
              setEditing(false);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Course List */}
      <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Course Name</th>
            <th className="border p-2">Credits</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="text-center">
              <td className="border p-2">{course.id}</td>
              <td className="border p-2">{course.course_name}</td>
              <td className="border p-2">{course.credits}</td>
              <td className="border p-2">{course.department}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => startEdit(course)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteCourse(course.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No courses available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourseManagement;
