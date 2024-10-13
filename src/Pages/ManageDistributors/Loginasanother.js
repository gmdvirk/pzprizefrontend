import React, { useState, useEffect,useRef } from 'react';
import { Form, Input, Button, Select, Space,Modal, Upload,Card,Table, message, Col, Row, DatePicker,Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import { linkurl } from '../../link';
import { CheckCircleFilled, CloseCircleFilled,SearchOutlined, EditFilled, SaveFilled,PlusCircleFilled,DeleteFilled } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const EditProductForm = ({selectedProduct,userdata}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [errormessage, setErrorMessage] = useState("");



  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      // if(token){
      //   localStorage.removeItem('token');
      // }
      console.log({
        key:values,
        id:userdata,
        idtologin:selectedProduct
    })
      const response = await fetch(`${linkurl}/user/loginasanotheruser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
            key:values.key,
            id:userdata._id,
            idtologin:selectedProduct._id
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('token', userData.token);
          if(userData.rest._doc.role==="merchant"){
            navigate("/merchant")
          }
          else if(userData.rest._doc.role==="distributor" || userData.rest._doc.role==="subdistributor"){
            navigate("/distributorsmerchants")
          }else{
            navigate("/");
          }
        // setMessage("Successfully Updated")
        // setSuccessModalVisible(true)
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
        <Spin size="large" tip="Plaese wait...">
        <div className="content" />
          </Spin>
      </div>):
     <Form form={form} onFinish={onFinish} layout="vertical">
     <Row gutter={16}>
      
      <Col xs={24} sm={8}>
      <Form.Item name="key" label="Key" rules={[{ required: true, message: 'Please enter a key' }]}>
        <Input placeholder="Enter Key" />
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
      Login
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

export default EditProductForm;
