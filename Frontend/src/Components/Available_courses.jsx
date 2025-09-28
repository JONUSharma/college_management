import React from 'react'
import instance from "../Components/Axios/instance";
import { useEffect, useState } from "react";

const Available_courses = ({ delete_course, Enroll_course }) => {
    const [courses, setCourses] = useState([]);
    const role = localStorage.getItem("role")
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
        <div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Available Courses</h3>
                {courses.length > 0 ? (
                    <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Course Name</th>
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
                                    {
                                        role === "admin" ? <td className="border p-2 space-x-2">
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
                                        </td> :
                                            <td>
                                                <button onClick={() => Enroll_course(course.id)} className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded">
                                                    Enroll
                                                </button>
                                            </td>
                                    }

                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">No courses created yet.</p>
                )}
            </div>
        </div>
    )
}

export default Available_courses
