import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Fetch_student_enroll_course_Thunk } from '../../Store/Courses/CourseThunk';
import { fetchCurrentUser } from '../../Store/Auth/AuthThunk';
const Student_Enroll_course = () => {
    const dispatch = useDispatch();
    const { student_enroll } = useSelector((state) => state.CourseSlice);
    const { token, current_user } = useSelector((state) => state.auth);
    const student_id = current_user?.id

    useEffect(() => {
        dispatch(fetchCurrentUser(token));

    }, [dispatch])
    useEffect(() => {
        if (student_id) {
            dispatch(Fetch_student_enroll_course_Thunk({ token, student_id }));
        }
    })




    return (
        <div>
            <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Courses that you enrolled</h1>
            <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
                <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                        <tr>
                            <th className="px-6 py-4 font-semibold"> Id</th>
                            <th className="px-6 py-4 font-semibold">Student ID</th>
                            <th className="px-6 py-4 font-semibold">Course ID</th>
                            <th className="px-6 py-4 font-semibold">Course Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student_enroll && student_enroll.length > 0 ? (
                            student_enroll.map((item, idx) => (
                                <tr
                                    key={item.id}
                                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-indigo-50 transition`}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4">{item.student_id}</td>
                                    <td className="px-6 py-4">{item.course_id}</td>
                                    <td className="px-6 py-4">{item.course_name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-8 text-center text-gray-500 italic"
                                >
                                    No Enroll course available 📭
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Student_Enroll_course
