import React, { useEffect, useState } from 'react';
import { Card, Table, Spin, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/user/getuserdetailbyid/${userId}`, {
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
              <Col xs={24} sm={12} md={8}>
                <p><strong>Cash:</strong> {users.payment.cash}</p>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <p><strong>Credit:</strong> {users.payment.credit}</p>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <p><strong>Balance Upline:</strong> {users.payment.balanceupline}</p>
              </Col>
            </Row>
          </Card>
          <Card title="Commission Details" style={{ marginTop: 20 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <p><strong>Commission:</strong> {users.comission.comission}</p>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <p><strong>PC Percentage:</strong> {users.comission.pcpercentage}</p>
              </Col>
            </Row>
          </Card>
          <Card title="Purchase Limits" style={{ marginTop: 20 }}>
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
          </Card>
          <Card title="Referral Users" style={{ marginTop: 20 }}>
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
    </div>
  );
};

export default UserDetailsPage;

