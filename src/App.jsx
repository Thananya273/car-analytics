// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Setting from './Setting';
import Display from './Display'
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/car-analytics" element={<Dashboard />} />
        <Route path="/car-analytics/setting" element={<Setting />} />
        <Route path="car-analytics/display" element={<Display />} />
      </Routes>
    </Router>
  );
}

export default App;