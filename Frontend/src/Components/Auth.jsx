import { useState } from "react";
import instance from "./Axios/instance";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset old error
    setLoading(true);

    try {
      if (!isLogin) {
        // validate confirm password
        if (values.password !== values.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return; // stop execution
        }

        // SIGNUP
        const signupPayload = {
          username: values.username,
          email: values.email,
          password: values.password
        };
        await instance.post("/register", signupPayload, {
          headers: { "Content-Type": "application/json" }
        });

        // After signup, auto-login
        const loginPayload = {
          username: values.username,
          password: values.password
        };
        const loginRes = await instance.post("/login", loginPayload, {
          headers: { "Content-Type": "application/json" }
        });

        saveUserAndRedirect(loginRes.data);
        toast.success("✅ User signup successfully")
      } else {
        // LOGIN
        const loginPayload = {
          username: values.username || values.email,
          password: values.password
        };
        const loginRes = await instance.post("/login", loginPayload, {
          headers: { "Content-Type": "application/json" }
        });

        saveUserAndRedirect(loginRes.data);
        toast.success("✅ Login successfully")
      }
    } catch (err) {
      console.error("Auth error:", err);
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
      toast.error(message)
    } finally {
      setLoading(false);
    }
  };

  // Save token & redirect based on role
  const saveUserAndRedirect = (data) => {
    if (data?.access_token) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data?.user?.role);
      localStorage.setItem("username", data?.user?.username);

      const role = data?.user?.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/img1.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-11/12 max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left side - description */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-indigo-600 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Welcome to College Portal 🎓
          </h2>
          <p className="text-lg leading-relaxed">
            Manage your academics, connect with teachers, and access resources
            all in one place.
          </p>
        </div>

        {/* Right side - form */}
        <div className="flex flex-col justify-center p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="email"
                placeholder="Email"
                value={values.email}
                name="email"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
                required
              />
            )}

            <input
              type="text"
              placeholder="Username"
              value={values.username}
              name="username"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={values.password}
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
              required
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={values.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
                required
              />
            )}

            {/* Error message */}
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {/* Switch between login/signup */}
          <p className="text-center mt-4 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setValues({
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: ""
                });
                setError("");
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
          <div className = "flex justify-center">
            {
              isLogin && (
                <Link to="/forget-password" className="text-blue-600 font-semibold hover:underline">Forget Password</Link>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
