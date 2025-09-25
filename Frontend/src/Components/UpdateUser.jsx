import { useState, useEffect } from "react";
import instance from "./Axios/instance";
import { toast } from "react-toastify";

const UserUpdateForm = ({ userId, onClose, onUpdated }) => {
    const [formData, setFormData] = useState({
        username: "",
        role: ""
    });
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await instance.put(`/users/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            onUpdated(); // refresh table in AllUsers
            onClose(); // close modal
            toast.success("User updated successfully.")
        } catch (err) {
            console.error(err);
            toast.error("❌ Failed to update user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-96 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-lg"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">Update User Detail</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User ID */}
                    <div>
                        <p className="text-center font-semibold p-2 bg-gray-100 rounded-md">
                            User ID: {userId}
                        </p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg shadow focus:ring focus:ring-blue-100"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                        >
                            <option value="">Select Role</option>
                            <option value="student">student</option>
                            <option value="Hod">Hod</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Teacher Assistant">Teacher Assistant</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? "Updating..." : "Update User"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserUpdateForm;
