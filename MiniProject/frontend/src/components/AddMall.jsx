import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddMall() {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Unauthorized");
      navigate("/login");
    }
  }, [navigate]);

  const handleAddMall = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://127.0.0.1:5000/api/malls",
        {
          name,
          area,
          district,
          pincode,
          phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Mall added successfully!");
      setName("");
      setArea("");
      setDistrict("");
      setPincode("");
      setPhone("");
    } catch (err) {
      console.error("Failed to add mall:", err);
      alert("Error adding mall");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Add Shopping Mall</h2>
      <input
        type="text"
        placeholder="Mall Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Area"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <input
        type="text"
        placeholder="District"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
         <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <button onClick={handleAddMall} style={{ width: "100%" }}>
        Add Mall
      </button>
    </div>
  );
}

export default AddMall;
