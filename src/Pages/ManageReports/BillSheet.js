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

const AddProductForm = ({ userdata,setProducts,draws,products}) => {
  const [form] = Form.useForm();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawdate,setDrawdate]=useState(null)
  const [selecteddraw,setSelectedDraw]=useState(null)
  const generatePDFReport = (data) => {
    // Create a new jsPDF document with A4 size (you can also use 'letter' if preferred)
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Define header with increased font sizes and adjusted positions
    const header = () => {
      doc.setFontSize(22); // Increased header font size
      doc.setTextColor(40, 40, 40);
      doc.text('Bill Sheet Report', 40, 40);
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 200, 45);
    };
  
    // Define footer for one-page report
    const footer = () => {
      doc.setFontSize(12);
      doc.setTextColor(150);
      doc.text(`Page 1`, pageWidth - 60, pageHeight - 20);
    };
  
    // Draw header once at the top
    header();
  
    // Draw Information (moved a bit down to allow space for header)
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    // Adjust these positions as needed to balance left/right placement
    doc.text(`Draw: ${drawdate.date}`, pageWidth - 180, 70);
    doc.text(`Draw Title: ${drawdate.title}`, 40, 70);
  
    // For this one-page version, we assume a single report (using the first element)
    const report = data.majorsalesreport[0];
  
    // Report Title with conditional coloring and increased font size
    doc.setFontSize(18);
    if (report.id === userdata._id) {
      doc.setTextColor(0, 0, 255); // Blue text
    } else if (report.role === "merchant") {
      doc.setTextColor(0, 0, 0); // Black text
    } else if (report.role === "distributor" || report.role === "subdistributor") {
      doc.setTextColor(255, 0, 0); // Red text
    } else {
      doc.setTextColor(40, 40, 40); // Default color
    }
    doc.text(`Report 1`, 40, 100);
    doc.setTextColor(40, 40, 40); // Reset to default
  
    // Second Prizes Table with increased font sizes and adjusted spacing
    doc.autoTable({
      startY: 120,
      head: [['First Prize', 'Second Prize 1', 'Second Prize 2', 'Second Prize 3', 'Second Prize 4', 'Second Prize 5']],
      body: [
        [
          data.firstprize || 'N/A',
          data.secondprize1 || 'N/A',
          data.secondprize2 || 'N/A',
          data.secondprize3 || 'N/A',
          data.secondprize4 || 'N/A',
          data.secondprize5 || 'N/A'
        ]
      ],
      theme: 'grid',
      styles: {
        fontSize: 12,
        textColor: 80,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 40,
        fontSize: 13,
      }
    });
  
    // Capture the final Y position after the first table and add some space before the next table
    let currentY = doc.autoTable.previous.finalY + 20;
  
    // User Information Table with increased font sizes
    doc.autoTable({
      startY: currentY,
      head: [['Name', 'Username', 'Commission', 'PC Percentage']],
      body: [
        [
          report.name || 'N/A',
          report.username || 'N/A',
          report.comission.comission !== undefined ? report.comission.comission : 'N/A',
          report.comission.pcpercentage !== undefined ? report.comission.pcpercentage : 'N/A'
        ]
      ],
      theme: 'grid',
      styles: {
        fontSize: 12,
        textColor: 80,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 40,
        fontSize: 13,
      }
    });
  
    // Update current Y after the user info table
    currentY = doc.autoTable.previous.finalY + 20;
  
    // Calculations (unchanged)
    const { prize, comission } = report;
    const totalFp = Number(prize.tempobj.f) || 0;
    const totalSs = Number(prize.tempobj.s) || 0;
    const totalF = Number(prize.tempsale.f) || 0;
    const totalS = Number(prize.tempsale.s) || 0;
    const totalFfour = Number(prize.tempsalefour.f) || 0;
    const totalSfour = Number(prize.tempsalefour.s) || 0;
  
    const totalPrizes = totalFp + totalSs;
    const commissionAmount = comission.comission === 0 ? 0 : ((totalF + totalS) * Number(comission.comission)) / 100;
    const pcPercentageAmount = comission.pcpercentage === 0 ? 0 : ((totalFfour + totalSfour) * Number(comission.pcpercentage)) / 100;
    const totalSales = totalF + totalS + totalFfour + totalSfour;
    const totalCommission = commissionAmount + pcPercentageAmount;
    const safiSale = totalSales - totalCommission;
    const billAmount = safiSale - totalPrizes;
  
    // Summary Table with conditional coloring for the 'Bill' row and increased font sizes
    doc.autoTable({
      startY: currentY,
      head: [['Description', 'Amount']],
      body: [
        ['Safa+Akra+tndola Sale', totalF + totalS],
        ['Pc Sale', totalFfour + totalSfour],
        ['Total Sale', totalSales],
        ['Total Commission', totalCommission.toFixed(0)],
        ['Safi Sale', safiSale.toFixed(0)],
        ['Total Prizes', totalPrizes.toFixed(0)],
        ['Bill', billAmount.toFixed(0)]
      ],
      theme: 'striped',
      styles: {
        fontSize: 18,
        textColor: 80,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: 40,
        fontSize: 13,
        halign: 'left',
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 200 },
        1: { halign: 'left', cellWidth: 200 }
      },
      tableWidth: 'auto',
      didParseCell: function (data) {
        // For the 'Bill' row, apply conditional coloring
        if (data.section === 'body') {
          const description = data.row.raw[0];
          if (description === 'Bill') {
            const amount = parseFloat(data.cell.text);
            data.cell.styles.textColor = amount < 0 ? [255, 0, 0] : [0, 128, 0];
          } else {
            // Apply role-based colors for other rows
            if (report.id === userdata._id) {
              data.cell.styles.textColor = [0, 0, 255];
            } else if (report.role === "merchant") {
              data.cell.styles.textColor = [0, 0, 0];
            } else if (report.role === "distributor" || report.role === "subdistributor") {
              data.cell.styles.textColor = [255, 0, 0];
            }
          }
        }
      }
    });
  
    // Draw footer at the bottom
    footer();
  
    // Save the PDF (as one complete page)
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
      let totalFfour = report.prize.tempsalefour.f;
      let totalSfour = report.prize.tempsalefour.s;
  
      const totalPrizes = Number(totalFp )+ Number(totalSs) 
      const commissionValue = report.comission.comission;
      const commissionAmount = report.comission.comission===0?report.comission.comission:(((totalF + totalS)*Number(report.comission.comission))/100);
      const pcPercentageAmount = report.comission.pcpercentage===0?report.comission.pcpercentage:(((totalFfour + totalSfour)*Number(report.comission.pcpercentage))/100);
      // const commissionAmount = commissionValue === 0 ? 0 : ((totalF + totalS) * commissionValue) / 100;
      // const pcPercentageAmount = report.comission.pcpercentage === 0 ? 0 : ((totalF + totalS) * report.comission.pcpercentage) / 100;
      const pcPercentageValue = report.comission.pcpercentage;
      const grandTotal = totalF + totalS + totalFfour +totalSfour;
      const safitotal = grandTotal - pcPercentageAmount - commissionAmount;
      const nettotal = grandTotal - pcPercentageAmount - commissionAmount- Number(totalPrizes);
      const name = report.name
      const username=report.username
      const commissionAmountTotal=Number(commissionAmount.toFixed(0))+Number(pcPercentageAmount.toFixed(0))
      dataarr.push({
        commissionValue,
        commissionAmount: commissionAmount.toFixed(0),
        pcPercentageAmount: pcPercentageAmount.toFixed(0),
        commissionAmountTotal:commissionAmountTotal.toFixed(0),
        pcPercentageValue,
        grandTotal: grandTotal.toFixed(0),
        safitotal: safitotal.toFixed(0),
        nettotal: nettotal.toFixed(0),
        name,
        totalPrizes:totalPrizes.toFixed(0),
        username
      });
    });
      // Calculate total net total excluding the first row
      let totalNetTotal = 0;
      for (let i = 1; i < dataarr.length; i++) {
          totalNetTotal += parseFloat(dataarr[i].nettotal);
      }
  
    // Add header to PDF
 
    doc.setFontSize(10);
    doc.text(`Draw: ${drawdate.date}`, 150, 30);
    doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    doc.text(`Username: ${userdata.username}`, 14, 40);
    header();

    doc.setFontSize(14);
  
    // Define the table columns and rows
    // const columns = [
    //   // { header: 'Name', dataKey: 'name' },
    //   { header: 'Username', dataKey: 'username' },
    //   { header: 'Grand Total', dataKey: 'grandTotal' },
    //   // { header: 'Commission Value', dataKey: 'commissionValue' },
    //   { header: 'Commission', dataKey: 'commissionAmountTotal' },
    //   { header: 'Safi Total', dataKey: 'safitotal' },
    //   // { header: 'PC Percentage', dataKey: 'pcPercentageAmount' },
    //   { header: 'Prize', dataKey: 'totalPrizes' },
    //   { header: 'Net Total', dataKey: 'nettotal' },
    // ];
  
    // const rows = dataarr;
  
    // // Generate the table
    // doc.autoTable({
    //   columns: columns,
    //   body: rows,
    //   startY: 50,
    //   showHead: 'firstPage',
    //   didDrawPage: (data) => {
    //     // Footer
    //     footer(doc.internal.getNumberOfPages());
    //   },
    // });
  // Define the table columns and rows
