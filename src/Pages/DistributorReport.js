
import React ,{useEffect,useState}from 'react';
import { Tabs,Card,Spin } from 'antd';
import AdminSideBar from "../components/AdminSidebar"
import { useMedia } from 'react-use';
import BillSheet from './ManageDistrubutorReport/BillSheet'
import Distributorssale from './ManageDistrubutorReport/Distributorssale';
import TotalSale from "./ManageDistrubutorReport/TotalSale"
import TotalHaddlimitSale from "./ManageDistrubutorReport/TotalHaddLimitSale"
import { useNavigate } from 'react-router';
import { linkurl } from '../link';

import Noaccesspage from "./NoAccess"

const AdminHomePage = () => {
const navigate=useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userdata,setUserdata]=useState(null)
  const [draws, setDraws] = useState([]);
  const [noaccess,setNoaccess]=useState(false)
  const [aloud,setAloud]=useState(false)
  const isMobile = useMedia('(max-width: 768px)'); // Adjust the breakpoint as needed
  let marginLeft=280
  let marginRight=10
  if(isMobile){
    marginLeft=10
  }
  const onChange = (key) => {
   
  };
  const Alltabs=[
    {
        label:"Total Sale",
        key:"alldistributors",
        children: <TotalSale
        userdata={userdata}
        products={employees}
        setProducts={setEmployees}
        draws={draws}
        />
    },
    {
        label:"Total Hadd Limit",
        key:"Total",
        children: <TotalHaddlimitSale
        userdata={userdata}
        products={employees}
        draws={draws}
        aloud={aloud}
        setProducts={setEmployees}/>
    },
    {
        label:"Dealer Sale",
        key:"Dealer",
        children: <Distributorssale
        userdata={userdata}
        products={employees}
        draws={draws}
        setProducts={setEmployees}/>
    },
    {
        label:"Bill Sheet",
        key:"bill sheet",
        children: <BillSheet
        userdata={userdata}
        products={employees}
        draws={draws}
        setProducts={setEmployees}/>
    }


  ]

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
      if(userData.data.role==="superadmin"||userData.data.role==="merchant"){
        setNoaccess(true)
        setLoading(false)
        return;
      }
      setUserdata(userData.data)
      const response10 = await fetch(`${linkurl}/report/getHaddLimitAloudornot`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
      if (response10.ok) {
        const userData1 = await response10.json();
        setAloud(userData1)
      }
      const response1 = await fetch(`${linkurl}/user/getAllMyusers`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
      if (response1.ok) {
        const userData1 = await response1.json();
        setEmployees(userData1)
        const response2 = await fetch(`${linkurl}/draw/getlasttendraws`, {
          method: 'GET',
          headers: {
            token: `${token}`,
          },
        });
        if (response2.ok) {
          const userData1 = await response2.json();
          setDraws(userData1)
        }
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
    <AdminSideBar label={"distributorreports"} userdata={userdata}/>
    </div>
      <div style={{

marginBottom:20,
      }}>

      </div>
      </div>
    
      <div style={contentStyle}>

     <Card
      title="Reports"
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
     <Tabs
    onChange={onChange}
    type="card"
    items={Alltabs.map((element, i) => {
      return {
        label: element.label,
        key: element.key,
        children: element.children,
      };
    })}
  />
  </Card>

 </div>
 </div>:<Noaccesspage/>}
 </>}
 </div>
  );
};

export default AdminHomePage;