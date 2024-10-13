import React, { useEffect, useState } from 'react';
import { Card, Table, Spin,Space,Button,Select,Tabs,Modal, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import AddUserForm from './Editdistributor';
import EditComission from "./Editcomission"
import Editprize from "./EditPrize"
import EditLimit from "./EditLimit"
import Editpurchase from "./Editpurchase"
import { linkurl } from '../../link';
import COLORS from '../../colors';
import { DollarCircleFilled, EditFilled, InfoCircleFilled } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;
const UserDetailsPage = ({ userdata }) => {
  const { userId } = useParams();
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState(null);
  
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false); 
  const navigate=useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${linkurl}/user/getuserdetailbyid/${userId}`, {
          method: 'GET',
          headers: {
            token: `${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  const { users, referralusers } = userData;
  const handleDetail = (record) => {
    // setSelectedProduct(record);
    navigate(`/detail/${record._id}`)
    // setVisibleDetail(true);
  };
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
  const showDeleteConfirmationModal =async (record) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${linkurl}/payment/getpaymentsbyid/${record._id}`, {
      method: 'GET',
      headers: {
        token: `${token}`,
      },
    });

    if (response.ok) {
      let userData = await response.json();
      for (let i=0;i<userData.length;i++){
        const { date, time } = getDateAndTime(userData[i].createdAt);
        userData[i].time= time ;
        userData[i].date=date
      } 
     
      setPayment(userData)
    }
    setSelectedProduct(record);
    setDeleteConfirmationVisible(true);
  };
  const renderProductSelection = () => {
    const renderGeneral = () => (
      <AddUserForm
          initialValues={selectedProduct}
          userdata={userdata}
          onCancel={() => setVisible(false)}
          setProducts={setProducts}
          products={products}
        />
    );
    const renderLimit = () => (
      <EditLimit
      initialValues={selectedProduct}
      userdata={userdata}
      onCancel={() => setVisible(false)}
      setProducts={setProducts}
      products={products}
    />
    );
    const renderComission = () => (
      <EditComission
      initialValues={selectedProduct}
      userdata={userdata}
      onCancel={() => setVisible(false)}
      setProducts={setProducts}
      products={products}
    />
  );
    const renderPrize = () => (
      <Editprize
      initialValues={selectedProduct}
      userdata={userdata}
      onCancel={() => setVisible(false)}
      setProducts={setProducts}
      products={products}
    />
  );
    const renderPusrchase = () => (
      <Editpurchase
      initialValues={selectedProduct}
      userdata={userdata}
      onCancel={() => setVisible(false)}
      setProducts={setProducts}
      products={products}
    />
    );
    return (
      <Tabs defaultActiveKey="mobile" type="card">
      <TabPane tab="Comission Settings" key="comission">
        {renderComission()}
      </TabPane>
      <TabPane tab="Limit Cutting" key="limit">
        {renderLimit()}
      </TabPane>
      <TabPane tab="General Info" key="general">
        {renderGeneral()}
      </TabPane>
      <TabPane tab="Prize Setting" key="prize">
        {renderPrize()}
      </TabPane>
      <TabPane tab="Purchase Limit" key="purchase">
        {renderPusrchase()}
      </TabPane>
    </Tabs>
    );
  };
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setProducts(referralusers)
    setVisible(true);
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (username,blocked) => (
        <span style={{ color: blocked.blocked ? 'red' : 'green' }}>
        {username}
      </span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Blocked',
      dataIndex: 'blocked',
      key: 'blocked',
      render: (blocked) => (blocked ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
       <Button
          icon={<EditFilled/>}
          style={{

borderRadius: 10,
background: COLORS.editgradient,
color: "white"
          }} onClick={() => handleEdit(record)}>
            Edit
          </Button>
       <Button
          icon={<InfoCircleFilled/>}
          style={{

borderRadius: 10,
background: COLORS.primarygradient,
color: "white"
          }} onClick={() => handleDetail(record)}>Detail</Button>
      {/* <Button
            icon={<DollarCircleFilled />}
            style={{
              borderRadius: 10,
              background: COLORS.detailgradient,
              color: 'white',
            }}
            onClick={() => showDeleteConfirmationModal(record)}
          >
            Payment
          </Button> */}
    
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {!loading && (
        <>
          <Card title="User Details">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <p><strong>Name:</strong> {users.name}</p>
                <p><strong>Username:</strong> {users.username}</p>
                <p><strong>Address:</strong> {users.address}</p>
                <p><strong>Contact:</strong> {users.contact}</p>
              </Col>
              <Col xs={24} sm={12}>
                <p><strong>Role:</strong> {users.role}</p>
                <p><strong>Blocked:</strong> {users.blocked ? 'Yes' : 'No'}</p>
                <p><strong>Created At:</strong> {new Date(users.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(users.updatedAt).toLocaleString()}</p>
              </Col>
            </Row>
          </Card>
          <Card title="Payment Details" style={{ marginTop: 20 }}>
          <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Cash:</strong> {users.payment.cash}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Credit:</strong> {users.payment.credit}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <p style={{color:users.payment.balanceupline>0?"green":'red'}}><strong style={{color:users.payment.balanceupline>0?"green":'red'}}>Balance Upline:</strong> {users.payment.balanceupline}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Available Balance:</strong> {users.payment.availablebalance}</p>
              </Col>
            </Row>
          </Card>
          
          <Card title="Commission Details" style={{ marginTop: 20 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <p><strong>ہنسہ+آکرہ+ٹنڈولہ+کمشن:</strong> {users.comission.comission}</p>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <p><strong>پی سی کمشن:</strong> {users.comission.pcpercentage}</p>
              </Col>
            </Row>
          </Card>
          {/* <Card title="Purchase Limits" style={{ marginTop: 20 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Limit AF:</strong> {users.purchase.plimitaf}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Limit AS:</strong> {users.purchase.plimitas}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Limit BF:</strong> {users.purchase.plimitbf}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Limit BS:</strong> {users.purchase.plimitbs}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Limit CF:</strong> {users.purchase.plimitcf}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
              <p><strong>Limit CS:</strong> {users.purchase.plimitcs}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Limit DF:</strong> {users.purchase.plimitdf}</p>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <p><strong>Limit DS:</strong> {users.purchase.plimitds}</p>
              </Col>
            </Row>
          </Card> */}
          <Card title={"Referral Users : "+referralusers.length} style={{ marginTop: 20 }}>
            <Table
              dataSource={referralusers}
              columns={columns}
              rowKey="_id"
              pagination={false}
              scroll={{ x: true }} // Enables horizontal scroll on smaller screens
            />
          </Card>
        </>
      )}
        <Modal
        title="Edit Customer"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
      >
        
        {renderProductSelection()}
      </Modal>
     
    </div>
  );
};

export default UserDetailsPage;