// Define the table columns and rows
const columns = [
  { header: 'Username', dataKey: 'username' },
  { header: 'Name', dataKey: 'name' },
  { header: 'Grand Total', dataKey: 'grandTotal' },
  { header: 'Commission', dataKey: 'commissionAmountTotal' },
  { header: 'Safi Total', dataKey: 'safitotal' },
  { header: 'Prize', dataKey: 'totalPrizes' },
  { header: 'Net Total', dataKey: 'nettotal' },
];

const rows = dataarr;

// Generate the table
doc.autoTable({
  columns: columns,
  body: rows,
  startY: 50,
  showHead: 'firstPage',
  didDrawPage: (data) => {
    // Footer
    footer(doc.internal.getNumberOfPages());
  },
  styles: {
    lineColor: [0, 0, 0], // Black color for borders
    lineWidth: 0.1, // Thin border
    fontStyle: 'bold', // Make all text bold
  },
  bodyStyles: {
    lineColor: [0, 0, 0], // Black color for row borders
    lineWidth: 0.1, // Thin border for rows
  },
  headStyles: {
    fillColor: [240, 240, 240], // Light gray background for header
    textColor: [0, 0, 0], // Black text for header
    lineColor: [0, 0, 0], // Black border for header
    lineWidth: 0.1, // Thin border for header
    fontStyle: 'bold', // Make header text bold (in case it's not inherited from styles)
  },
  didParseCell: function(data) {
    if (data.section === 'body' && data.column.dataKey === 'nettotal') {
      const value = parseFloat(data.cell.raw);
      if (value >= 0) {
        data.cell.styles.textColor = [0, 128, 0]; // Green for positive values
      } else {
        data.cell.styles.textColor = [255, 0, 0]; // Red for negative values
      }
    }
  }
});
   // Add header to PDF
   doc.text(`Party Bill: ${dataarr[0].nettotal }`, 14, doc.lastAutoTable.finalY + 10);
   doc.text(`All Dealers Bill: ${totalNetTotal.toFixed(0)}`, 14, doc.lastAutoTable.finalY + 15);
   doc.text(`Profit/Loss: ${totalNetTotal.toFixed(0) - dataarr[0].nettotal}`, 14, doc.lastAutoTable.finalY + 20);

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
  const updateBalanceReverse=async()=>{
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
      const response = await fetch(`${linkurl}/report/getReverseBalanceUpdated`, {
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
        // form.resetFields();
      } else {
        const userData = await response.json();
        alert(userData.message)
      }
    }catch(e){
      alert(e.message)
    }
    setLoading(false)
  }
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
      // form.resetFields();
    } else {
      const userData = await response.json();
      alert(userData.message)
    }
  }catch(e){
    alert(e.message)
  }
  setLoading(false)
}

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
                          <Option style={{color:getExpiredOrNot(obj)==="active"?"green":'red'}} value={obj.date}>{obj.title+"---"+obj.date+"--"+getExpiredOrNot(obj)}</Option>
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
                      <Option key={element._id} value={element._id}>{element.username+" ("+element.name+" )"}</Option>
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
      {" "}
   {/*   <Button  
      onClick={updateBalanceReverse}
      style={{
            borderRadius:10,
                background: COLORS.deletegradient,
                color:"white"
                      }}
                      icon={<SaveFilled/>}>
        Reverse Balance
      </Button> */}
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
