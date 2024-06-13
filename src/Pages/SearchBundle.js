
import React ,{useEffect,useState}from 'react';
import { Tabs,Card,Spin } from 'antd';
import AdminSideBar from "../components/AdminSidebar"
import { useMedia } from 'react-use';
import AllUsers from './ManageDistributors/Alldistributors'
import AddUserForm from './ManageSearchBundle/Searchbundle';
import { db } from '../firebase-config';
import { getDocs,collection,doc,getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';
import { auth } from '../firebase-config1';

import Noaccesspage from "./NoAccess"

const AdminHomePage = () => {
const navigate=useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userdata,setUserdata]=useState(null)
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
        label:"All Distributors",
        key:"alldistributors",
        children: <AllUsers
        userdata={userdata}
        products={employees}
        setProducts={setEmployees}
        />
    },
    {
        label:"Add Distributor",
        key:"adddistributors",
        children: <AddUserForm
        userdata={userdata}
        products={employees}
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
    const response = await fetch(`http://localhost:3001/user/auth`, {
      method: 'GET',
      headers: {
        token: `${token}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      setUserdata(userData.data)
      const response1 = await fetch(`http://localhost:3001/user/`, {
        method: 'GET',
        headers: {
          token: `${token}`,
        },
      });
      if (response1.ok) {
        const userData1 = await response1.json();
        setEmployees(userData1)
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

  const getAllEmployees=async()=>{
    try{
      const userinfo = await listener();
  
      if (userinfo) {
        const result = getSubstringBeforeAtSymbol(userinfo.email);
        const q = doc(db, "Users", result);
        const querySnapshot = await getDoc(q);
  
        if (querySnapshot.exists()) {
          if(querySnapshot.data().newpassword===""){
            if((querySnapshot.data().role==="admin")){
              setUserdata(querySnapshot.data());
            }else{
              setNoaccess(true)
            }
          }
          else{
            await auth.signOut();
          }
        
        } else {
          await auth.signOut();
        }
      } else {
        navigate("/login");
      }
        const empref=collection(db,"Users");
        const querySnapshot=await getDocs(empref)
        let tempemplyees=[]
        querySnapshot.forEach((element,index)=>{
          if(element.data().role!=="admin"){
            tempemplyees.push(element.data())
          }
        })
        setEmployees(tempemplyees)
        setLoading(false)
        }catch(error){
            alert(error.message)
        }
  }
//   useEffect(() => {
//     getAllEmployees()
//   }, []);
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
    <AdminSideBar label={"searchbundle"} userdata={userdata}/>
    </div>
      <div style={{

marginBottom:20,
      }}>

      </div>
      </div>
    
      <div style={contentStyle}>

     <Card
      title="Search Bundle"
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
     {/* <Tabs
    onChange={onChange}
    type="card"
    items={Alltabs.map((element, i) => {
      return {
        label: element.label,
        key: element.key,
        children: element.children,
      };
    })}
  /> */}
  <AddUserForm
        userdata={userdata}
        products={employees}
        setProducts={setEmployees}/>
  </Card>

 </div>
 </div>:<Noaccesspage/>}
 </>}
 </div>
  );
};

export default AdminHomePage;