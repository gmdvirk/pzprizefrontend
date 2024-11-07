import React, { useState, useEffect,useRef } from 'react';
import { Form, Input, Button, Select,Card, Space,Modal, Upload,Table, message, Col, Row, DatePicker,Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import { linkurl } from '../../link';
import { CheckCircleFilled, CloseCircleFilled,SearchOutlined, EditFilled, SaveFilled,PlusCircleFilled,DeleteFilled } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const EditProductForm = ({selectedProduct,setSelectedProduct,payment,setPayment}) => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errormessage,setErrormessage]=useState("")
  const [message,setMessage]=useState("")
  // const [product, setProduct] = useState(props.initialValues);



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
  const onFinish = async (values) => {
    values.type="Draw";
    setLoading(true)
    try {
      if(values.type==="Withdraw"&&(Number(values.amount)>(Number(selectedProduct.payment.cash)+Number(selectedProduct.payment.credit)))){
        setErrormessage(`You can not with draw more than the available balance that is :${Number(selectedProduct.payment.cash)+Number(selectedProduct.payment.credit)}`)
        setErrorModalVisible(true)
       setLoading(false) 
        return;
      }
      else{
        const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/payment/addcash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          id:selectedProduct._id,
          ...values
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        let tempobj={...userData.payment};
        let temp=[...payment];
        const { date, time } = getDateAndTime(tempobj.createdAt);
        tempobj.time= time ;
        tempobj.date=date
        temp.push(tempobj)
        setPayment(temp)
        let tempobj1={...selectedProduct,payment:{
          cash:tempobj.cash,
          credit:tempobj.credit,
          balanceupline:tempobj.balanceupline,
          availablebalance:tempobj.availablebalance
        }}
        setSelectedProduct(tempobj1)
        form.resetFields();
        setMessage("The transaction was successful.")
      setSuccessModalVisible(true)
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }

      }
      
    }catch(error){
      setErrormessage(error.message)
      setErrorModalVisible(true)
    }

    setLoading(false)
  };
  const onFinish1 = async (values) => {
    values.type="Withdraw";
    setLoading(true)
    try {
      if(values.type==="Withdraw"&&(Number(values.amount)>(Number(selectedProduct.payment.cash)+Number(selectedProduct.payment.credit)))){
        setErrormessage(`You can not with draw more than the available balance that is :${Number(selectedProduct.payment.cash)+Number(selectedProduct.payment.credit)}`)
        setErrorModalVisible(true)
       setLoading(false) 
        return;
      }
      else{
        const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/payment/addcash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          id:selectedProduct._id,
          ...values
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        let tempobj={...userData.payment};
        let temp=[...payment];
        const { date, time } = getDateAndTime(tempobj.createdAt);
        tempobj.time= time ;
        tempobj.date=date
        temp.push(tempobj)
        setPayment(temp)
        let tempobj1={...selectedProduct,payment:{
          cash:tempobj.cash,
          credit:tempobj.credit,
          balanceupline:tempobj.balanceupline,
          availablebalance:tempobj.availablebalance
        }}
        setSelectedProduct(tempobj1)
        form1.resetFields();
        setMessage("The transaction was successful.")
      setSuccessModalVisible(true)
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }

      }
      
    }catch(error){
      setErrormessage(error.message)
      setErrorModalVisible(true)
    }

    setLoading(false)
  };

  const handleSuccessModalOk = () => {
    setSuccessModalVisible(false);
  };

  const handleErrorModalOk = () => {
    setErrorModalVisible(false);
  };


  return (
    <div>
    {loading ? (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" tip="Plaese wait...">
        <div className="content" />
          </Spin>
      </div>):
      <>
      <Card
      title="Draw Cash"
       headStyle={{ backgroundColor: '#33cc33',color:"white",  borderColor: '#33cc33' }}
      style={{ 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        marginTop: 20, 
        borderColor: '#33cc33', 
        borderWidth: 2
      }}>
     <Form form={form} onFinish={onFinish} layout="vertical">
    <Row gutter={16}>
    
       <Col xs={24} sm={12}>
       <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}>
         <Input placeholder="Enter description" />
       </Form.Item>
       </Col>
       <Col xs={24} sm={12}>
       <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter amount' }]}>
         <Input placeholder="Enter amount" />
       </Form.Item>
       </Col>
       
       </Row>
     
  <Form.Item>
    <Button   style={{
          borderRadius:10,
              background: COLORS.primarygradient,
              color:"white"
                    }}
                    icon={<SaveFilled/>}
                    htmlType="submit">
      Draw Cash
    </Button>
  </Form.Item>

    {/* Success Modal */}
  <Modal
      title="Success"
      visible={successModalVisible}
      onOk={handleSuccessModalOk}
      onCancel={handleSuccessModalOk}
      footer={[
        <Button
        icon={<CloseCircleFilled/>}
          key="cancel"
          onClick={handleSuccessModalOk}
          style={{
            borderRadius: 10,
            background: COLORS.editgradient,
            color: 'white',
          }}
        >
          Cancel
        </Button>,
        <Button
          key="delete"
          type="danger"
          onClick={handleSuccessModalOk}
          icon={<CheckCircleFilled />}
          style={{
            borderRadius: 10,
            background: COLORS.primarygradient,
            color: 'white',
          }}
        >
          Done
        </Button>,
      ]}
    >
      {message}
    </Modal>
  
 
    {/* Error Modal */}
    <Modal
      title="Error"
      visible={errorModalVisible}
      onOk={handleErrorModalOk}
      onCancel={handleErrorModalOk}
    >
      {errormessage}
    </Modal>

  </Form>
  </Card>
  <Card
      title="Withdraw Cash"
      headStyle={{ backgroundColor: '#cc0000',color:"white",  borderColor: '#cc0000' }}
      style={{ 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        marginTop: 20, 
        borderColor: '#cc0000', 
        borderWidth: 2
      }}>
     <Form form={form1} onFinish={onFinish1} layout="vertical">
    <Row gutter={16}>
    
       <Col xs={24} sm={12}>
       <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}>
         <Input placeholder="Enter description" />
       </Form.Item>
       </Col>
       <Col xs={24} sm={12}>
       <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter amount' }]}>
         <Input placeholder="Enter amount" />
       </Form.Item>
       </Col>
       
       </Row>
     
  <Form.Item>
    <Button   style={{
          borderRadius:10,
              background: COLORS.primarygradient,
              color:"white"
                    }}
                    icon={<SaveFilled/>}
                    htmlType="submit">
      Withdraw Cash
    </Button>
  </Form.Item>
  </Form>
  </Card>
  </>
  }
  
  </div>
  );
};

export default EditProductForm;
