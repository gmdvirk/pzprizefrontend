import React, { useState, useEffect,useRef } from 'react';
import { Form, Input, Button, Select, Space,Modal, Upload,Card,Table, message, Col, Row, DatePicker,Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import { linkurl } from '../../link';
import { CheckCircleFilled, CloseCircleFilled,SearchOutlined, EditFilled, SaveFilled,PlusCircleFilled,DeleteFilled } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const EditProductForm = (props) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [errormessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState(props.initialValues);


  useEffect(() => {
  

    form.setFieldsValue(props.initialValues.limit);
  }, [props.initialValues, form]);


  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/user/edituser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          ...props.initialValues,
          limit:{...values}
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        let tempobj={...props.initialValues,...values};
        let temp=[...props.products];
        const index=temp.findIndex((obj)=>obj._id===props.initialValues._id);
        temp[index]={...tempobj}
        props.setProducts(temp)
        // form.resetFields();
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
        <Spin size="large" tip="Plaese wait...">
        <div className="content" />
          </Spin>
      </div>):
     <Form form={form} onFinish={onFinish} layout="vertical">
       <Row gutter={16}>
      
      <Col xs={12} sm={8}>
      <Form.Item name="hindsaa" label="Hindsy Ki Had (First)" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter number" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="hindsab" label="Hindsy Ki Had(second)" rules={[{ required: true, message: 'Please enter a number' }]}>
      <Input type='number' placeholder="Enter number" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="akraa" label="Akra Ki Had (first)" rules={[{ required: true, message: 'Please enter a number' }]}>
      <Input type='number' placeholder="Enter number" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="akrab" label="Akra Ki Had (second)" rules={[{ required: true, message: 'Please enter a number' }]}>
      <Input type='number' placeholder="Enter number" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="tendolaa" label="Tendola Ki Had(first)" rules={[{ required: true, message: 'Please enter a number' }]}>
      <Input type='number' placeholder="Enter number" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="tendolab" label="Tendola Ki Had(second)" rules={[{ required: true, message: 'Please enter a number' }]}>
      <Input type='number' placeholder="Enter number" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="panogadaa" label="Pangoda Ki Had(first)"  rules={[{ required: true, message: 'Please enter a number' }]}>
      <Input type='number' placeholder="Enter number" />
      </Form.Item>
      </Col>
      <Col xs={12} sm={8}>
      <Form.Item name="panogadab" label="Pangoda Ki Had(second)" rules={[{ required: true, message: 'Please enter a number' }]}>
      <Input type='number' placeholder="Enter number" />
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
      Save Customer
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
