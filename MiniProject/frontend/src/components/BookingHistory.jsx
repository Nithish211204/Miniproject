import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://127.0.0.1:5000/api/my-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch booking history:", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>📋 My Booking History</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b._id} style={{ marginBottom: '1em' }}>
              <strong>Mall:</strong> {b.mall_name} <br />
              <strong>Car No:</strong> {b.car_number} <br />
              <strong>Time Slot:</strong> {b.time_slot} <br />
              <strong>Status:</strong>{' '}
              <span style={{ color: b.status === 'booked' ? 'green' : 'orange' }}>
                {b.status}
              </span><br />
              <strong>Slot Number:</strong> {b.slot_number || 'Not assigned'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookingHistory;
