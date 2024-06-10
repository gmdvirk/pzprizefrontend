import React, { useState, useEffect,useRef } from 'react';
import { Form, Input, Button, Select, Space,Modal, Upload,Card,Table, message, Col, Row, DatePicker,Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import { CheckCircleFilled, CloseCircleFilled,SearchOutlined, EditFilled, SaveFilled,PlusCircleFilled,DeleteFilled } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const EditProductForm = (props) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [product, setProduct] = useState(props.initialValues);
  const [newdate, setNewdate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);


  useEffect(() => {
  

    form.setFieldsValue(props.initialValues);
  }, [props.initialValues, form]);


  const onFinish = async (values) => {
    setLoading(true)
   
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
       <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter a username' }]}>
         <Input placeholder="Enter Username" />
       </Form.Item>
       </Col>
       <Col xs={24} sm={8}>
       <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
         <Input placeholder="Enter name" />
       </Form.Item>
       </Col>
       </Row>
       <Row gutter={16}>
         <Col xs={24} sm={8}>
       <Form.Item name="address" label="Customer Address" rules={[{ required: true, message: 'Please enter customer address' }]}>
         <Input placeholder="Enter Customer Address" />
       </Form.Item>
       </Col>
       <Col xs={24} sm={8}>
       <Form.Item name="passowrd" label="Passowrd" rules={[{ required: true, message: 'Please enter password' }]}>
         <Input placeholder="Enter password" />
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
                         <Option value={true}>Active</Option>
                         <Option value={false}>Deactive</Option>
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
      Customer editted successfully!
    </Modal>
  
 
    {/* Error Modal */}
    <Modal
      title="Error"
      visible={errorModalVisible}
      onOk={handleErrorModalOk}
      onCancel={handleErrorModalOk}
    >
      Error editting customer. Please try again.
    </Modal>

  </Form>}
  </div>
  );
};

export default EditProductForm;
