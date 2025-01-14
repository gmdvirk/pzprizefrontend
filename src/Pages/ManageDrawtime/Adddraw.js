import React, { useEffect, useState,useRef } from 'react';
import { Form, Input, Button, Select, Modal,Card,Table,Space, Row, Col,DatePicker,Upload ,message,Tabs,Spin} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import { linkurl } from '../../link';
import { CheckCircleFilled, CloseCircleFilled, DeleteFilled, PlusCircleFilled, SaveFilled, ScanOutlined, SecurityScanFilled,SearchOutlined } from '@ant-design/icons';
const { Option } = Select;

const AddProductForm = ({ setProducts,products}) => {
  const [form] = Form.useForm();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  
  const [message, setMessage] = useState("");
  const [errormessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
 
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/draw/createdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          ...values,
          status:"deactive"
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        let tempobj={...userData.data};
        let temp=[...products];
        temp.unshift(tempobj)
        setProducts(temp)
        form.resetFields();
        setMessage("Successfully Updated")
        setSuccessModalVisible(true)
      } else {
        const userData = await response.json();
        setErrorMessage(userData.Message)
        setErrorModalVisible(true)
      }

    }catch(error){
      setErrorMessage(error.message)
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
          <Spin size="large" />
          <p>Please Wait...</p>
        </div>):
    <Form form={form} onFinish={onFinish} layout="vertical">
       <Row gutter={16}>
       
      <Col xs={24} sm={8}>
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
        <Input placeholder="Enter Title" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please enter a date' }]}>
        <Input type='date' placeholder="Enter date" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="time" label="Time" rules={[{ required: true, message: 'Please enter time' }]}>
        <Input type="time" placeholder="Enter time" />
      </Form.Item>
      </Col>
      
      <Col xs={12} sm={8}>
      <Form.Item name="onedigita" label="One digit First" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter one digit first" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="onedigitb" label="One digit Second" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter one digit second" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="twodigita" label="Two digit First" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter two digit first" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="twodigitb" label="Two digit Second" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter two digit second" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="threedigita" label="Three digit First" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter three digit first" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="threedigitb" label="Three digit Second" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter three digit second" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="fourdigita" label="Four digit First" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter four digit first" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="fourdigitb" label="Four digit Second" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter four digit second" />
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
        Add Draw
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

    </Form>}
    </div>
  );
};

export default AddProductForm;
