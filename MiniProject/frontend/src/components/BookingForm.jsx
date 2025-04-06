
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookingForm() {
  const [carNumber, setCarNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [mallName, setMallName] = useState('');
  const [pincode, setPincode] = useState('');
  const [message, setMessage] = useState('');
  const [malls, setMalls] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/malls')
      .then(res => {
        setMalls(res.data);
        const allDistricts = [...new Set(res.data.map(m => m.district))];
        setDistricts(allDistricts);
      })
      .catch(err => console.error("Error fetching malls:", err));
  }, []);

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
    setMallName('');
    setArea('');
    setPincode('');
  };

  const handleMallChange = (e) => {
    const selectedName = e.target.value;
    setMallName(selectedName);
    const selectedMall = malls.find(
      m => m.name === selectedName && m.district === district
    );

    if (selectedMall) {
      console.log("Selected mall:", selectedMall);
      setArea(selectedMall.area || '');
      setPincode(selectedMall.pincode || '');
    } else {
      setArea('');
      setPincode('');
    }
  };

  const bookSlot = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("Please login to continue.");
      return;
    }

    const payload = {
      car_number: carNumber,
      time_slot: timeSlot,
      district,
      area,
      mall_name: mallName,
      pincode
    };

    console.log("Booking payload:", payload);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/book',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.msg || "Booking successful");
      setCarNumber('');
      setTimeSlot('');
      setDistrict('');
      setMallName('');
      setArea('');
      setPincode('');
    } catch (error) {
      console.error("Booking failed:", error);
      setMessage("Booking failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <h2>Book Parking Slot</h2>
      <input
        type="text"
        value={carNumber}
        onChange={e => setCarNumber(e.target.value)}
        placeholder="Car Number"
      />
      <input
        type="text"
        value={timeSlot}
        onChange={e => setTimeSlot(e.target.value)}
        placeholder="Time Slot"
      />
      <select value={district} onChange={handleDistrictChange}>
        <option value="">Select District</option>
        {districts.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {district && (
        <select value={mallName} onChange={handleMallChange}>
          <option value="">Select Mall</option>
          {malls.filter(m => m.district === district).map(m => (
            <option key={m._id} value={m.name}>
              {m.name} ({m.area}, {m.pincode})
            </option>
          ))}
        </select>
      )}

      <button onClick={bookSlot}>Book Slot</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default BookingForm;
