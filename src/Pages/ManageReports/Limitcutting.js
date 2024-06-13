import React, { useEffect, useState,useRef } from 'react';
import { Form, Input, Button, Select, Modal,Card,Table,Space, Row, Col,DatePicker,Upload ,message,Tabs,Spin} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase-config';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
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
      const response = await fetch('http://localhost:3001/user/adduser', {
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
       <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please enter a date' }]}>
         <Input type='date' placeholder="Enter Date" />
       </Form.Item>
       </Col>
      <Col xs={24} sm={8}>
      <Form.Item
      label={"Bundle"}
                    name={ 'bundle'}
                      rules={[{ required: true, message: 'Please select' }]}
                      className="flex-item"
                      fieldKey={ 'bundle'}
                    >
                      <Select placeholder="Select bundle type" >
                        <Option value={"A"}>A</Option>
                        <Option value={"B"}>B</Option>
                        <Option value={"C"}>C</Option>
                        <Option value={"D"}>D</Option>
                      </Select>
                    </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
      <Form.Item name="onedigita" label="First A" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter one digit first" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="onedigitb" label="Second A" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter one digit second" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="twodigita" label="First B" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter two digit first" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="twodigitb" label="Second B" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter two digit second" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="threedigita" label="First C" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter three digit first" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="threedigitb" label="Second C" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter three digit second" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="fourdigita" label="First A" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter four digit first" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="fourdigitb" label="Second D" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter four digit second" />
      </Form.Item>
      </Col>
   
     
      <Col xs={24} sm={8}>
      <Form.Item
      label={"Limit Type"}
                    name={ 'limittype'}
                      rules={[{ required: true, message: 'Please select' }]}
                      className="flex-item"
                      fieldKey={ 'limittype'}
                    >
                      <Select placeholder="Select limit type" >
                        <Option value={true}>Up Limit</Option>
                        <Option value={false}>Down Limit</Option>
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
        Report
      </Button>
      {" "}
      <Button   style={{
            borderRadius:10,
                background: COLORS.primarygradient,
                color:"white"
                      }}
                      icon={<SaveFilled/>}
                      htmlType="submit">
        Admin Bill Sheet
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
