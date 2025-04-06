
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [showNameField, setShowNameField] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/login", {
        phone,
        name: showNameField ? name : undefined,
      });

      if (res.data.new_user) {
        setShowNameField(true);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      alert(`Welcome ${res.data.name} (${res.data.role})`);

      switch (res.data.role) {
        case "admin":
          navigate("/admin");
          break;
        case "owner":
          navigate("/owner");
          break;
        case "valet":
          navigate("/valet");
          break;
        case "user":
          navigate("/book");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Login</h2>
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginBottom: 10, width: "100%" }}
      />
      {showNameField && (
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: 10, width: "100%" }}
        />
      )}
      <button onClick={handleLogin} style={{ width: "100%" }}>
        {showNameField ? "Register" : "Login"}
      </button>
    </div>
  );
}

export default Login;
