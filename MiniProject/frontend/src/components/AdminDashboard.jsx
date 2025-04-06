import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      alert("Unauthorized access");
      navigate("/login");
      return;
    }

    // You can decode the token or store name separately
    // For demo purpose, using a hardcoded value or use a user API
    setName("Admin");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const goToOwnadd = () => {
    navigate("/addmall");
   
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {name}</h2>
      <h3>This is the Admin Dashboard</h3>
      <button onClick={goToOwnadd}>Owner Adding</button>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
