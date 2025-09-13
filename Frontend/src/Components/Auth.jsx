import { useState } from "react";
import instance from "./Axios/instance";
import { useNavigate } from "react-router-dom";
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [getValue, setValue] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const HandleChange = (e) => {
    setValue(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // LOGIN flow: send only login request
        const payload = {
          // backend may accept username; if user typed email, fallback to email
          username: getValue.username || getValue.email,
          password: getValue.password
        };

        const Login_result = await instance.post("/login", payload, {
          headers: { "Content-Type": "application/json" }
        });

        console.log("login result:", Login_result.data);
        // save token if backend provides it
        if (Login_result.data?.access_token) {
          localStorage.setItem("token", Login_result.data.access_token);
          localStorage.setItem("username", getValue.username)
        }
        Navigate("/dashboard")
        alert("Login successful");
      } else {
        // SIGNUP flow: call register, then optionally login automatically
        const signupPayload = {
          username: getValue.username,
          email: getValue.email,
          password: getValue.password
        };

        const Signup_result = await instance.post("/register", signupPayload, {
          headers: { "Content-Type": "application/json" }
        });

        console.log("signup result:", Signup_result.data);
        alert("Signup successful");

        // optional: auto-login after signup
        const loginPayload = {
          username: getValue.username || getValue.email,
          password: getValue.password
        };
        const Login_result = await instance.post("/login", loginPayload, {
          headers: { "Content-Type": "application/json" }
        });
        if (Login_result.data?.access_token) {
          localStorage.setItem("token", Login_result.data.access_token);
          localStorage.setItem("username", getValue.username);
        }
        Navigate("/dashboard")
        alert("Auto-login successful");
      }
    } catch (err) {
      console.error("auth error:", err);
      // Show a friendly message (axios error details)
      const message = err.response?.data?.detail || err.response?.data || err.message;
      alert(message);
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-bold mb-4">Welcome to College Portal 🎓</h2>
          <p className="text-lg leading-relaxed">
            Manage your academics, connect with teachers, and access resources all in one place.
          </p>
        </div>

        {/* Right side - form */}
        <div className="flex flex-col justify-center p-8">
          <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? "Login" : "Sign Up"}</h2>

          <form className="space-y-4" onSubmit={HandleSubmit}>
            {!isLogin && (
              <input
                type="email"
                placeholder="Email"
                value={getValue.email}
                name="email"
                onChange={HandleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
                required={!isLogin}
              />
            )}

            <input
              type="text"
              placeholder="Username"
              value={getValue.username}
              name="username"
              onChange={HandleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={getValue.password}
              name="password"
              onChange={HandleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-400 outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Please wait..." : (isLogin ? "Login" : "Sign Up")}
            </button>
          </form>

          {/* Switch between login/signup - NOTE type="button" */}
          <p className="text-center mt-4 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                // clear form when switching
                setValue({ username: "", email: "", password: "" });
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
