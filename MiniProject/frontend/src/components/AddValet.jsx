import { useState } from "react";
import axios from "axios";

function AddValet() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleAddValet = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/add-valet",
        { name, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      setName("");
      setPhone("");
    } catch (err) {
      const msg = err.response?.data?.error || "Error adding valet";
      setMessage(msg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Add Valet Parker</h2>
      <input
        type="text"
        placeholder="Valet Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="tel"
        placeholder="Valet Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={handleAddValet} style={{ width: "100%" }}>
        Add Valet
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}

export default AddValet;
