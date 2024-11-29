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
  const [loading, setLoading] = useState(false);
  const generateProductCode = () => {
    return `COLLECTION-${uuidv4()}`;
  };
  function isValidPassword(password) {
    // Check for the absence of special characters and spaces
    const specialCharsAndSpacesRegex = /[^a-zA-Z0-9]/;
    return !specialCharsAndSpacesRegex.test(password);
  }
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/user/adduser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          role:"distributor",
          ...values
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        let tempobj={...userData.data};
        let temp=[...products];
        temp.push(tempobj)
        setProducts(temp)
        form.resetFields();
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }

    }catch(error){
      alert(error.message)
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
      <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter a username' }]}>
        <Input placeholder="Enter Username" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
        <Input placeholder="Enter name" />
      </Form.Item>
      </Col>
          
      <Col xs={24} sm={8}>
      <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}>
        <Input placeholder="Enter password" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
       <Form.Item name="comission" label="ہنسہ+آکرہ+ٹنڈولہ+کمشن" rules={[{ required: true, message: 'Please enter a comission' }]}>
         <Input placeholder="Enter comission" />
       </Form.Item>
       </Col>
       <Col xs={24} sm={8}>
       <Form.Item name="pcpercentage" label="پی سی کمشن" rules={[{ required: true, message: 'Please enter Pc percentage' }]}>
         <Input placeholder="Enter Pc percentage" />
       </Form.Item>
       </Col>
      <Col xs={24} sm={8}>
      <Form.Item initialValue={"0"} name="address" label="Customer Address" rules={[{ required: true, message: 'Please enter customer address' }]}>
        <Input placeholder="Enter Customer Address" />
      </Form.Item>
      </Col>
      </Row>
      <Row gutter={16}>
  
      <Col xs={24} sm={8}>
      <Form.Item initialValue={"0"} name="contact" label="Contact" rules={[{ required: true, message: 'Please enter contact' }]}>
        <Input placeholder="Enter contact" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
                    <Form.Item
  label={"Status"}
  name={'blocked'}
  rules={[{ required: true, message: 'Please select Status' }]}
  className="flex-item"
  fieldKey={'blocked'}
  initialValue={false}  // Set default value to 'false' for Active
>
  <Select placeholder="Select Status type">
    <Option value={false}>Active</Option>
    <Option value={true}>Deactive</Option>
  </Select>
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
        Save Distributor
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
        Customer added successfully!
      </Modal>
   
      {/* Error Modal */}
      <Modal
        title="Error"
        visible={errorModalVisible}
        onOk={handleErrorModalOk}
        onCancel={handleErrorModalOk}
      >
        Error adding customer. Please try again.
      </Modal>

    </Form>}
    </div>
  );
};

export default AddProductForm;
