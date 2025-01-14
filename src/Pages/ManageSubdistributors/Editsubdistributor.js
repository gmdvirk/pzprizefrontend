import React, { useState, useEffect,useRef } from 'react';
import { Form, Input, Button, Select, Space,Modal, Upload,Card,Table, message, Col, Row, DatePicker,Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import { CheckCircleFilled, CloseCircleFilled,SearchOutlined, EditFilled, SaveFilled,PlusCircleFilled,DeleteFilled } from '@ant-design/icons';
import moment from 'moment';
import { linkurl } from '../../link';

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
  

    form.setFieldsValue(props.initialValues);
    form.setFieldsValue(props.initialValues.comission);
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
          ...values,
          comission:{comission:values.comission,pcpercentage:values.pcpercentage}
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        let tempobj={...props.initialValues,...values};
        let temp=[...props.products];
        const index=temp.findIndex((obj)=>obj._id===props.initialValues._id);
        temp[index]={...tempobj}
        props.setProducts(temp)
        setMessage("Successfully Updated")
        setSuccessModalVisible(true)
        // form.resetFields();
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
       <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter a username' }]} disabled>
         <Input placeholder="Enter Username" disabled/>
       </Form.Item>
       </Col>
       <Col xs={24} sm={8}>
       <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
         <Input placeholder="Enter name" />
       </Form.Item>
       </Col>
       <Col xs={24} sm={8}>
       <Form.Item name="password" label="password" rules={[{ required: true, message: 'Please enter password' }]}>
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
       <Form.Item name="address" label="Customer Address" rules={[{ required: true, message: 'Please enter customer address' }]}>
         <Input placeholder="Enter Customer Address" />
       </Form.Item>
       </Col>
      
   
     
       <Col xs={24} sm={8}>
       <Form.Item name="contact" label="Contact" rules={[{ required: true, message: 'Please enter contact' }]}>
         <Input placeholder="Enter contact" />
       </Form.Item>
       </Col>
       <Col xs={24} sm={8}>
       <Form.Item
       label={"Status"}
                     name={ 'blocked'}
                       rules={[{ required: true, message: 'Please select Status' }]}
                       className="flex-item"
                       fieldKey={ 'blocked'}
                     >
                       <Select placeholder="Select Status type" >
                        <Option value={false}>Active</Option>
                        <Option value={true}>Deactive</Option>
                       </Select>
                     </Form.Item>
                     </Col>
                     {/* <Col xs={24} sm={8}>
      <Form.Item
      label={"Hadd limit allowed"}
                    name={ 'haddaloud'}
                      rules={[{ required: true, message: 'Please select Status' }]}
                      className="flex-item"
                      fieldKey={ 'haddaloud'}
                    >
                      <Select placeholder="Select Status type" >
                        <Option value={true}>Alowed</Option>
                        <Option value={false}>Not Alowed</Option>
                      </Select>
                    </Form.Item>
                    </Col> */}
             
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
