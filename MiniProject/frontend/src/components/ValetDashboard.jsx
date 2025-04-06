import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Make sure these paths are correct!
import Card from "./ui/Card";       // If these are default exports
import Button from "./ui/Button";
import Input from "./ui/Input";

// OR — If they're named exports inside those files:
/// import { Card } from "./ui/Card";

const ValetDashboard = ({ mallId }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/api/valet/bookings/${mallId}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const handleSlotChange = (id, value) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, slot_number: value } : b))
    );
  };

  const markAsParked = async (id) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking?.slot_number) return;

    try {
      await axios.post(`/api/bookings/${id}/park`, {
        slot_number: booking.slot_number,
      });
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error("Failed to update booking:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Valet Dashboard</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <Card key={b.id} className="p-4 my-2 shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Car No:</strong> {b.car_number}</p>
                <p><strong>Time:</strong> {b.time_slot}</p>
                <p><strong>Status:</strong> {b.status}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Enter Slot Number"
                  value={b.slot_number || ""}
                  onChange={(e) => handleSlotChange(b.id, e.target.value)}
                />
                <Button
                  onClick={() => markAsParked(b.id)}
                  disabled={!b.slot_number}
                >
                  Mark as Parked
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ValetDashboard;
