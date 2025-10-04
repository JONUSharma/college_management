import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Fetch_course_Thunk } from '../Store/Courses/CourseThunk';

const Available_courses = ({ delete_course, Enroll_course, startEditing }) => {
    const role = localStorage.getItem("role");
    const dispatch = useDispatch();

    // Get courses, loading, and error from Redux
    const { loading, error, courses } = useSelector((state) => state.CourseSlice);

    // Fetch courses on component mount
    useEffect(() => {
        dispatch(Fetch_course_Thunk());
    }, [dispatch]);



    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Available Courses</h3>

            {/* Loading and Error */}
            {loading && <p>Loading courses...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Courses Table */}
            {courses && courses.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
                    <table className="table-auto w-full border border-gray-300 bg-white shadow-md">
                        <thead className="bg-gradient-to-r from-indigo-500 to to-purple-600">
                            <tr>
                                <th className=" p-2">ID</th>
                                <th className=" p-2">Course Name</th>
                                <th className=" p-2">Credits</th>
                                <th className=" p-2">Teacher Name</th>
                                <th className=" p-2">Department</th>
                                <th className=" p-2">Duration</th>
                                <th className=" p-2">Description</th>
                                <th className=" p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id} className="text-center">
                                    <td className="border p-2">{course.id}</td>
                                    <td className="border p-2">{course.Course_name}</td>
                                    <td className="border p-2">{course.Course_credit}</td>
                                    <td className="border p-2">{course.teacher_Name}</td>
                                    <td className="border p-2">{course.Course_department}</td>
                                    <td className="border p-2">{course.Course_duration}</td>
                                    <td className="border p-2">{course.Course_desc}</td>
                                    {role === "admin" ? (
                                        <td className="border p-2 space-x-4 flex justify-center">
                                            <button
                                                onClick={() => {
                                                    startEditing(course)
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
                                    ) : (
                                        <td>
                                            <button
                                                onClick={() => Enroll_course(course.id)}
                                                className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                                            >
                                                Enroll
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : !loading && courses.length < 1 ? (
                <p className="text-gray-500">No courses created yet.</p>
            ) : ""}
        </div>
    );
};

export default Available_courses;
