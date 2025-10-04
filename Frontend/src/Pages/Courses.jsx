import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Available_courses from "../Components/Available_courses";
import {
  create_course_Thunk,
  delete_course_Thunk,
  Fetch_course_Thunk,
  Update_course_thunk,
} from "../Store/Courses/CourseThunk";

const CourseManagement = () => {
  const dispatch = useDispatch();
  const [editingCourse, setEditingCourse] = useState(null);

  // form state with all fields initialized
  const [formData, setFormData] = useState({
    course_name: "",
    credits: "",
    department: "",
    teacher_Name: "",
    duration: "",
    description: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch courses on component mount
  useEffect(() => {
    dispatch(Fetch_course_Thunk());
  }, [dispatch]);

  // Handle submit (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      Course_name: formData.course_name,
      Course_credit: formData.credits,
      Course_department: formData.department,
      Course_desc: formData.description,
      Course_duration: formData.duration,
      teacher_Name: formData.teacher_Name,
    };

    if (editingCourse) {
      dispatch(Update_course_thunk({ id: editingCourse.id, courseData: payload }))
        .unwrap()
        .then(() => toast.success("✅ Course updated"))
        .catch((err) => toast.error(err));
    } else {
      dispatch(create_course_Thunk(payload))
        .unwrap()
        .then(() => {
          toast.success("✅ Course created")
        })
        .catch((err) => toast.error(err));
    }

    // Reset form
    setEditingCourse(null);
    setFormData({
      course_name: "",
      credits: "",
      department: "",
      teacher_Name: "",
      duration: "",
      description: "",
    });
  };

  // Delete course
  const delete_course = (id) => {
    dispatch(delete_course_Thunk(id))
      .unwrap()
      .then(() => {
        dispatch(Fetch_course_Thunk())
        toast.success("✅ Course deleted")
      })
      .catch((err) => toast.error(err));
  };

  // Fill form when editing
  const startEditing = (course) => {
    setEditingCourse(course);
    setFormData({
      course_name: course.Course_name || "",
      credits: course.Course_credit || "",
      department: course.Course_department || "",
      teacher_Name: course.teacher_Name || "",
      duration: course.Course_duration || "",
      description: course.Course_desc || "",
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📚 Course Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="text"
          name="course_name"
          placeholder="Course Name"
          value={formData.course_name}
          onChange={handleChange}
          className="w-1/3 p-2 m-2 border rounded"
          required
        />
        <input
          type="number"
          name="credits"
          placeholder="Credits"
          value={formData.credits}
          onChange={handleChange}
          className="w-1/3 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department name"
          value={formData.department}
          onChange={handleChange}
          className="w-1/3 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Course Duration Month"
          value={formData.duration}
          onChange={handleChange}
          className="w-1/3 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="teacher_Name"
          placeholder="Teacher Name"
          value={formData.teacher_Name}
          onChange={handleChange}
          className="w-1/3 p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Course description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${editingCourse ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          {editingCourse ? "Update Course" : "Create Course"}
        </button>
      </form>

      {/* Course list */}
      <Available_courses
        delete_course={delete_course}
        startEditing={startEditing} // pass editing function to Available_courses
      />
    </div>
  );
};

export default CourseManagement;
