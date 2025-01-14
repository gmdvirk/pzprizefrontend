
import React ,{useEffect,useState}from 'react';
import { Tabs,Card,Spin,Button } from 'antd';
import AdminSideBar from "../components/AdminSidebar"
import { useMedia } from 'react-use';
import AllUsers from './ManageSubdistributors/Allsubdistributors'
import AddUserForm from './ManageSubdistributors/Addsubdistributors';
import { useNavigate } from 'react-router';
import {linkurl} from "../link"
import Noaccesspage from "./NoAccess"
import COLORS from '../colors';
import { PlusOutlined } from '@ant-design/icons';

const AdminHomePage = () => {
const navigate=useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userdata,setUserdata]=useState(null)
  const [completeuserdata,setCompleteUserdata]=useState(null)
  const [noaccess,setNoaccess]=useState(false)
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
        label:"All distributors",
        key:"alldistributors",
        children: <AllUsers
        userdata={userdata}
        products={employees}
        completeuserdata={completeuserdata}
        setProducts={setEmployees}
        />
    },
    {
        label:"New distributor",
        key:"adddistributors",
        children: <AddUserForm
        userdata={userdata}
        products={employees}
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
      setUserdata(userData.data)
      console.log(userData.data)
      if(userData.data.role!=="distributor"){
        setNoaccess(true)
        setLoading(false)
        return;
      }
      const response1 = await fetch(`${linkurl}/user/getallmysubdistributors`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
      if (response1.ok) {
        const userData1 = await response1.json();
        setEmployees(userData1.reverse())
      }
      const response2 = await fetch(`${linkurl}/user/getBalance`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
      if (response2.ok) {
        const userData1 = await response2.json();
        setCompleteUserdata(userData1)
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
    <AdminSideBar label={"subdistributors"} userdata={userdata}/>
    </div>
      <div style={{

marginBottom:20,
      }}>

      </div>
      </div>
    
      <div style={contentStyle}>

     <Card
      title="Distributors"
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',backgroundColor:COLORS.distributorcolor }}
      extra={
        <Button
          onClick={()=>{navigate("/distributorsmerchants")}}
          style={{
            borderRadius: 10,
            background: COLORS.primarygradient,
            color: "white"
          }}
          icon={<PlusOutlined />}
        >
          Users
        </Button>
      }
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