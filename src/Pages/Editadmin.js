
import React ,{useEffect,useState}from 'react';
import { Card,Spin } from 'antd';
import AdminSideBar from "../components/AdminSidebar"
import { useMedia } from 'react-use';
import AllUsers from './Manageeditadmin/Alledit'
import { useNavigate } from 'react-router';

import { linkurl } from '../link';
import Noaccesspage from "./NoAccess"

const AdminHomePage = () => {
const navigate=useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alldraws, setAllDraws] = useState([]);
  const [limits, setLimits] = useState([]);
  const [userdata,setUserdata]=useState(null)
  const [noaccess,setNoaccess]=useState(false)
  const isMobile = useMedia('(max-width: 768px)'); // Adjust the breakpoint as needed
  let marginLeft=280
  let marginRight=10
  if(isMobile){
    marginLeft=10
  }
  
  const listener = () => new Promise( async(resolve, reject) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${linkurl}/user/getadmindetail`, {
      method: 'GET',
      headers: {
        token: `${token}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      if(userData.role!=="superadmin"){
        setNoaccess(true)
        setLoading(false)
        return;
      }
      const response2 = await fetch(`${linkurl}/user/getLimitByUserId/${userData._id}`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
  
      if (!response2.ok) {
        throw new Error(`Error: ${response2.statusText}`);
      }
      const response1 = await fetch(`${linkurl}/draw/getlasttendrawsmerchant`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
      if (response1.ok) {
        const userData1 = await response1.json();
        setAllDraws(userData1);
      }
      const data = await response2.json();
      setLimits(data)
      setUserdata(userData)
   
    } else {
      console.error('Failed to fetch user data:', response.statusText);
      navigate("/login");
    }
    setLoading(false)
  });

  useEffect(() => {
    listener()
  }, []);
  const sidebarStyle = {
    color: 'white',
    width: '260px',
    margin: '10px', 
    borderRadius: 20,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  };

  const contentStyle = {
    marginLeft: `${marginLeft}px`,
    marginRight:10,
    marginTop:10,
    width: '100%',
  };
  const mainStyle = {
    display: 'flex'
  };
  const layoutStyle={
    overflowY: 'auto',
    position: 'fixed',
    height: '100%',
  }
  return (
    <div>
    {loading ? (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" tip="Loading...">
        <div className="content" />
          </Spin>
      </div>):   <>
            {!(noaccess)?
    <div style={!isMobile?mainStyle:{}}>
    <div style={!isMobile?layoutStyle:{}}>
    <div style={!isMobile?sidebarStyle:{}}>
    <AdminSideBar label={"editadmin"} userdata={userdata}/>
    </div>
      <div style={{

marginBottom:20,
      }}>

      </div>
      </div>
    
      <div style={contentStyle}>

     <Card
      title="Edit Admin"
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
   <AllUsers
        userdata={userdata}
        products={employees}
        setProducts={setEmployees}
        setUserdata={setUserdata}
        limits={limits}
        setLimits={setLimits}
        alldraws={alldraws}
        setAllDraws={setAllDraws}
        />
  </Card>

 </div>
 </div>:<Noaccesspage/>}
 </>}
 </div>
  );
};

export default AdminHomePage;