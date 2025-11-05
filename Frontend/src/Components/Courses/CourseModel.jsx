import React, { useEffect, useState } from "react";

const CourseModal = ({ course, closeModal }) => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    // Fetch course materials (PDFs)
    fetch(`http://localhost:8000/courses/${course.id}/materials`)
      .then((res) => res.json())
      .then((data) => setMaterials(data))
      .catch((err) => console.error("Failed to load materials", err));
  }, [course.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl"
        >
          &times;
        </button>

        {/* Course image */}
        <img
          src={
            course.thumbnail_url ||
            `https://picsum.photos/seed/${course.id}/300/180`
          }
          alt={course.Course_name}
          className="rounded-xl w-full h-52 object-cover"
        />

        {/* Course info */}
        <h2 className="text-2xl font-bold mt-4">{course.Course_name}</h2>
        <p className="text-gray-700 mt-2">{course.Course_desc}</p>

        <div className="mt-4 grid grid-cols-2 gap-4 text-gray-600 text-sm">
          <p><strong>Teacher:</strong> {course.teacher_Name}</p>
          <p><strong>Department:</strong> {course.Course_department}</p>
          <p><strong>Duration:</strong> {course.Course_duration}</p>
          <p><strong>Credits:</strong> {course.Course_credit}</p>
        </div>

        {/* Study Materials Section */}
        <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-inner">
          <h3 className="text-lg font-semibold mb-3">Study Materials</h3>
          {materials.length > 0 ? (
            <ul className="space-y-3">
              {materials.map((file, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
                >
                  <span className="text-gray-800 font-medium">
                    {file.title}
                  </span>
                  <a
                    href={file.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View / Download
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              No study materials uploaded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
