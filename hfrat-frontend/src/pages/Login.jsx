import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🔹 clear old auth before new login
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // ✅ STORE AUTH DATA
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      // ✅ ROLE-BASED REDIRECT (ONLY PLACE THIS HAPPENS)
      if (data.role === "REPORTER") {
        navigate("/report", { replace: true });
      } else if (data.role === "MONITOR") {
        navigate("/dashboard", { replace: true });
      } else {
        alert("Unknown role");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
