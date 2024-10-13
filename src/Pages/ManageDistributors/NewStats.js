
// '#000B4F'
import React from 'react';
import { Card, Row, Col, Statistic, Divider } from 'antd';
import COLORS from '../../colors';
const Statisticscard = ({data}) => {
  
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={16}>
<Col xs={24} sm={12} md={6}>
  <p><strong>Cash:</strong> {data.cash}</p>
</Col>
<Col xs={24} sm={12} md={6}>
  <p><strong>Credit:</strong> {data.credit}</p>
</Col>
<Col xs={24} sm={12} md={6}>
  <p style={{color:data.balanceupline<0? "red":"green"}}><strong style={{color:data.balanceupline<0?  "red":"green"}}>Balance Upline:</strong> {data.balanceupline}</p>
</Col>
<Col xs={24} sm={12} md={6}>
  <p><strong>Available Balance:</strong> {data.availablebalance}</p>
</Col>
</Row>
             <Divider style={{ margin: '24px 0' }} />
      {/* Add more sections or components as needed for the admin home page */}
    </div>
  );
};

export default Statisticscard;
