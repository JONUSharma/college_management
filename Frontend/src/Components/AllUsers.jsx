import { useEffect, useState } from "react"
import instance from "./Axios/instance"
import UserUpdateForm from "./UpdateUser"
import { toast } from "react-toastify"
const AllUsers = () => {
    const [users, setUsers] = useState([])
    const [editingUser, setEditingUser] = useState(null);
    const token = localStorage.getItem("token")
    const Fetch_users = async () => {
        try {
            const result = await instance.get("/users/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            setUsers(result.data) // store only data
        } catch (err) {
            console.error("Error fetching users:", err)
        }
    }

    useEffect(() => {
        Fetch_users()
    }, [])

    const handleDelete = async (id) => {
        try {
            await instance.delete(`/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }});
            Fetch_users();
            toast.success("User deleted successfully.")
        } catch (err) {
            console.error(err);
            toast.error("Error in deleting user ", err)
        }
    };

    

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            {/* User Management Table */}
            <h2 className="text-lg font-bold mb-4">User Management</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Edit user</th>
                        <th className="p-2">Delete user</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((val) => {
                            return (
                                <tr key={val.id} className="border-b">
                                    <td className="p-2">{val.id}</td>
                                    <td className="p-2">{val.username}</td>
                                    <td className="p-2">{val.role}</td>
                                    <td className="p-2">{val.email}</td>
                                    <td className="p-2">
                                        {val.role === "admin" ?
                                            <button onClick={() => handleDelete(val.id)}
                                                    className="bg-gray-500  text-white px-3 py-1 rounded"
                                                    disabled={true} >
                                                    Not active
                                                </button> :
                                            <button onClick={() => { setEditingUser(val.id) }}
                                                className="bg-yellow-500 text-white px-5 py-1 rounded-lg hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>}</td>
                                    <td className="p-3">
                                        {
                                            val.role === "admin" ?
                                                <button
                                                    onClick={() => handleDelete(val.id)}
                                                    className="bg-gray-500  text-white px-3 py-1 rounded"
                                                    disabled={true}
                                                >
                                                    Not active
                                                </button> : <button
                                                    onClick={() => handleDelete(val.id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                        }


                                    </td>
                                </tr>
                            )
                        })
                    }


                </tbody>
            </table>
            {/* Show Update Form */}
            {editingUser && (
                <UserUpdateForm
                    userId={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdated={Fetch_users} // refresh user list after update
                />
            )}

        </div>
    )
}

export default AllUsers
