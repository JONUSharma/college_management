import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Fetch_course_Thunk } from '../Store/Courses/CourseThunk';
import CourseCard from './Courses/CourseCard';
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

            {/* Courses cardsb*/}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {
                    courses && courses.length > 0 ?
                        (
                            courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    role={role}
                                    Enroll_course={Enroll_course}
                                />
                            )))
                        : <p className="text-gray-500">No courses created yet.</p>
                }
            </div>
        </div>
    );
};

export default Available_courses;
