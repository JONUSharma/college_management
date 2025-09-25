import React from "react";

export default function Card({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Icon className={`${color} w-8 h-8 mb-2`} />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}
