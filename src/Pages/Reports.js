
import React ,{useEffect,useState}from 'react';
import { Tabs,Card,Spin } from 'antd';
import AdminSideBar from "../components/AdminSidebar"
import { useMedia } from 'react-use';
import BillSheet from './ManageReports/BillSheet'
import Distributorssale from './ManageReports/Distributorssale';
import Limitcutting from "./ManageReports/Limitcutting"
import TotalSale from "./ManageReports/TotalSale"
import TotalHaddlimitSale from "./ManageReports/TotalHaddLimitSale"
import { useNavigate } from 'react-router';
import { linkurl } from '../link';

import Noaccesspage from "./NoAccess"

const AdminHomePage = () => {
const navigate=useNavigate();
  const [employees, setEmployees] = useState([]);
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userdata,setUserdata]=useState(null)
  const [noaccess,setNoaccess]=useState(false)
  const [limits, setLimits] = useState([]);
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
        draws={draws}
        products={employees}
        setProducts={setEmployees}
        />
    },
    {
        label:"Total Hadd Limit",
        key:"Total",
        children: <TotalHaddlimitSale
        userdata={userdata}
        draws={draws}
        products={employees}
        setProducts={setEmployees}/>
    },
    {
        label:"Distributors Sale",
        key:"Distributors",
        children: <Distributorssale
        userdata={userdata}
        draws={draws}
        products={employees}
        setProducts={setEmployees}/>
    },
    {
        label:"Limit Cutting",
        key:"limitcut",
        children: <Limitcutting
        userdata={userdata}
        draws={draws}
        products={employees}
        limits={limits}
        alldraws={draws}
        setProducts={setEmployees}/>
    },
    {
        label:"Bill Sheet",
        key:"bill sheet",
        children: <BillSheet
        userdata={userdata}
        draws={draws}
        products={employees}
        limits={limits}
        setProducts={setEmployees}/>
    }


  ]
  function getSubstringBeforeAtSymbol(email) {
    const atIndex = email.indexOf('@');
    
    if (atIndex !== -1) {
      return email.substring(0, atIndex);
      // or use slice: return email.slice(0, atIndex);
    } else {
      // handle the case where '@' is not present in the email
      return 'Invalid email format';
    }
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
      if(userData.data.role!=="superadmin"){
        setNoaccess(true)
        setLoading(false)
        return;
      }
      setUserdata(userData.data)
      const response1 = await fetch(`${linkurl}/user/getalldistributors`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
      if (response1.ok) {
        const userData1 = await response1.json();
        setEmployees(userData1)
      }
      
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
      console.log(userData)
      const response3 = await fetch(`${linkurl}/user/getLimitByUserId/${userData.data._id}`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
  
      if (!response3.ok) {
        throw new Error(`Error: ${response3.statusText}`);
      }
      const data = await response3.json();
      setLimits(data)
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
    <AdminSideBar label={"reports"} userdata={userdata}/>
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