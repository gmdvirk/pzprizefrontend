
import React ,{useEffect,useState}from 'react';
import { Tabs,Card,Spin,Row,Col } from 'antd';
import AdminSideBar from "../components/AdminSidebar"
import { useMedia } from 'react-use';
import AllUsers from './ManageMerchantTransaction/Alltransactions'
import { useNavigate } from 'react-router';
import { linkurl } from '../link';

import Noaccesspage from "./NoAccess"

const AdminHomePage = () => {
const navigate=useNavigate();
  const [employees, setEmployees] = useState([]);
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userdata,setUserdata]=useState(null)
  const [noaccess,setNoaccess]=useState(false)
  const [paymentfigures,setPaymentFigures]=useState(null)
  const isMobile = useMedia('(max-width: 768px)'); // Adjust the breakpoint as needed
  let marginLeft=280
  let marginRight=10
  if(isMobile){
    marginLeft=10
  }
  function getDateAndTime(isoString) {
    // Parse the ISO 8601 string into a Date object
    const dateObj = new Date(isoString);

    // Extract the date components
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    
    // Extract the time components
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(dateObj.getUTCMilliseconds()).padStart(3, '0');

    // Format the date and time
    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}:${seconds}`;

    return { date, time };
}
  const listener = () => new Promise( async(resolve, reject) => {
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
      setUserdata(userData.data)
      const response2 = await fetch(`${linkurl}/user/getbalance`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
  
      if (response2.ok) {
        let userData2 = await response2.json();   
       
        setPaymentFigures(userData2.payment)
      }
      const response1 = await fetch(`${linkurl}/payment/getpaymentsbyid/${userData.data._id}`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
  
      if (response1.ok) {
        let userData = await response1.json();
        for (let i=0;i<userData.length;i++){
          const { date, time } = getDateAndTime(userData[i].createdAt);
          userData[i].time= time ;
          userData[i].date=date
        } 
       
        setPayment(userData)
        
      }
    
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
    <AdminSideBar label={"merchanttransaction"} userdata={userdata}/>
    </div>
      <div style={{

marginBottom:20,
      }}>

      </div>
      </div>
    
      <div style={contentStyle}>

     <Card
      title="Book Detail"
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
      {paymentfigures&&  <div style={{ padding: '24px' }}>
      <Row gutter={16}>
<Col xs={24} sm={12} md={6}>
  <p><strong>Cash:</strong> {paymentfigures.cash}</p>
</Col>
<Col xs={24} sm={12} md={6}>
  <p><strong>Credit:</strong> {paymentfigures.credit}</p>
</Col>
<Col xs={24} sm={12} md={6}>
  <p style={{color:paymentfigures.balanceupline<0? "red":"green"}}><strong style={{color:paymentfigures.balanceupline<0?  "red":"green"}}>Balance Upline:</strong> {paymentfigures.balanceupline}</p>
</Col>
<Col xs={24} sm={12} md={6}>
  <p><strong>Available Balance:</strong> {paymentfigures.availablebalance}</p>
</Col>
</Row>
    </div>}
   <AllUsers
        userdata={userdata}
        payment={payment}
        setPayment={setPayment}
        />
  </Card>

 </div>
 </div>:<Noaccesspage/>}
 </>}
 </div>
  );
};

export default AdminHomePage;