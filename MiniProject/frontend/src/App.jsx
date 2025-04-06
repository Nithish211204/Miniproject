import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingForm from './components/BookingForm';
import Login from './components/Login';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import AddMall from './components/Addmall';
import AddValet from './components/Addvalet';
import ValetDashboard from './components/ValetDashboard';
import BookingHistory from './components/BookingHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/book" element={<BookingForm />} />
        <Route path="/" element={<Login />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/addmall" element={<AddMall />} />
        <Route path="/addvalet" element={<AddValet />} />
        <Route path="/valet" element={<ValetDashboard />} />
        <Route path="/history" element={<BookingHistory/>} />
      </Routes>
    </Router>
  );
}

export default App;
