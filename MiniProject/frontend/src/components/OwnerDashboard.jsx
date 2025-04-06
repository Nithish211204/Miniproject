import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2>Welcome, {name} (Owner)</h2>

      <div style={styles.actions}>
        <button onClick={() => navigate("/addvalet")}>
          ➕ Add Valet Parker
        </button>

        <button onClick={() => navigate("/owner/valets")}>
          👀 View Valets
        </button>

        <button onClick={handleLogout} style={styles.logout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: "auto",
    textAlign: "center",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    marginTop: 50,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: 30,
  },
  logout: {
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    padding: 10,
    borderRadius: 5,
  },
};

export default OwnerDashboard;
