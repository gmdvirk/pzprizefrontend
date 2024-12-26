import React, { useState } from 'react';
import { Menu, Drawer, Button, Avatar ,Card} from 'antd';
import { useMedia } from 'react-use';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  CalendarOutlined,
  MenuOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import Info from '../info';
import { Typography } from 'antd';
import COLORS from '../colors';
// import image

const { Title } = Typography;

const SidebarDrawer = (props) => {
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.removeItem('token');
    navigate("/login")
  };
  const isMobile = useMedia('(max-width: 768px)'); // Adjust the breakpoint as needed
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState(props.label);
  const imageUrl = require('./logo192.png');
  const handleMenuClick = ({ key }) => {
    setSelectedMenuKey(key);
    navigate('/' + key);
    setDrawerVisible(false);
  };

 

  const customScrollbarStyle = `
    ::-webkit-scrollbar {
      width: 0 !important;
    }
  `;

  return (
    <>
      <style>{customScrollbarStyle}</style>
      {isMobile ? (
        <>
          <Drawer
            placement="left"
            onClose={() => setDrawerVisible(false)}
            visible={isMobile ? isDrawerVisible : true}
            width={240}
            bodyStyle={{ padding: 10, boxShadow: 'none' }}
            closable={isMobile ? true : false}
            mask={isMobile}
            maskClosable={!isMobile}
            style={isMobile ? {} : { position: 'absolute' }}
          >
            <div style={{ padding: '16px', background: 'white' }}>
              <Avatar size={64} src={imageUrl} icon={<UserOutlined />} />
              <Title level={4}>{Info.name}</Title>
              {props.userdata  && (<Title level={4}>User : {props.userdata.name}</Title>)}
            </div>
            <Menu
              theme="dark"
              mode="vertical"
              selectedKeys={[selectedMenuKey]}
              onClick={handleMenuClick}
              style={{ background: 'white' }}
            >
               {/* <Menu.Item
              key="profile"
              icon={<UserOutlined />}
              style={{
                color: selectedMenuKey === 'profile' ? 'white' : 'black',
                background: selectedMenuKey === 'profile' ? COLORS.primarygradient : 'white',
                width: '100%',
              }}
            >
              Profile
            </Menu.Item> */}
            {/* {props.userdata && (
           <p><strong>{props.userdata.username}</strong></p>
           )} */}
            {/* {props.userdata.role !== 'merchant' && (
            <Menu.Item
              key="profile"
              icon={<UserOutlined />}
              style={{
                color: selectedMenuKey === 'profile' ? 'white' : 'black',
                background: selectedMenuKey === 'profile' ? COLORS.primarygradient : 'white',
                width: '100%',
              }}
            >
              Profile
            </Menu.Item>)} */}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="admindraws"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'admindraws' ? 'white' : 'black',
                  background: selectedMenuKey === 'admindraws' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Draw Time
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="Drawresults"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'Drawresults' ? 'white' : 'black',
                  background: selectedMenuKey === 'Drawresults' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Draw Results
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="admindistributors"
                icon={<UserOutlined />}
                style={{
                  color: selectedMenuKey === 'admindistributors' ? 'white' : 'black',
                  background: selectedMenuKey === 'admindistributors' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Distributors
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="reports"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'reports' ? 'white' : 'black',
                  background: selectedMenuKey === 'reports' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Reports
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="searchbundle"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'searchbundle' ? 'white' : 'black',
                  background: selectedMenuKey === 'searchbundle' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Search Number
              </Menu.Item>
            )}
             
            {(props.userdata.role === 'distributor' ) && (
              <Menu.Item
                key="subdistributors"
                icon={<UserOutlined />}
                style={{
                  color: selectedMenuKey === 'subdistributors' ? 'white' : 'black',
                  background: selectedMenuKey === 'subdistributors' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Distributors
              </Menu.Item>
            )}
               {(props.userdata.role === 'distributor' || props.userdata.role === 'subdistributor') && (
              <Menu.Item
                key="distributorsmerchants"
                icon={<UserOutlined />}
                style={{
                  color: selectedMenuKey === 'distributorsmerchants' ? 'white' : 'black',
                  background: selectedMenuKey === 'distributorsmerchants' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Users
              </Menu.Item>
            )}
            {(props.userdata.role === 'distributor' || props.userdata.role === 'subdistributor') && (
              <Menu.Item
                key="distributortransaction"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'distributortransaction' ? 'white' : 'black',
                  background: selectedMenuKey === 'distributortransaction' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Book Detail
              </Menu.Item>
            )}
            {(props.userdata.role === 'distributor' || props.userdata.role === 'subdistributor') && (
              <Menu.Item
                key="distributorreports"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'distributorreports' ? 'white' : 'black',
                  background: selectedMenuKey === 'distributorreports' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Reports
              </Menu.Item>
            )}
            {(props.userdata.role === 'distributor' || props.userdata.role === 'subdistributor') && (
              <Menu.Item
                key="distributorsearchbundle"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'distributorsearchbundle' ? 'white' : 'black',
                  background: selectedMenuKey === 'distributorsearchbundle' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Search Number
              </Menu.Item>
            )}
                       {props.userdata.role === 'merchant' && (
              <Menu.Item
                key="merchant"
                icon={<UserOutlined />}
                style={{
                  color: selectedMenuKey === 'merchant' ? 'white' : 'black',
                  background: selectedMenuKey === 'merchant' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Home
              </Menu.Item>
            )}
            {props.userdata.role === 'merchant' && (
              <Menu.Item
                key="merchanttransaction"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'merchanttransaction' ? 'white' : 'black',
                  background: selectedMenuKey === 'merchanttransaction' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Book Detail
              </Menu.Item>
            )}
            {props.userdata.role === 'merchant' && (
              <Menu.Item
                key="merchantreports"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'merchantreports' ? 'white' : 'black',
                  background: selectedMenuKey === 'merchantreports' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Reports
              </Menu.Item>
            )}
            {props.userdata.role === 'merchant' && (
              <Menu.Item
                key="merchantsearchbundle"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'merchantsearchbundle' ? 'white' : 'black',
                  background: selectedMenuKey === 'merchantsearchbundle' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Search Number
              </Menu.Item>
            )}
               {props.userdata.role !== 'merchant' && (
              <Menu.Item
                key="changekey"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'changekey' ? 'white' : 'black',
                  background: selectedMenuKey === 'changekey' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Change Key
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="editadmin"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'editadmin' ? 'white' : 'black',
                  background: selectedMenuKey === 'editadmin' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Edit Admin
              </Menu.Item>
            )}
             {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="changepassword"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'changepassword' ? 'white' : 'black',
                  background: selectedMenuKey === 'changepassword' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Change Password
              </Menu.Item>
            )}
          </Menu>
            <Button
              icon={<LogoutOutlined />}
              style={{
                background: COLORS.primarygradient,
                marginLeft: 5,
                marginTop: 15,
                width: '100%',
                height: 40,
                bottom: 16,
                borderRadius: 10,
                color: 'white',
              }}
              onClick={Logout}
            >
              Logout
            </Button>
          </Drawer>
{selectedMenuKey==="merchant"?
       <div style={{
        margin:10
       }}>
       <Button
         style={{
           background: COLORS.primarygradient,
           borderRadius: 10,
           marginTop:props.userdata.role === 'merchant' ?-25:-15
         }}
         type="primary"
         icon={<MenuOutlined />}
         onClick={() => setDrawerVisible(true)}
       ></Button>
       {selectedMenuKey==="merchant"&&props.draw&&<p style={{zIndex:9999,color:"green",marginTop:-30,marginLeft:50}}>{props.draw.title+" "+props.draw.date}</p>}
     </div>:
            <Card
            style={{
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              marginTop:  props.userdata.role === 'merchant' ?0:10,
              marginLeft: 10,
              marginRigth: 10,
              marginBottom:0,
              height:props.userdata.role === 'merchant' ?60: 70,
            }}
          >
            <Button
              style={{
                background: COLORS.primarygradient,
                borderRadius: 10,
                marginTop:props.userdata.role === 'merchant' ?-25:-15
              }}
              type="primary"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
            ></Button>
            {selectedMenuKey==="merchant"&&props.draw&&<p style={{zIndex:9999,color:"green",marginTop:-30,marginLeft:50}}>{props.draw.title+" "+props.draw.date}</p>}
          </Card>
}
   
        </>
      ) : (
        <Card
          style={{
            borderRadius: 20,
            height: '100%',
            borderWidth: 0,
            width: 250,
            minHeight: '98vh', // Ensure the sidebar has at least the height of the screen
          }}
        >
          <div style={{ padding: '16px', background: 'white' }}>
            <Avatar size={64} src={imageUrl} icon={<UserOutlined />} />
            <Title level={4}>{Info.name}</Title>
            {props.userdata && (<Title level={4}>User : {props.userdata.username}</Title>)}
          </div>
          <Menu
            theme="dark"
            mode="vertical"
            selectedKeys={[selectedMenuKey]}
            onClick={handleMenuClick}
            style={{ background: 'white' }}
          >
             {/* {props.userdata.role === 'merchant' && (
           <p><strong>{props.userdata.usrname}</strong></p>
           )} */}
            {/* {props.userdata.role !== 'merchant' && (
            <Menu.Item
              key="profile"
              icon={<UserOutlined />}
              style={{
                color: selectedMenuKey === 'profile' ? 'white' : 'black',
                background: selectedMenuKey === 'profile' ? COLORS.primarygradient : 'white',
                width: '100%',
              }}
            >
              Profile
            </Menu.Item>)} */}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="admindraws"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'admindraws' ? 'white' : 'black',
                  background: selectedMenuKey === 'admindraws' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Draw Time
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="Drawresults"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'Drawresults' ? 'white' : 'black',
                  background: selectedMenuKey === 'Drawresults' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Draw Results
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="admindistributors"
                icon={<UserOutlined />}
                style={{
                  color: selectedMenuKey === 'admindistributors' ? 'white' : 'black',
                  background: selectedMenuKey === 'admindistributors' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Distributors
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="reports"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'reports' ? 'white' : 'black',
                  background: selectedMenuKey === 'reports' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Reports
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="searchbundle"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'searchbundle' ? 'white' : 'black',
                  background: selectedMenuKey === 'searchbundle' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Search Number
              </Menu.Item>
            )}
             
            {(props.userdata.role === 'distributor' ) && (
              <Menu.Item
                key="subdistributors"
                icon={<UserOutlined />}
                style={{
                  color: selectedMenuKey === 'subdistributors' ? 'white' : 'black',
                  background: selectedMenuKey === 'subdistributors' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Distributors
              </Menu.Item>
            )}
               {(props.userdata.role === 'distributor' || props.userdata.role === 'subdistributor') && (
              <Menu.Item
                key="distributorsmerchants"
                icon={<UserOutlined />}
                style={{
                  color: selectedMenuKey === 'distributorsmerchants' ? 'white' : 'black',
                  background: selectedMenuKey === 'distributorsmerchants' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Users
              </Menu.Item>
            )}
            {(props.userdata.role === 'distributor' || props.userdata.role === 'subdistributor') && (
              <Menu.Item
                key="distributortransaction"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'distributortransaction' ? 'white' : 'black',
                  background: selectedMenuKey === 'distributortransaction' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Book Detail
              </Menu.Item>
            )}
            {(props.userdata.role === 'distributor' || props.userdata.role === 'subdistributor') && (
              <Menu.Item
                key="distributorreports"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'distributorreports' ? 'white' : 'black',
                  background: selectedMenuKey === 'distributorreports' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Reports
              </Menu.Item>
            )}
            {(props.userdata.role === 'distributor' || props.userdata.role === 'subdistributor') && (
              <Menu.Item
                key="distributorsearchbundle"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'distributorsearchbundle' ? 'white' : 'black',
                  background: selectedMenuKey === 'distributorsearchbundle' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Search Number
              </Menu.Item>
            )}
                       {props.userdata.role === 'merchant' && (
              <Menu.Item
                key="merchant"
                icon={<UserOutlined />}
                style={{
                  color: selectedMenuKey === 'merchant' ? 'white' : 'black',
                  background: selectedMenuKey === 'merchant' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Home
              </Menu.Item>
            )}
            {props.userdata.role === 'merchant' && (
              <Menu.Item
                key="merchanttransaction"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'merchanttransaction' ? 'white' : 'black',
                  background: selectedMenuKey === 'merchanttransaction' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Book Detail
              </Menu.Item>
            )}
            {props.userdata.role === 'merchant' && (
              <Menu.Item
                key="merchantreports"
                icon={<DashboardOutlined />}
                style={{
                  color: selectedMenuKey === 'merchantreports' ? 'white' : 'black',
                  background: selectedMenuKey === 'merchantreports' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Reports
              </Menu.Item>
            )}
            {props.userdata.role === 'merchant' && (
              <Menu.Item
                key="merchantsearchbundle"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'merchantsearchbundle' ? 'white' : 'black',
                  background: selectedMenuKey === 'merchantsearchbundle' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Search Number
              </Menu.Item>
            )}
              {props.userdata.role !== 'merchant' && (
              <Menu.Item
                key="changekey"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'changekey' ? 'white' : 'black',
                  background: selectedMenuKey === 'changekey' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Change Key
              </Menu.Item>
            )}
            {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="editadmin"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'editadmin' ? 'white' : 'black',
                  background: selectedMenuKey === 'editadmin' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Edit Admin
              </Menu.Item>
            )}
             {props.userdata.role === 'superadmin' && (
              <Menu.Item
                key="changepassword"
                icon={<CalendarOutlined />}
                style={{
                  color: selectedMenuKey === 'changepassword' ? 'white' : 'black',
                  background: selectedMenuKey === 'changepassword' ? COLORS.primarygradient : 'white',
                  width: '100%',
                }}
              >
                Change Password
              </Menu.Item>
            )}
            
          </Menu>
          <Button
            icon={<LogoutOutlined />}
            style={{
              background: COLORS.primarygradient,
              marginLeft: 5,
              marginTop: 15,
              width: '85%',
              height: 40,
              position:'absolute',
              bottom: 40,
              borderRadius: 10,
              color: 'white',
            }}
            onClick={Logout}
          >
            Logout
          </Button>
        </Card>
      )}
    </>
  );
};

export default SidebarDrawer;
