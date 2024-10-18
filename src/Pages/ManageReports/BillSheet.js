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

const AddProductForm = ({ setProducts,draws,products}) => {
  const [form] = Form.useForm();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawdate,setDrawdate]=useState(null)
  const [selecteddraw,setSelectedDraw]=useState(null)
 
  const generatePDFReport = (data) => {
    console.log(data)
    const doc = new jsPDF();
  
    // Define header and footer
    const header = () => {
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text('Bill Sheet Report', 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 84, 28);
    };
    
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
        doc.setFontSize(10);
        doc.text(`Draw: ${drawdate.date}`, 150, 30);
        doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
  
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`Report ${index + 1}`, 14, 40);
  
      // Second Prizes table
      // doc.autoTable({
      //   startY: 50,
      //   head: [['firstprize','secondprize1', 'secondprize2', 'secondprize3', 'secondprize4', 'secondprize5']],
      //   body: [
      //     [
      //       data.firstprize || 'N/A',
      //       data.secondprize1,
      //       data.secondprize2,
      //       data.secondprize3,
      //       data.secondprize4,
      //       data.secondprize5
      //     ]
      //   ],
      //   theme: 'grid',
      //   styles: {
      //     fontSize: 10,
      //     textColor: 80,
      //   },
      //   headStyles: {
      //     fillColor: [240, 240, 240],
      //     textColor: 40,
      //     fontSize: 11,
      //   }
      // });
      doc.autoTable({
        startY: 50,
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
  
  
      const totalPrizes = Number(totalFp )+ Number(totalSs) 
      const commissionValue = report.comission.comission;
      const commissionAmount = report.comission.comission===0?report.comission.comission:(((totalF + totalS)*Number(report.comission.comission))/100);
      const pcPercentageAmount = report.comission.pcpercentage===0?report.comission.pcpercentage:(((totalF + totalS)*Number(report.comission.pcpercentage))/100);
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
     
      doc.text(`Total Sale: ${totalF + totalS}`, 14, doc.autoTable.previous.finalY + 25);
      doc.text(`Total Comsission: ${pcPercentageAmount+commissionAmount}`, 14, doc.autoTable.previous.finalY + 30);
      doc.text(`Safi Sale: ${(totalF + totalS)-pcPercentageAmount-commissionAmount}`, 14, doc.autoTable.previous.finalY + 35);
      doc.text(`Total Prizes: ${totalPrizes}`, 14, doc.autoTable.previous.finalY + 40);
      doc.text(`Bill: ${((totalF + totalS)- Number(totalPrizes)-pcPercentageAmount-commissionAmount).toFixed(2)}`, 14, doc.autoTable.previous.finalY + 45);
      // doc.text(`Net Total: ${(totalF + totalS)-pcPercentageAmount-commissionAmount}`, 14, doc.autoTable.previous.finalY + 60);

      footer(doc.internal.getNumberOfPages());
    });
  
    doc.save('BillSheetReport.pdf');
  };
  const generateSummarisedreportpdf = async (arr) => {
    let dataarr = [];
    const doc = new jsPDF();
  
    // Define header and footer
    const header = () => {
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text('Bill Sheet Report', 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    };
  
    const footer = (pageNumber) => {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${pageNumber}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    };
    arr.majorsalesreport.forEach((report) => {
      let totalFp = report.prize.tempobj.f;
      let totalSs = report.prize.tempobj.s;
      let totalF = report.prize.tempsale.f;
      let totalS = report.prize.tempsale.s;
      const totalPrizes = Number(totalFp )+ Number(totalSs) 
      const commissionValue = report.comission.comission;
      const commissionAmount = commissionValue === 0 ? 0 : ((totalF + totalS) * commissionValue) / 100;
      const pcPercentageAmount = report.comission.pcpercentage === 0 ? 0 : ((totalF + totalS) * report.comission.pcpercentage) / 100;
      const pcPercentageValue = report.comission.pcpercentage;
      const grandTotal = totalF + totalS;
      const safitotal = grandTotal - pcPercentageAmount - commissionAmount;
      const nettotal = grandTotal - pcPercentageAmount - commissionAmount- Number(totalPrizes);
      const name = report.name
      const username=report.username
  
      dataarr.push({
        commissionValue,
        commissionAmount: commissionAmount.toFixed(2),
        pcPercentageAmount: pcPercentageAmount.toFixed(2),
        pcPercentageValue,
        grandTotal: grandTotal.toFixed(2),
        safitotal: safitotal.toFixed(2),
        nettotal: nettotal.toFixed(2),
        name,
        totalPrizes,
        username
      });
    });
  
    // Add header to PDF
    header();
  
    // Define the table columns and rows
    const columns = [
      { header: 'Name', dataKey: 'name' },
      { header: 'Username', dataKey: 'username' },
      // { header: 'Commission Value', dataKey: 'commissionValue' },
      { header: 'Commission', dataKey: 'commissionAmount' },
      { header: 'PC Percentage', dataKey: 'pcPercentageAmount' },
      { header: 'Prize', dataKey: 'totalPrizes' },
      { header: 'Grand Total', dataKey: 'grandTotal' },
      { header: 'Safi Total', dataKey: 'safitotal' },
      { header: 'Net Total', dataKey: 'nettotal' },
    ];
  
    const rows = dataarr;
  
    // Generate the table
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 40,
      showHead: 'firstPage',
      didDrawPage: (data) => {
        // Footer
        footer(doc.internal.getNumberOfPages());
      },
    });
  
    // Save the PDF
    doc.save('bill_sheet_report.pdf');
  };
  
  const generateSummarisedreport = async () => {
   setLoading(true)
try{
  const token = localStorage.getItem('token');
      
  if (!token) {
    console.error('Token not found in local storage');
    
    return;
  }
  if(!selecteddraw){
    alert('Select a valid Draw');
    return;
  }
  const response = await fetch(`${linkurl}/report/getBillSheetReportforalldistributor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify({
      date:selecteddraw
    }),
  });
  if (response.ok) {
    const userData = await response.json();
 generateSummarisedreportpdf(userData)
      // downloadinvoice4(drawarrtosend,values)
    // form.resetFields();
  } else {
    const userData = await response.json();
    alert(userData.Message)
  }
}catch(e){
  alert(e)
}
setLoading(false)
  }
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      if(values.dealer!=="allcombined"){
        const response = await fetch(`${linkurl}/report/getBillSheetReportforparticulardistributor`, {
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
       
        generatePDFReport(userData)
        // form.resetFields();
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }
}
else if (values.dealer==="allcombined"){
  const response = await fetch(`${linkurl}/report/getBillSheetReportforalldistributor`, {
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
const updateBalance=async()=>{
  // getBalanceUpdated
  setLoading(true)
  try{
    const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      if(!selecteddraw){
        alert('Select a valid Draw');
        return;
      }
    const response = await fetch(`${linkurl}/report/getBalanceUpdated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        date:selecteddraw
      }),
    });
    if (response.ok) {
      const userData = await response.json();
      console.log(userData)
      // form.resetFields();
    } else {
      const userData = await response.json();
      alert(userData.Message)
    }
  }catch(e){
    alert(e.message)
  }
  setLoading(false)
}

  return (
    <div>

    {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
          <p>Please Wait...</p>
        </div>):
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
                        setDrawdate(temp)
                        setSelectedDraw(e)
                      }}
                        dropdownStyle={{ maxHeight: 150, overflow: 'auto' }}>
                        
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
                      name={ 'dealer'}
                        rules={[{ required: true, message: 'Please select dealer' }]}
                        className="flex-item"
                        fieldKey={ 'dealer'}
                      >
                            <Select placeholder="Select dealer">
                  <Option value={"allcombined"}>All Distributors</Option>
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
                      onClick={generateSummarisedreport}
                      icon={<SaveFilled/>}>
        Summarized Bill Sheet
      </Button>
      {" "}
      <Button  
      onClick={updateBalance}
      style={{
            borderRadius:10,
                background: COLORS.savegradient,
                color:"white"
                      }}
                      icon={<SaveFilled/>}>
        Balance Updated
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
