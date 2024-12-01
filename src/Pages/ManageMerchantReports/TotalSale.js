import React, { useEffect, useState,useRef } from 'react';
import { Form, Input, Button, Select, Modal,Card,Table,Space, Row, Col,DatePicker,Upload ,message,Tabs,Spin} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import { linkurl } from '../../link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CheckCircleFilled, CloseCircleFilled, DeleteFilled, PlusCircleFilled, SaveFilled, ScanOutlined, SecurityScanFilled,SearchOutlined } from '@ant-design/icons';
const { Option } = Select;

const AddProductForm = ({userdata,draws, setProducts,products}) => {
  const [form] = Form.useForm();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [drawdate,setDrawdate]=useState(null)
  const [drawcomplete, setDrawComplete] = useState(null);
  const [soldvalues, setSoldValues] = useState([]);
  const [loading, setLoading] = useState(false);
 
  
  const downloadinvoice = (arr, values,userData1) => {
    let filteredPayments = [
      ...arr.drawarrtosend
    ];
    let arr1 = filteredPayments.filter((obj) => obj.bundle.length === 1);
    let arr2 = filteredPayments.filter((obj) => obj.bundle.length === 2);
    let arr3 = filteredPayments.filter((obj) => obj.bundle.length === 3);
    let arr4 = filteredPayments.filter((obj) => obj.bundle.length === 4);
    let totalFirst1 = 0;
    let totalSecond1 = 0;
    let total1 = 0;
    let temparr = [arr1, arr2, arr3, arr4];
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.setTextColor(40);
    if(values.saletype==="sale"){
      doc.text('Total General Sale Report', 14, 22);
    }else{
      doc.text('Total Over Sale Report', 14, 22);

    }
  
    doc.setFontSize(10);
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${drawdate.date}`, 150, 30);
      doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    }
  
    let startY = 40; // Initial Y position for the first section
    let startX = 14; // Initial X position
    const blockWidth = 15; // Smaller width for each block
    const blockHeight = 8; // Smaller height for each block
  
    temparr.forEach((filteredPayments, arrIndex) => {
      
      if(filteredPayments.length>0){
      filteredPayments.forEach((pay) => {
        totalFirst1 += parseFloat(pay.f) || 0;
        totalSecond1 += parseFloat(pay.s) || 0;
        total1 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
      })
    }
    })
    
    doc.setFontSize(12);
    // doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
    // doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(2)}`, 14, startY);
    startY += 10; // Add some spacing before the totals
  
    temparr.forEach((filteredPayments, arrIndex) => {
      
      if(filteredPayments.length>0){
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
  
        // Draw f block with dark blue background and white text
        doc.setFillColor(75, 0, 130); // Dark blue background
        doc.setDrawColor(75, 0, 130); // Dark blue border
        doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
        doc.text("First", startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
        // Draw s block with dark blue background and white text
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
  
        // Draw bundle block with grey background and dark blue/purplish border
        doc.setFillColor(211, 211, 211); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.setTextColor(0, 0, 0); // White text
        doc.rect(startX, startY, blockWidth, blockHeight, 'FD');
        let  isFirstInRed=false;
            let isFSecondInRed=false
            if(userData1){
              isFirstInRed = userData1.firstprefixes.includes(pay.bundle);
              isFSecondInRed =userData1.secondprefixes1.includes(pay.bundle) || userData1.secondprefixes2.includes(pay.bundle)||userData1.secondprefixes3.includes(pay.bundle)||userData1.secondprefixes4.includes(pay.bundle)||userData1.secondprefixes5.includes(pay.bundle);
              
            }
            if (isFirstInRed) {
                doc.setTextColor(255, 0, 0); // Red text
            } else {
                doc.setTextColor(0, 0, 0); // Black text
            }
            if (!(isFirstInRed) && isFSecondInRed) {
             doc.setTextColor(0, 0, 255); // Blue text
            } 
        doc.text(pay.bundle.toString(), startX + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
        // Draw f block with dark blue/purplish border
        doc.setFillColor(255, 255, 255); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
        doc.text(pay.f.toString(), startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
        // Draw s block with dark blue/purplish border
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
      doc.text(`Total First : ${totalFirst}`, 14, startY);
      doc.text(`Total Second : ${totalSecond}`, 64, startY);
      doc.text(`Total : ${total}`, 114, startY);
  
      startY += 5; // Adjust startY for the totals
    }
    });
  
    // Add totals at the end of the tables
    startY += 10; // Add some spacing before the totals
  
    doc.setFontSize(12);
    // doc.setFont(undefined, 'bold');
    // doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
    // doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
    // doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);
    // doc.setFont(undefined, 'normal');
    if(values.saletype==="sale"){
      doc.save('merchant_total_genral_sale_report.pdf');
    }else{
      doc.save('merchant_total_over_sale_report.pdf');

    }
  };
  
  const downloadinvoice2 = (arr, values,userData1) => {
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text('Total Sale Report Sale', 14, 22);
 
    let filteredPayments = [
      ...arr.combineddrawarrtosend
    ];
    let totalFirst1 = 0;
    let totalSecond1 = 0;
    let total1 = 0;
    let totalFirst2 = 0;
    let totalSecond2 = 0;
    let total2 = 0;
    let totalFirstf = 0;
    let totalSecondf = 0;
    let totalf = 0;
    
      filteredPayments.forEach((pay) => {
        totalFirst1 += parseFloat(pay.f) || 0;
        totalSecond1 += parseFloat(pay.s) || 0;
        total1 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
      })
      arr.drawarrtosend.forEach((pay) => {
        totalFirst2 += parseFloat(pay.f) || 0;
        totalSecond2 += parseFloat(pay.s) || 0;
        total2 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
      })
    totalFirstf=totalFirst1+totalFirst2
    totalSecondf=totalSecond1+totalSecond2
    totalf=total1+total2
    // doc.text(`Total of First: ${totalFirstf.toFixed(2)}`, 14, 42);
    // doc.text(`Total of Second: ${totalSecondf.toFixed(2)}`, 84, 42);
    doc.text(`Total: ${totalf.toFixed(2)}`, 14, 42);
    for (let i=0;i<2;i++){
    
    let arr1 = filteredPayments.filter((obj) => obj.bundle.length === 1);
    let arr2 = filteredPayments.filter((obj) => obj.bundle.length === 2);
    let arr3 = filteredPayments.filter((obj) => obj.bundle.length === 3);
    let arr4 = filteredPayments.filter((obj) => obj.bundle.length === 4);
    
    let temparr = [arr1, arr2, arr3, arr4];
  if(i===1){
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text('Total Sale Report OverSale', 14, 22);
  }
  
  
    doc.setFontSize(10);
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${drawdate.date}`, 150, 30);
      doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    }
  
    let startY = 35; // Initial Y position for the first section
    let startX = 14; // Initial X position
    const blockWidth = 15; // Smaller width for each block
    const blockHeight = 8; // Smaller height for each block
  
    
    doc.setFontSize(12);
    // doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
    // doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
    // doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);
    startY += 10; // Add some spacing before the totals
  
    temparr.forEach((filteredPayments, arrIndex) => {
      if(filteredPayments.length>0){
        
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
  
        // Draw f block with dark blue background and white text
        doc.setFillColor(75, 0, 130); // Dark blue background
        doc.setDrawColor(75, 0, 130); // Dark blue border
        doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
        doc.text("First", startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
        // Draw s block with dark blue background and white text
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
  
        // Draw bundle block with grey background and dark blue/purplish border
        doc.setFillColor(211, 211, 211); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.setTextColor(0, 0, 0); // White text
        doc.rect(startX, startY, blockWidth, blockHeight, 'FD');
        let  isFirstInRed=false;
        let isFSecondInRed=false
        if(userData1){
          isFirstInRed = userData1.firstprefixes.includes(pay.bundle);
          isFSecondInRed =userData1.secondprefixes1.includes(pay.bundle) || userData1.secondprefixes2.includes(pay.bundle)||userData1.secondprefixes3.includes(pay.bundle)||userData1.secondprefixes4.includes(pay.bundle)||userData1.secondprefixes5.includes(pay.bundle);
          
        }
            if (isFirstInRed) {
                doc.setTextColor(255, 0, 0); // Red text
            } else {
                doc.setTextColor(0, 0, 0); // Black text
            }
            if (!(isFirstInRed) && isFSecondInRed) {
             doc.setTextColor(0, 0, 255); // Blue text
            } 
        doc.text(pay.bundle.toString(), startX + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
        // Draw f block with dark blue/purplish border
        doc.setFillColor(255, 255, 255); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
        doc.text(pay.f.toString(), startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
        // Draw s block with dark blue/purplish border
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
      doc.text(`Total First : ${totalFirst}`, 14, startY);
      doc.text(`Total Second : ${totalSecond}`, 54, startY);
      doc.text(`Total : ${total}`, 94, startY);
  
      startY += 5; // Adjust startY for the totals
    }
    });
  
    // Add totals at the end of the tables
    startY -=5; // Add some spacing before the totals
  
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    if(i===0){
      doc.text(`Total : ${total1}`, 134, startY);
    }else{
      
      doc.text(`Total : ${total2}`, 134, startY);
    }
    
    // if(i===0){
    //   doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
    //   doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
    //   doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);
    // }else{
    //   doc.text(`Total of First: ${totalFirst2.toFixed(2)}`, 14, startY);
    // doc.text(`Total of Second: ${totalSecond2.toFixed(2)}`, 84, startY);
    // doc.text(`Total: ${total2.toFixed(2)}`, 154, startY);
    // }
    
    doc.setFont(undefined, 'normal');
    doc.addPage();
    startY = 20; 
    filteredPayments = [
      ...arr.drawarrtosend
    ];
    }
    doc.save('merchant_total_combined_sale_report.pdf');
  };
  

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/report/getTotalSaleforparticularmerchantbyme`, {
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
        // let tempobj={...userData[0]};
        // setDrawComplete(tempobj)
        // let temp=combineSoldValues(getSoldKeys(tempobj.type));
        if(values.saletype==="combined"){
          const response1 = await fetch(`${linkurl}/report/getPrefixes/${values.date}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            }
          });
          if (response1.ok) {
            const userData1 = await response1.json();
            downloadinvoice2(userData,values,userData1);
          } else {
            const userData = await response.json();
            alert(userData.Message)
          }
          // downloadinvoice2(userData,values)
        }else{
          const response1 = await fetch(`${linkurl}/report/getPrefixes/${values.date}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            }
          });
          if (response1.ok) {
            const userData1 = await response1.json();
            downloadinvoice(userData,values,userData1);
            setSoldValues(userData)
          } else {
            const userData = await response.json();
            alert(userData.Message)
          }
          // downloadinvoice(userData,values)
        }
        // form.resetFields();
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
          <Spin size="large" />
          <p>Please Wait...</p>
        </div>):
    <Form form={form} onFinish={onFinish}
    initialValues={{ saletype: 'combined' }} layout="vertical">
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
                        setDrawdate(temp)}}
                        
      dropdownStyle={{ maxHeight: 150, overflow: 'auto' }}
                        >
                        
                      {draws.map((obj)=>{
                        return(
                          <Option style={{color:getExpiredOrNot(obj)==="active"?"green":'red'}} value={obj.date}>{obj.title+"---"+obj.date+"--"+getExpiredOrNot(obj)}</Option>
                        )
                      })  }
                       </Select>
                     </Form.Item>
      </Col>
      
      <Col xs={24} sm={12}>
        <Form.Item
        label={"Sale type"}
                      name={ 'saletype'}
                        rules={[{ required: true, message: 'Please select ' }]}
                        className="flex-item"
                        fieldKey={ 'saletype'}
                      >
                        <Select placeholder="Select" >
                        <Option value={"combined"}>Combined</Option>
                          <Option value={"sale"}>General Sale</Option>
                          <Option value={"oversale"}>Oversale</Option>
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
