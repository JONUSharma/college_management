import { useEffect, useState } from "react";
import instance from "../Components/Axios/instance";
import Available_courses from "../Components/Available_courses";
import { toast } from "react-toastify";
const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null); // track editing course

  // form state
  const [formData, setFormData] = useState({
    course_name: "",
    credits: "",
    department: "",
    duration: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const coursePayload = {
        Course_name: formData.course_name,
        Course_credit: formData.credits,
        Course_department: formData.department,
        Course_desc: formData.description,
        Course_duration: formData.duration,
      };

      const token = localStorage.getItem("token");
      const result = await instance.post("/create-course", coursePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCourses((prev) => [...prev, result.data]);

      setFormData({
        course_name: "",
        credits: "",
        department: "",
        duration: "",
        description: "",
      });
      if(result.data)
      {
        toast.success("✅ Course created successfully")
      }
      if(!result.data)
      {
        toast.error("Error in creating course")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("❌ Error creating course:", error.response?.data || error.message);
    }
  };

    // ✅ Update existing course
    const handleUpdate = async (id) => {
      try {
        const token = localStorage.getItem("token");
        const coursePayload = {
          Course_name: formData.course_name,
          Course_credit: formData.credits,
          Course_department: formData.department,
          Course_desc: formData.description,
          Course_duration: formData.duration,
        };
        const result = await instance.put(`/update-course/${id}`, coursePayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // update state
        setCourses((prev) =>
          prev.map((course) => (course.id === id ? result.data.course : course))
        );
        toast.success("Course updated succesfully.")
        // reset form & editing state
        setEditingCourse(null);
        setFormData({
          course_name: "",
          credits: "",
          department: "",
          duration: "",
          description: "",
        });
        console.log(result.data)
      } catch (error) {
        console.error("Error updating course", error.response?.data || error.message);
      }
    };
  
    const delete_course = async (id) => {
      try {
        const token = localStorage.getItem("token");
        await instance.delete(`/delete-course/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // ✅ remove from UI without refresh
        setCourses((prev) => prev.filter((course) => course.id !== id));
        toast.success("Course deleted successfully")
      } catch (error) {
        toast.error("Error in deleting course")
        console.log("Error in deleting course", error.response?.data || error.message);
      }
    };
  
    const Fetch_courses = async () => {
      try {
        const courses = await instance.get("/fetch-courses");
        setCourses(courses.data);
      } catch (error) {
        console.log("Error in fetching courses :", error);
      }
    };
  
    useEffect(() => {
      Fetch_courses();
    }, []);
  
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">📚 Course Management</h2>
  
        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editingCourse ? handleUpdate(editingCourse.id) : handleSubmit(e);
          }}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
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
  
        {/* Show Courses */}
        {/* <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Available Courses</h3>
          {courses.length > 0 ? (
            <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Credits</th>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Duration</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="text-center">
                    <td className="border p-2">{course.id}</td>
                    <td className="border p-2">{course.Course_name}</td>
                    <td className="border p-2">{course.Course_credit}</td>
                    <td className="border p-2">{course.Course_department}</td>
                    <td className="border p-2">{course.Course_duration}</td>
                    <td className="border p-2">{course.Course_desc}</td>
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setFormData({
                            course_name: course.Course_name,
                            credits: course.Course_credit,
                            department: course.Course_department,
                            duration: course.Course_duration,
                            description: course.Course_desc,
                          });
                        }}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => delete_course(course.id)}
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No courses created yet.</p>
          )}
        </div> */}

        <Available_courses delete_course ={delete_course}/>
      </div>
    );
  };
  
  export default CourseManagement;
