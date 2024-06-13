import React, { useEffect } from 'react';
import UserHome from './Pages/Profile'
import AdminDistributors from "./Pages/Distributors"
import AdminDraws from "./Pages/Drawtime"
import Subdistributors from "./Pages/SubDistributors"
import Drawresults from "./Pages/Drawresults"
import Searchbundle from "./Pages/SearchBundle"
import Reports from "./Pages/Reports"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/profile" element={<UserHome />} />
      <Route path="/admindistributors" element={<AdminDistributors />} />
      <Route path="/admindraws" element={<AdminDraws />} />
      <Route path="/subdistributors" element={<Subdistributors />} />
      <Route path="/drawresults" element={<Drawresults />} />
      <Route path="/searchbundle" element={<Searchbundle />} />
      <Route path="/reports" element={<Reports />} />
      {/* <Route path="/changepassword" element={<Changepassword />} /> */}
</Routes>

    </Router>
  );
};

export default App;
