import React, { useEffect } from 'react';
import UserHome from './Pages/Profile'
import AdminDistributors from "./Pages/Distributors"
import AdminDraws from "./Pages/Drawtime"
import Subdistributors from "./Pages/SubDistributors"
import Drawresults from "./Pages/Drawresults"
import LogIn from './Auth/SignIn'
import Searchbundle from "./Pages/SearchBundle"
import Reports from "./Pages/Reports"
import Distributorreports from "./Pages/DistributorReport"
import Distributortransaction from "./Pages/DistributorTransactionHistory"
import DistributorSearchBundle from "./Pages/DistributorSearchBundle"
import DistributorMerchants from "./Pages/DistributorMerchants"
import MerchantSearchBundle from "./Pages/MerchantSearchBundle"
import MerchantTransaction from "./Pages/MerchantTransaction"
import MerchantReport from "./Pages/Merchantreports"
import AdminDetail from "./Pages/Detail"
import MerchantHome from "./Pages/Merchant"
import DistributorDetail from "./Pages/Distributordetail"
import ChangeKey from "./Pages/ChangeKey"
import Changepassword from "./Pages/Changepassword"
import EditAdmin from "./Pages/Editadmin"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/profile" element={<UserHome />} />
      <Route path="/admindistributors" element={<AdminDistributors />} />
      <Route path="/distributorsmerchants" element={<DistributorMerchants />} />
      <Route path="/distributortransaction" element={<Distributortransaction />} />
      <Route path="/distributorreports" element={<Distributorreports />} />
      <Route path="/distributorsearchbundle" element={<DistributorSearchBundle />} />
      <Route path="/merchanttransaction" element={<MerchantTransaction />} />
      <Route path="/merchantreports" element={<MerchantReport />} />
      <Route path="/merchantsearchbundle" element={<MerchantSearchBundle />} />
      <Route path="/merchant" element={<MerchantHome />} />
      <Route path="/admindraws" element={<AdminDraws />} />
      <Route path="/subdistributors" element={<Subdistributors />} />
      <Route path="/drawresults" element={<Drawresults />} />
      <Route path="/searchbundle" element={<Searchbundle />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/changekey" element={<ChangeKey />} />
      <Route path="/distributordetail/:userId" element={<DistributorDetail />} />
      <Route path="/detail/:userId" element={<AdminDetail />} />
      <Route path="/editadmin" element={<EditAdmin />} />
      <Route path="/changepassword" element={<Changepassword />} />
</Routes>

    </Router>
  );
};

export default App;
