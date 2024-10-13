import React, { useEffect, useState,useRef } from 'react';
import { Form, Input, Button, Select, Modal,Card,Table,Space, Row, Col,DatePicker,Upload ,message,Tabs,Spin} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import { linkurl } from '../../link';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled, CloseCircleFilled, DeleteFilled, PlusCircleFilled, SaveFilled, ScanOutlined, SecurityScanFilled,SearchOutlined } from '@ant-design/icons';
const { Option } = Select;

const AddProductForm = ({ userdata,setProducts,products}) => {
  const [form] = Form.useForm();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      if(values.newpassword===values.confirmnewpassword){
        if (!token) {
            console.error('Token not found in local storage');
            
            return;
          }
          const response = await fetch(`${linkurl}/user/changepassword`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: JSON.stringify({
              ...userdata,
              password:values.newpassword,
              oldpassword:values.oldpassword
            }),
          });
          if (response.ok) {
            const userData = await response.json();
            localStorage.removeItem('token');
            navigate("/login")
          } else {
            const userData = await response.json();
            alert(userData.Message)
          }
      }else{
        alert("New password is not equal to Confirm new password")
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
      <Form.Item name="oldpassword" label="Old Password" rules={[{ required: true, message: 'Please enter old password' }]}>
        <Input placeholder="Enter Old Password" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="newpassword" label="New Password" rules={[{ required: true, message: 'Please enter new password' }]}>
        <Input placeholder="Enter New Password" />
      </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
      <Form.Item name="confirmnewpassword" label="Confirm New password" rules={[{ required: true, message: 'Please enter confirm new password' }]}>
        <Input placeholder="Enter Confirm New Password" />
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
        Change Password
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
        Customer updated successfully!
      </Modal>
   
      {/* Error Modal */}
      <Modal
        title="Error"
        visible={errorModalVisible}
        onOk={handleErrorModalOk}
        onCancel={handleErrorModalOk}
      >
        Error updating customer. Please try again.
      </Modal>

    </Form>}
    </div>
  );
};

export default AddProductForm;
