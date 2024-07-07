import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import LiveMutualFundsNav from './pages/LiveMutualFundsNav/LiveMutualFundsNav'; // Update the path as necessary
import HRA from './pages/HRA/HRA';
import PPF from './pages/PPF/PPF';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/live-mutual-funds-nav" element={<LiveMutualFundsNav />} />
      <Route path="/hra-exemption" element={<HRA />} />
      <Route path="/ppf-calculator" element={<PPF />} />
      {/* Add other routes here */}
    </Routes>
  </Router>
);

export default App;
