import React, { useEffect, useState } from 'react';
import { Tabs, Card, Spin } from 'antd';
import AdminSideBar from "../components/AdminSidebar";
import { useMedia } from 'react-use';
import AddUserForm from './ManageMerchantSale/Home';
import { useNavigate } from 'react-router';
import { linkurl } from '../link';
import Noaccesspage from "./NoAccess";

const AdminHomePage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [balance, setBalance] = useState(0);
  const [upline, setUpline] = useState(0);
  const [credit, setCredit] = useState(0);
  const [selecteddraw, setSelectedDraw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userdata, setUserdata] = useState(null);
  const [noaccess, setNoaccess] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isMobile = useMedia('(max-width: 768px)');
  let marginLeft = isMobile ? 0 : 280;
  let marginRight = 10;

  const listener = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${linkurl}/user/auth`, {
      method: 'GET',
      headers: {
        token: `${token}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      if(userData.data.role!=="merchant"){
        setNoaccess(true)
        setLoading(false)
        return;
      }
      setUserdata(userData.data);
      const response1 = await fetch(`${linkurl}/draw/getallactivedraws`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
      if (response1.ok) {
        const userData1 = await response1.json();
        setEmployees(userData1);
      }
      const response2 = await fetch(`${linkurl}/user/getbalance`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
      if (response2.ok) {
        const userData2 = await response2.json();
        setBalance(userData2.payment.availablebalance);
        setCredit(userData2.payment.credit);
        setUpline(userData2.payment.balanceupline);
      }
    } else {
      console.error('Failed to fetch user data:', response.statusText);
      navigate("/login");
    }
    setLoading(false);
  };

  // Function to check internet connectivity
  const checkInternetConnection = async () => {
    try {
      await fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' });
      setIsOnline(true); // Connection is available
      console.log(true)
    } catch (error) {
      setIsOnline(false); // Connection is lost
      console.log(false)
    }
  };

  useEffect(() => {
    // Initial connectivity check
    checkInternetConnection();

    // Check the online status periodically
    const interval = setInterval(checkInternetConnection, 5000); // Check every 5 seconds

    // Call the listener only if the online status is true
    if (isOnline) {
   
      listener();
    }

    return () => {
      clearInterval(interval);
    };
  }, [isOnline]); // Include isOnline as a dependency

  const sidebarStyle = {
    color: 'white',
    width: '260px',
    marginLeft: '10px',
    marginRight: '10px',
    marginTop:-10,
    borderRadius: 20,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  };

  const contentStyle = {
    marginLeft: `${marginLeft}px`,
    marginRight: 0,
    marginTop: 0,
    width: '100%',
  };

  const mainStyle = {
    display: 'flex'
  };

  const layoutStyle = {
    overflowY: 'auto',
    position: 'fixed',
    height: '100%',
  };

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" tip="Loading...">
            <div className="content" />
          </Spin>
        </div>
      ) : (
        <>
          {!(noaccess) ? (
            <div style={!isMobile ? mainStyle : {}}>
              <div style={!isMobile ? layoutStyle : {}}>
                <div style={!isMobile ? sidebarStyle : {}}>
                  <AdminSideBar label={"merchant"} draw={selecteddraw} userdata={userdata} />
                </div>
                <div style={{ marginBottom: 5 }}>
                  {!isOnline && (
                    <div style={{ color: 'red', fontWeight: 'bold' }}>
                      No internet connection!
                    </div>
                  )}
                </div>
              </div>

              <div style={contentStyle}>
                <AddUserForm
                  userdata={userdata}
                  products={employees}
                  isOnline={isOnline}
                  balance={balance}
                  selecteddraw={selecteddraw}
                  setSelectedDraw={setSelectedDraw}
                  credit={credit}
                  upline={upline}
                  setBalance={setBalance}
                  setProducts={setEmployees} />
              </div>
            </div>
          ) : <Noaccesspage />}
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
