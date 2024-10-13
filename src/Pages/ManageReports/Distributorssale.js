import React, { useState } from 'react';
import { Form, Input, Button, Select, Modal, Row, Col, Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SaveFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import COLORS from '../../colors';
import { linkurl } from '../../link';

const { Option } = Select;

const AddProductForm = ({ userdata,draws, setProducts, products }) => {
  const [form] = Form.useForm();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [drawdate,setDrawdate]=useState(null)
  const [loading, setLoading] = useState(false);

  const downloadinvoice = (userData) => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.text('Total Sale Report', 14, 22);
  


    let currentY = 42; // Initial Y position for tables
    const tableMargin = 10; // Margin between tables
    userData.forEach((arr) => {
      const filteredPayments = [...arr.drawarrtosend];
      if(filteredPayments.length!==0){
        let arr1=filteredPayments.filter((obj)=>obj.bundle.length===1)
        let arr2=filteredPayments.filter((obj)=>obj.bundle.length===2)
        let arr3=filteredPayments.filter((obj)=>obj.bundle.length===3)
        let arr4=filteredPayments.filter((obj)=>obj.bundle.length===4)

        let totalFirst1 = 0;
          let totalSecond1 = 0;
          let total1 = 0;
        let temparr=[arr1,arr2,arr3,arr4]
   
 
        let startY = 40; // Initial Y position for the first section
        let startX = 14; // Initial X position
        const blockWidth = 15; // Smaller width for each block
        const blockHeight = 8; // Smaller height for each block
    if (userdata && userdata.username) {
      doc.text(`User: ${arr.name}`, 14, 30);
      doc.text(`Username: ${arr.username}`, 80, 30);
      doc.text(`Draw: ${drawdate.date}`, 150, 30);
      doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    }
  
        temparr.forEach((filteredPayments, arrIndex) => {
          if(filteredPayments.length>0){
          // Add a section title for each filteredPayments array
          // startY += 5; // Add space before each section title
          startX = 14; // Reset X position for each section
          let totalFirst = 0;
          let totalSecond = 0;
          let total = 0;
          for (let k = 0; k < 4; k++) {
            // Draw bundle block with dark blue background and white text
            doc.setFillColor(75, 0, 130); // Dark blue background
            doc.setDrawColor(75, 0, 130); // Dark blue border
            doc.rect(startX, startY, blockWidth, blockHeight, 'FD');
            doc.setTextColor(255, 255, 255); // White text
            doc.text("Bundle", startX + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
            // Draw first value block with dark blue background and white text
            doc.setFillColor(75, 0, 130); // Dark blue background
            doc.setDrawColor(75, 0, 130); // Dark blue border
            doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
            doc.text("First", startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
            // Draw second value block with dark blue background and white text
            doc.setFillColor(75, 0, 130); // Dark blue background
            doc.setDrawColor(75, 0, 130); // Dark blue border
            doc.rect(startX + 2 * blockWidth, startY, blockWidth, blockHeight, 'FD');
            doc.text("Second", startX + 2 * blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
            // Move to the next block position
            startX += 3 * blockWidth;
  
            // Check if we need to move to the next row
            if (startX + 3 * blockWidth > doc.internal.pageSize.width - 14) {
                startX = 14; // Reset X position
                startY += blockHeight; // Move to the next row
  
                // Check if we need to add a new page
                if (startY + blockHeight > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    startY = 20; // Reset Y position for the new page
                }
            }
        }
  
        filteredPayments.forEach((pay) => {
            totalFirst += parseFloat(pay.f) || 0;
            totalSecond += parseFloat(pay.s) || 0;
            total += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
            totalFirst1 += parseFloat(pay.f) || 0;
            totalSecond1 += parseFloat(pay.s) || 0;
            total1 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
  
            // Draw bundle block with grey background and dark blue/purplish border
            doc.setFillColor(211, 211, 211); // Grey background
            doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
            doc.setTextColor(0, 0, 0); // Black text
            doc.rect(startX, startY, blockWidth, blockHeight, 'FD');
            doc.text(pay.bundle.toString(), startX + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
            // Draw first value block with white background and dark blue/purplish border
            doc.setFillColor(255, 255, 255); // White background
            doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
            doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
            doc.text(pay.f.toString(), startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
            // Draw second value block with white background and dark blue/purplish border
            doc.setFillColor(255, 255, 255); // White background
            doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
            doc.rect(startX + 2 * blockWidth, startY, blockWidth, blockHeight, 'FD');
            doc.text(pay.s.toString(), startX + 2 * blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
            // Move to the next block position
            startX += 3 * blockWidth;
  
            // Check if we need to move to the next row
            if (startX + 3 * blockWidth > doc.internal.pageSize.width - 14) {
                startX = 14; // Reset X position
                startY += blockHeight; // Move to the next row
  
                // Check if we need to add a new page
                if (startY + blockHeight > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    startY = 20; // Reset Y position for the new page
                }
            }
        });
  
        // Move startY down for the next section
        startY += blockHeight + 10;
        doc.setFontSize(10);
        doc.text(`Total First: ${totalFirst.toFixed(2)}`, 14, startY);
        doc.text(`Total Second: ${totalSecond.toFixed(2)}`, 84, startY);
        doc.text(`Total: ${total.toFixed(2)}`, 154, startY);
        startY += 5;
      }
    });
    const pageHeight = doc.internal.pageSize.height;
    const spaceNeeded = 30; // Space needed for the totals
  
    if (startY + spaceNeeded > pageHeight) {
        doc.addPage();
        startY = 20; // Reset Y position for the new page
    } else {
        startY += 10; // Add some spacing before the totals
    }
        // Add totals outside the table at the end of the tables
        doc.setFontSize(10);
        doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
        doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
        doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);
   
      doc.addPage();
          }
   
    });

    doc.save('admin_total_sale_report.pdf');
  };

  const onFinish = async (values) => {
    if(values.dealer==="alldistributors"){
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
  
        if (!token) {
          console.error('Token not found in local storage');
          return;
        }
  
        const response = await fetch(`${linkurl}/report/getDistributorSaleVoucherReportforalldistributor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            ...values
          }),
        });
  
        if (response.ok) {
          const userData = await response.json();
          downloadinvoice(userData);
          // form.resetFields();
        } else {
          const userData = await response.json();
          alert(userData.Message);
        }
      } catch (error) {
        alert(error.message);
      }
  
     
    }else{
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
  
        if (!token) {
          console.error('Token not found in local storage');
          return;
        }
  
        const response = await fetch(`${linkurl}/report/getDistributorSaleVoucherReportforparticulardistributor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            ...values
          }),
        });
  
        if (response.ok) {
          const userData = await response.json();
          downloadinvoice(userData);
          // form.resetFields();
        } else {
          const userData = await response.json();
          alert(userData.Message);
        }
      } catch (error) {
        alert(error.message);
      }
  
     
    }
    setLoading(false);
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
        </div>
      ) : (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={16}>
          <Col xs={24} sm={12}>
       <Form.Item
       label={"Select Draw"}
                     name={ 'date'}
                       rules={[{ required: true, message: 'Please select draw' }]}
                       className="flex-item"
                       fieldKey={ 'date'}
                     >
                        <Select placeholder="Select draw"  onChange={(e)=>{
                        const temp=draws.find((obj)=>obj.date===e)
                        setDrawdate(temp)}}>
                        
                        
                      {draws.map((obj)=>{
                        return(
                          <Option value={obj.date}>{obj.title+"---"+obj.date}</Option>
                        )
                      })  }
                       </Select>
                     </Form.Item>
                     </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={"Dealer"}
                name={'dealer'}
                rules={[{ required: true, message: 'Please select dealer' }]}
                className="flex-item"
                fieldKey={'dealer'}
              >
                <Select placeholder="Select dealer">
                  <Option value={"alldistributors"}>All Distributors</Option>
                  {products.map((element) => {
                    return (
                      <Option key={element._id} value={element._id}>{element.username}</Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              style={{
                borderRadius: 10,
                background: COLORS.primarygradient,
                color: "white"
              }}
              icon={<SaveFilled />}
              htmlType="submit"
            >
              Get Report
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
                icon={<CloseCircleFilled />}
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
        </Form>
      )}
    </div>
  );
};

export default AddProductForm;
