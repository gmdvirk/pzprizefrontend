import React, { useEffect } from 'react';
import UserHome from './Pages/Profile'
import AdminDistributors from "./Pages/Distributors"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebase-config1';

const App = () => {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/profile" element={<UserHome />} />
      <Route path="/admindistributors" element={<AdminDistributors />} />
      {/* <Route path="/changepassword" element={<Changepassword />} /> */}
</Routes>

    </Router>
  );
};

export default App;
