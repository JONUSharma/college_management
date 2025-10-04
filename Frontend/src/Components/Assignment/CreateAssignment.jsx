import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import instance from "../Axios/instance";
import { create_assignment_Thunk } from "../../Store/Assignment/AssignmentThunk";

const CreateAssignment = () => {
    const [formData, setFormData] = useState({
        assignment_name: "",
        title: "",
        file: "",
    });

    const { courses } = useSelector((state) => state.CourseSlice);
    const [Student_id, setStudent_id] = useState("");
    const [course_id, setCourse_id] = useState("");
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

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
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const assignmentPayload = {
            assignment_name: formData.assignment_name,
            title: formData.title,
            file_url: formData.file,
            student_id: Student_id,
            course_id: course_id,
        };
        try {
            dispatch(create_assignment_Thunk(assignmentPayload))
                .then(() => {
                    setFormData({
                        assignment_name: "",
                        title: "",
                        file: "",
                    });
                    toast.success("✅ Assignment created");
                })
                .catch((err) => toast.error(err));
        } catch (error) {
            toast.error("❌ Failed to create assignment.");
            console.error("Error creating assignment:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Create Assignment
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Assignment Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your assignment Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            onChange={handleChange}
                            placeholder="Assignment Name or some description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Course Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Course
                        </label>
                        <select
                            name="course_id"
                            onChange={(e) => setCourse_id(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">-- Select Course --</option>
                            {courses?.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.Course_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Assignment File
                        </label>
                        <input
                            type="file"
                            name="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleChange}
                            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 
                             file:rounded-lg file:border-0 
                            file:text-sm file:font-semibold 
                             file:bg-blue-600 file:text-white 
                             hover:file:bg-blue-700 cursor-pointer"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Supported formats: PDF, DOC, DOCX, JPG, PNG
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200"
                    >
                        Submit Assignment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAssignment;
