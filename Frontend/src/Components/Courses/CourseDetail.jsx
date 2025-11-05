import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    // Fetch course details
    fetch(`http://localhost:8000/courses/${id}`)
      .then(res => res.json())
      .then(data => setCourse(data));

    // Fetch PDF materials
    fetch(`http://localhost:8000/courses/${id}/materials`)
      .then(res => res.json())
      .then(data => setMaterials(data));
  }, [id]);

  if (!course) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <img
        src={course.thumbnail_url || "https://via.placeholder.com/600x300?text=Course+Image"}
        alt={course.Course_name}
        className="rounded-2xl w-full h-64 object-cover"
      />
      <h1 className="text-3xl font-bold mt-6">{course.Course_name}</h1>
      <p className="text-gray-700 mt-3">{course.Course_desc}</p>

      <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Study Materials</h2>
        {materials.length > 0 ? (
          <ul className="space-y-3">
            {materials.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                <span className="text-gray-800 font-medium">{file.title}</span>
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
          <p className="text-gray-500">No study materials added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
