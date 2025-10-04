import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_assignment_Thunk } from "../../Store/Assignment/AssignmentThunk";

const FetchAssignment = () => {
  const { assignment, loading } = useSelector((state) => state.assignment);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Fetch_assignment_Thunk());
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📚 Review Student Assignments
        </h1>

        {/* Table Container */}
        
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 font-semibold">Assignment Id</th>
                <th className="px-6 py-4 font-semibold">Student ID</th>
                <th className="px-6 py-4 font-semibold">Course ID</th>
                <th className="px-6 py-4 font-semibold">Assignment Title</th>
                <th className="px-6 py-4 font-semibold">Assignment File</th>
              </tr>
            </thead>
            <tbody>
              {assignment && assignment.length > 0 ? (
                assignment.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50 transition`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.id}
                    </td>
                    <td className="px-6 py-4">{item.student_id}</td>
                    <td className="px-6 py-4">{item.course_id}</td>
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        View File
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500 italic"
                  >
                    No assignments available 📭
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FetchAssignment;
