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

const AddProductForm = ({draws,userdata, setProducts,products}) => {
  const [form] = Form.useForm();
  const [drawdate,setDrawdate]=useState(null)
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
 const getAllbill=async()=>{
console.log(drawdate)
setLoading(true)
try {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('Token not found in local storage');
    
    return;
  }
    const response = await fetch(`${linkurl}/report/getAllSellBill`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify({
      draw:drawdate
    }),
  });
  if (response.ok) {
    const userData = await response.json();
    let sheets=[]
    for(let i=0;i<userData.sheets.length;i++){
      sheets.push({sheetname:userData.sheets[i].sheetname,total:Number(userData.sheets[i].result.tempsale.f)+Number(userData.sheets[i].result.tempsale.s)+Number(userData.sheets[i].result.tempsalefour.f)+Number(userData.sheets[i].result.tempsalefour.s),prize:Number(userData.sheets[i].result.tempobj.f)+Number(userData.sheets[i].result.tempobj.s)})
    }
    // let tempobj=userData.drawarrtosend;
    generatePDFReport1(sheets)
    // form.resetFields();
  } else {
    const userData = await response.json();
    alert(userData.Message)
  }
}catch(error){
  alert(error.message)
}

setLoading(false)
 }
 const generatePDFReport1 = (data) => {
  const doc = new jsPDF();

  // Define header and footer
  const header = () => {
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('General Sale + Oversale Report', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 124, 22);
  };

  if (userdata && userdata.username) {
    doc.setFontSize(10);
    doc.text(`User: ${userdata.name}`, 14, 30);
    doc.text(`Username: ${userdata.username}`, 80, 30);
    doc.text(`Draw: ${drawdate.date}`, 150, 30);
    doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
  }

  const footer = (pageNumber) => {
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Page ${pageNumber}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
  };

  header();

  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);

  // Prepare table data with cell styles
  const tableData = data.map(sheet => [
    { content: sheet.sheetname || 'N/A', styles: { fontStyle: 'normal' } },
    { content: sheet.total, styles: { fontStyle: 'normal' } },
    { content: sheet.prize, styles: { fontStyle: 'normal' } }
  ]);

  // Calculate totals
  const totalSale = data.reduce((sum, sheet) => sum + sheet.total, 0);
  const totalPrize = data.reduce((sum, sheet) => sum + sheet.prize, 0);

  // Add totals row with bold style
  tableData.push([
    { content: 'Total', styles: { fontStyle: 'bold' } },
    { content: totalSale, styles: { fontStyle: 'bold' } },
    { content: totalPrize, styles: { fontStyle: 'bold' } }
  ]);

  // Configure and draw the table
  doc.autoTable({
    startY: 50,
    head: [['Sheet Name', 'Total Sale', 'Total Prize']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      textColor: 80,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: 40,
      fontSize: 11,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 80 }, // Sheet Name column
      1: { cellWidth: 50, halign: 'right' }, // Total Sale column
      2: { cellWidth: 50, halign: 'right' }  // Total Prize column
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    didDrawPage: function(data) {
      footer(doc.internal.getNumberOfPages());
    },
    margin: { top: 50, left: 14, right: 14, bottom: 20 }
  });

  // Add summary below table
  const finalY = doc.autoTable.previous.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text(`Total Summary`, 14, finalY);
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Total Sale Amount: ${totalSale.toFixed(2)}`, 14, finalY + 7);
  doc.text(`Total Prize Amount: ${totalPrize.toFixed(2)}`, 14, finalY + 14);
  doc.text(`Net Amount: ${(totalSale - totalPrize).toFixed(2)}`, 14, finalY + 21);

  // Add timestamp and user info at the bottom
  const bottomY = doc.internal.pageSize.height - 20;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Generated by: ${userdata?.username || 'Unknown User'}`, 14, bottomY);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, bottomY + 5);

  doc.save('AllSellBill.pdf');
};
  const generatePDFReport = (data) => {
    const doc = new jsPDF();
  
    // Define header and footer
    const header = () => {
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text('Bill Sheet Report', 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 84, 22);
    };
    if (userdata && userdata.username) {
      doc.setFontSize(10);
      doc.text(`User: ${userdata.name}`, 14, 30);
      doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${drawdate.date}`, 150, 30);
      doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    }
  
    const footer = (pageNumber) => {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${pageNumber}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    };
  
    data.majorsalesreport.forEach((report, index) => {
      if (index !== 0) {
        doc.addPage();
      }
  
      header();
  
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`Report ${index + 1}`, 14, 40);
  
      // Second Prizes table
      doc.autoTable({
        startY: 50,
        head: [['firstprize','secondprize1', 'secondprize2', 'secondprize3', 'secondprize4', 'secondprize5']],
        body: [
          [
            data.firstprize || 'N/A',
            data.secondprize1,
            data.secondprize2,
            data.secondprize3,
            data.secondprize4,
            data.secondprize5
          ]
        ],
        theme: 'grid',
        styles: {
          fontSize: 10,
          textColor: 80,
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: 40,
          fontSize: 11,
        }
      });
      doc.autoTable({
        startY: 80,
        head: [['Name','Username', 'Comission', 'Pc percentage']],
        body: [
          [
            report.name,
            report.username,
            report.comission.comission,
            report.comission.pcpercentage
          ]
        ],
        theme: 'grid',
        styles: {
          fontSize: 10,
          textColor: 80,
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: 40,
          fontSize: 11,
        }
      });
      let totalFp = report.prize.tempobj.f;
      let totalSs = report.prize.tempobj.s;
      let totalF = report.prize.tempsale.f;
      let totalS = report.prize.tempsale.s;
      let totalFfour = report.prize.tempsalefour.f;
      let totalSfour = report.prize.tempsalefour.s;
  
  
      const totalPrizes = Number(totalFp )+ Number(totalSs) 
      const commissionValue = report.comission.comission;
      const commissionAmount = report.comission.comission===0?report.comission.comission:(((totalF + totalS)*Number(report.comission.comission))/100);
      const pcPercentageAmount = report.comission.pcpercentage===0?report.comission.pcpercentage:(((totalFfour + totalSfour)*Number(report.comission.pcpercentage))/100);
      const pcPercentageValue = report.comission.pcpercentage;
  
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      // doc.text(`Totals:`, 14, doc.autoTable.previous.finalY + 10);
      doc.setTextColor(80, 80, 80);
      // doc.text(`Total F: ${totalF}`, 14, doc.autoTable.previous.finalY + 15);
      // doc.text(`Total S: ${totalS}`, 14, doc.autoTable.previous.finalY + 20);
      // doc.text(`Grand Total: ${totalF + totalS}`, 14, doc.autoTable.previous.finalY + 20);
      // doc.text(`Total Prizes: ${totalPrizes}`, 14, doc.autoTable.previous.finalY + 25);
      // // doc.text(`Commission: ${commissionValue}`, 14, doc.autoTable.previous.finalY + 35);
      // // doc.text(`PC Percentage: ${pcPercentageValue}%`, 14, doc.autoTable.previous.finalY + 40);
      // // doc.text(`Commission Amount: ${commissionAmount }%`, 14, doc.autoTable.previous.finalY + 45);
      // // doc.text(`PC Percentage Amount: ${pcPercentageAmount}`, 14, doc.autoTable.previous.finalY + 50);
      // doc.text(`Total Comsission: ${pcPercentageAmount+commissionAmount}`, 14, doc.autoTable.previous.finalY + 30);
      // doc.text(`Safi Sale: ${(totalF + totalS)-pcPercentageAmount-commissionAmount}`, 14, doc.autoTable.previous.finalY + 35);
      // doc.text(`Net Total: ${(totalF + totalS)- Number(totalPrizes)-pcPercentageAmount-commissionAmount}`, 14, doc.autoTable.previous.finalY + 40);
     
      doc.text(`Total Sale: ${totalF + totalS+totalFfour+totalSfour}`, 14, doc.autoTable.previous.finalY + 25);
      doc.text(`Total Comsission: ${pcPercentageAmount+commissionAmount}`, 14, doc.autoTable.previous.finalY + 30);
      doc.text(`Safi Sale: ${(totalF + totalS+totalFfour+totalSfour)-pcPercentageAmount-commissionAmount}`, 14, doc.autoTable.previous.finalY + 35);
      doc.text(`Total Prizes: ${totalPrizes}`, 14, doc.autoTable.previous.finalY + 40);
      doc.text(`Bill: ${((totalF + totalS+totalFfour+totalSfour)- Number(totalPrizes)-pcPercentageAmount-commissionAmount).toFixed(2)}`, 14, doc.autoTable.previous.finalY + 45);
      // doc.text(`Net Total: ${(totalF + totalS)-pcPercentageAmount-commissionAmount}`, 14, doc.autoTable.previous.finalY + 60);

      footer(doc.internal.getNumberOfPages());
    });
  
    doc.save('MajorsalesReport.pdf');
  };

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      if(values.saletype==="sale"){
        const response = await fetch(`${linkurl}/report/getBillSheetReportforparticularmerchantme`, {
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
        console.log(userData)
        let tempobj=userData.drawarrtosend;
        generatePDFReport(userData)
        // form.resetFields();
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }
}
else if (values.saletype==="oversale"){
  const response = await fetch(`${linkurl}/report/getBillSheetReportforparticularmerchantmeoversale`, {
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
 generatePDFReport(userData)
      // downloadinvoice4(drawarrtosend,values)
    // form.resetFields();
  } else {
    const userData = await response.json();
    alert(userData.Message)
  }
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
    <Form form={form} 
    initialValues={{ saletype: 'sale' }} onFinish={onFinish} layout="vertical">
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
                        const temp=draws.find((obj)=>obj.date===e)
                        setDrawdate(temp)}}
                        dropdownStyle={{ maxHeight: 150, overflow: 'auto' }}>
                        
                      {draws.map((obj)=>{
                        return(
                          <Option style={{color:getExpiredOrNot(obj)==="active"?"green":'red'}} value={obj.date}>{obj.title+"---"+obj.date+"--"+getExpiredOrNot(obj)}</Option>
                        )
                      })  }
                       </Select>
                     </Form.Item>
       </Col>
                      <Col xs={24} sm={8}>
        <Form.Item
        label={"Sale type"}
                      name={ 'saletype'}
                        rules={[{ required: true, message: 'Please select ' }]}
                        className="flex-item"
                        fieldKey={ 'saletype'}
                      >
                        <Select placeholder="Select" >
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
        Bill Sheet
      </Button>
      {" "}
      <Button   style={{
            borderRadius:10,
                background: COLORS.primarygradient,
                color:"white"
                      }}
                      icon={<SaveFilled/>}
                      onClick={getAllbill}
                      >
        All Sell Bill
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
