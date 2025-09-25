import React from "react";
export default function Sidebar({ menuItems, handleLogout, heading }) {
  return (
    <aside className="w-64 bg-indigo-700 text-white p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">{heading}</h2>
      <div>
        <nav className="space-y-3">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 w-full text-left"
            >
              <item.icon className="w-5 h-5" /> <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex fixed bottom-3 w-36 items-center space-x-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition mt-4"
          >
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
