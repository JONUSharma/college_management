import { useState } from "react";
import instance from "../Components/Axios/instance"; // axios instance
import {Link} from "react-router-dom"
export default function ForgetPassword() {
  const [step, setStep] = useState(1); // step 1 = request OTP, step 2 = reset password
  const [form, setForm] = useState({
    email: "",
    otp: "",
    new_password: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/forget-password", { email: form.email });
      setMessage(res.data.message || "OTP sent to your email");
      setStep(2); // move to reset step
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/reset-password", {
        email: form.email,
        otp: form.otp,
        new_password: form.new_password,
      });
      setMessage(res.data.message || "Password reset successful");
      setStep(1) // get back to step 1
      setForm({ email: "", otp: "", new_password: "" });
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm text-indigo-600">{message}</p>
        )}

        {step === 1 ? (
          // Step 1: Request OTP
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <span className="flex justify-center">
              <Link className="text-blue-400 hover:text-blue-600 font-semibold" to = "/auth">go back to login</Link>
            </span>
          </form>
        ) : (
          // Step 2: Reset password
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
            />
            <input
              type="password"
              name="new_password"
              placeholder="Enter new password"
              value={form.new_password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
