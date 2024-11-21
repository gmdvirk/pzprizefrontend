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
  const [id, setId] = useState("");
  const [product, setProduct] = useState(props.initialValues);
  const [limitsetting, setLimitsetting] = useState({
    hindsaa:0,
    hindsab:0,
    akraa:0,
    akrab:0,
    tendolaa:0,
    tendolab:0,
    panogadaa:0,
    panogadab:0
  });
  
  const [drawdate, setDrawdate] = useState(null);


  // useEffect(() => {
  

  //   form.setFieldsValue(props.initialValues.limit);
  // }, [props.initialValues, form]);

  useEffect(() => {
  

    form.setFieldsValue(limitsetting);
  }, [limitsetting, form]);


  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/user/editLimit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          _id:id,
          userid:props.initialValues._id,
          drawid:drawdate._id,
          limit:{...values}
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        // let tempobj={...props.initialValues,...values};
        // let temp=[...props.products];
        // const index=temp.findIndex((obj)=>obj._id===props.initialValues._id);
        // temp[index]={...tempobj}
        // props.setProducts(temp)
        setLimitsetting({
          hindsaa:0,
    hindsab:0,
    akraa:0,
    akrab:0,
    tendolaa:0,
    tendolab:0,
    panogadaa:0,
    panogadab:0
        })
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

  const getExpiredOrNot=(users)=>{
    // Parse the draw date and time from the users object
    
    const drawDateTime = new Date(`${users.date}T${users.time}Z`);
    let currentDatetime = new Date();
    let currentDate = currentDatetime.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
    let currentTime = currentDatetime.toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5); // 'HH:MM'
    // Check if the current date and time are less than the draw date and time
    const drawDateTime1 = new Date(`${currentDate}T${currentTime}Z`);
    if (drawDateTime1 >= drawDateTime) {
        return "expired"
    }
    if (users.status === 'active') {
     return "active"
 }
    return "deactive"
 }
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
       <Form.Item
       label={"Select Draw"}
                     name={ 'date'}
                       rules={[{ required: true, message: 'Please select draw' }]}
                       className="flex-item"
                       fieldKey={ 'date'}
                     >
                    <Select placeholder="Select draw"  onChange={(e)=>{
                        const temp=props.alldraws.draws.find((obj)=>obj.date===e)
                        setDrawdate(temp)
                        const index=props.limits.data.findIndex((obj)=>obj.drawid===temp._id)
                        if(index===-1){
                          setLimitsetting({
                            hindsaa:0,
                            hindsab:0,
                            akraa:0,
                            akrab:0,
                            tendolaa:0,
                            tendolab:0,
                            panogadaa:0,
                            panogadab:0
                          })
                          form.setFieldsValue(limitsetting);
                        }else{
                          setLimitsetting(props.limits.data[index])
                          setId(props.limits.data[index]._id)
                          form.setFieldsValue(props.limits.data[index]);
                        }
                        
                      }
                      }
                        dropdownStyle={{ maxHeight: 150, overflow: 'auto' }}>
                        
                      {props.alldraws.draws.map((obj)=>{
                        return(
                          <Option style={{color:getExpiredOrNot(obj)==="active"?"green":'red'}} value={obj.date}>{obj.title+"---"+obj.date+"--"+getExpiredOrNot(obj)}</Option>
                        )
                      })  }
                       </Select>
                     </Form.Item>
       </Col>
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
