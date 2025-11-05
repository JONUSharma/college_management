import React, { useState } from "react";
import CourseModel from "./CourseModel";
import { useDispatch, useSelector } from "react-redux";
import { delete_course_Thunk, Fetch_course_Thunk } from "../../Store/Courses/CourseThunk";

const CourseCard = ({ course, Enroll_course, role }) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    // Delete course
     const delete_course = (id) => {
       dispatch(delete_course_Thunk(id))
         .unwrap()
         .then(() => {
           dispatch(Fetch_course_Thunk())
        //    toast.success("✅ Course deleted")
         })
        //  .catch((err) => toast.error(err));
     };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col">
                <img
                loading="lazy"
                    src={
                        course.thumbnail_url ||
                        `https://picsum.photos/seed/${course.id}/300/180`
                    }
                    alt={course.Course_name}
                    className="rounded-xl h-40 w-full object-cover"
                />
                <h2 className="text-xl font-semibold mt-3">{course.Course_name}</h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    Course Description : {course.Course_desc || "No description available."}
                </p>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>Course Duration : {course.Course_duration}</span>
                    <span>Course Department{course.Course_department}</span>
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        View
                    </button>

                    {role === "student" && (
                        <button
                            onClick={() => Enroll_course(course.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Enroll
                        </button>
                    )}
                    {role === "admin" && (
                        <button
                            onClick={()=> delete_course(course.id)} 
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                    )}

                </div>
            </div>

            {showModal && (
                <CourseModel
                    course={course}
                    closeModal={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default CourseCard;
