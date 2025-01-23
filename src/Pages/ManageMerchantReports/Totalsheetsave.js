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

const AddProductForm = ({draws,sheets,userdata, setProducts,products}) => {
  const [form] = Form.useForm();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [drawdate,setDrawdate]=useState(null)
  const [selectedsheet,setSelectedsheet]=useState(null)
  const [tempsheets,setTempSheets]=useState([])
  const [loading, setLoading] = useState(false);
  const downloadinvoice = (arr, values,userData1) => {
    let filteredPayments = [
      ...arr
    ];
    // let arr1 = filteredPayments.filter((obj) => obj.bundle.length === 1);
    // let arr2 = filteredPayments.filter((obj) => obj.bundle.length === 2);
    // let arr3 = filteredPayments.filter((obj) => obj.bundle.length === 3);
    // let arr4 = filteredPayments.filter((obj) => obj.bundle.length === 4);
    let totalFirst1 = 0;
    let totalSecond1 = 0;
    let total1 = 0;
    let temparr = [filteredPayments];
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.setTextColor(40);
    if(values.report==="generalsale"){
      doc.text('Save Sheet General Report', 14, 22);
    }else{
      doc.text('Save Sheet Oversale Report', 14, 22);

    }
  
    doc.setFontSize(10);
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${drawdate.date}`, 150, 30);
      doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
      doc.text(`Sheet: ${selectedsheet.sheetname}`, 80, 35);
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
            doc.setFont(undefined, 'bold');
        doc.text(pay.bundle.toString(), startX + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
        doc.setFont(undefined, 'normal');
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
  
    // doc.setFontSize(8);
    // doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
    // doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
    // doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);
  
    if(values.report==="generalsale"){
      doc.save('merchant_save_sheet_general_report.pdf');
    }else{
      doc.save('merchant_save_sheet_oversale_report.pdf');

    }
  };
  const downloadinvoice2 = (arr, type) => {
    const filteredPayments = [...arr];
    let totalFirst1 = 0;
    let totalSecond1 = 0;
    let total1 = 0;
    
    filteredPayments.forEach((pay) => {
      totalFirst1 += parseFloat(pay.f) || 0;
      totalSecond1 += parseFloat(pay.s) || 0;
      total1 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
    });
  
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(40);
    
    if(type==="sale"){
      doc.text('Total General Sale Report', 14, 22);
    } else {
      doc.text('Total Over Sale Report', 14, 22);
    }
    
    doc.text(`Total: ${total1.toFixed(2)}`, 14, 42);
    doc.setFontSize(10);
    
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${drawdate.date}`, 150, 30);
      doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
      doc.text(`Sheet: ${selectedsheet.sheetname}`, 80, 35);
    }
  
    let startY = 60;
    let startX = 14;
    const blockWidth = 15;
    const blockHeight = 8;
  
    doc.setFontSize(12);
    doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);
    
    startY += 10;
  
    // Header blocks
    for (let k = 0; k < 4; k++) {
      // Bundle header
      doc.setFillColor(75, 0, 130);
      doc.setDrawColor(75, 0, 130);
      doc.rect(startX, startY, blockWidth, blockHeight, 'FD');
      doc.setTextColor(255, 255, 255);
      doc.text("Bundle", startX + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
      // First header
      doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
      doc.text("First", startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
      // Second header
      doc.rect(startX + 2 * blockWidth, startY, blockWidth, blockHeight, 'FD');
      doc.text("Second", startX + 2 * blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
      startX += 3 * blockWidth;
  
      if (startX + 3 * blockWidth > doc.internal.pageSize.width - 14) {
        startX = 14;
        startY += blockHeight;
  
        if (startY + blockHeight > doc.internal.pageSize.height - 20) {
          doc.addPage();
          startY = 20;
        }
      }
    }
  
    startY += blockHeight;
    startX = 14;
  
    // Data rows
    filteredPayments.forEach((pay) => {
      // Bundle cell
      doc.setFillColor(211, 211, 211);
      doc.setDrawColor(75, 0, 130);
      doc.setTextColor(0, 0, 0);
      doc.rect(startX, startY, blockWidth, blockHeight, 'FD');
      doc.setFont(undefined, 'bold');
      doc.text(pay.bundle.toString(), startX + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
      doc.setFont(undefined, 'normal');
  
      // First value cell
      doc.setFillColor(255, 255, 255);
      doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
      if(type === "oversale"){
        doc.setTextColor(255, 0, 0);
      }
      doc.text(pay.f.toString(), startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
      // Second value cell
      doc.rect(startX + 2 * blockWidth, startY, blockWidth, blockHeight, 'FD');
      doc.text(pay.s.toString(), startX + 2 * blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
      doc.setTextColor(0, 0, 0);
  
      startX += 3 * blockWidth;
  
      if (startX + 3 * blockWidth > doc.internal.pageSize.width - 14) {
        startX = 14;
        startY += blockHeight;
  
        if (startY + blockHeight > doc.internal.pageSize.height - 20) {
          doc.addPage();
          startY = 20;
        }
      }
    });
  
    // Final totals
    startY += blockHeight + 10;
    doc.setFontSize(10);
    doc.text(`Total First : ${totalFirst1}`, 14, startY);
    doc.text(`Total Second : ${totalSecond1}`, 64, startY);
    doc.text(`Total : ${total1}`, 114, startY);
  
    doc.save('Oversale Report.pdf');
  };
  const downloadinvoice1 = (arr, userData1) => {
    const doc = new jsPDF();
    let filteredPayments = [
      ...arr.sales
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
  
    // Calculate totals for sales
    filteredPayments.forEach((pay) => {
      totalFirst1 += parseFloat(pay.f) || 0;
      totalSecond1 += parseFloat(pay.s) || 0;
      total1 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
    });
  
    // Calculate totals for oversales
    arr.oversales.forEach((pay) => {
      totalFirst2 += parseFloat(pay.f) || 0;
      totalSecond2 += parseFloat(pay.s) || 0;
      total2 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
    });
  
    // Aggregate totals
    totalFirstf = totalFirst1 + totalFirst2;
    totalSecondf = totalSecond1 + totalSecond2;
    totalf = total1 + total2;
  
    // Add overall total to the document
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ${totalf.toFixed(2)}`, 14, 42);
    doc.setFont(undefined, 'normal');
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${drawdate.date}`, 150, 30);
      doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
      doc.text(`Sheet: ${selectedsheet.sheetname}`, 80, 35);
    }
  
    // Loop for both sections: sales and oversales
    for (let i = 0; i < 2; i++) {
      // Define current section data
      let currentPayments = i === 0 ? filteredPayments : arr.oversales;
      let sectionTitle = i === 0 ? 'Save Sheet Report' : 'Over Sale Save Sheet';
      let sectionTotal = i === 0 ? total1 : total2;
  
      // Set text color based on section
      if (i === 1) {
        doc.setTextColor(255, 0, 0); // Red text for oversales
      } else {
        doc.setTextColor(40); // Default text color
      }
  
      // Add section title
      doc.setFontSize(16);
      doc.text(sectionTitle, 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(40);
  
      // Add user information
      if (userData1 && userData1.username) {
        doc.text(`User: ${userData1.name}`, 14, 30);
        doc.text(`Username: ${userData1.username}`, 80, 30);
        doc.text(`Draw: ${userData1.drawdate.date}`, 150, 30);
        doc.text(`Draw Title: ${userData1.drawdate.title}`, 14, 35);
        doc.text(`Sheet: ${userData1.selectedsheet.sheetname}`, 80, 35);
      }
  
      // Initialize starting positions
      let initialX = 14;
      let initialY = 45; // Start below the header
      let currentX = initialX;
      let currentY = initialY;
  
      const blockWidth = 15; // Width of each block
      const blockHeight = 8; // Height of each block
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const rightMargin = 14;
      const bottomMargin = 20;
  
      // Function to draw headers at the top of each column
      const drawHeaders = (x, y) => {
        // Bundle Header
        doc.setFillColor(75, 0, 130); // Dark blue background
        doc.setDrawColor(75, 0, 130); // Dark blue border
        doc.rect(x, y, blockWidth, blockHeight, 'FD');
        doc.setTextColor(255, 255, 255); // White text
        doc.text("Bundle", x + blockWidth / 2, y + blockHeight / 2, { align: 'center', baseline: 'middle' });
  
        // First Header
        doc.setFillColor(75, 0, 130);
        doc.setDrawColor(75, 0, 130);
        doc.rect(x + blockWidth, y, blockWidth, blockHeight, 'FD');
        doc.text("First", x + blockWidth + blockWidth / 2, y + blockHeight / 2, { align: 'center', baseline: 'middle' });
  
        // Second Header
        doc.setFillColor(75, 0, 130);
        doc.setDrawColor(75, 0, 130);
        doc.rect(x + 2 * blockWidth, y, blockWidth, blockHeight, 'FD');
        doc.text("Second", x + 2 * blockWidth + blockWidth / 2, y + blockHeight / 2, { align: 'center', baseline: 'middle' });
  
        // Reset text color after headers
        doc.setTextColor(0, 0, 0);
      };
  
      // Draw headers for the first column
      drawHeaders(currentX, currentY);
      currentY += blockHeight; // Move below headers
  
      // Iterate through each payment and place them column-wise
      currentPayments.forEach((pay) => {
        // Check if adding the next block exceeds the page height
        if (currentY + blockHeight > pageHeight - bottomMargin) {
          // Move to next column
          currentX += 3 * blockWidth;
          // Check if the next column exceeds page width
          if (currentX + 3 * blockWidth > pageWidth - rightMargin) {
            // Add a new page
            doc.addPage();
            currentX = initialX;
            currentY = initialY;
  
            // Draw headers for the new column on the new page
            drawHeaders(currentX, currentY);
            currentY += blockHeight;
          } else {
            // Draw headers for the new column
            drawHeaders(currentX, initialY);
            currentY = initialY + blockHeight;
          }
        }
  
        // Draw Bundle Block
        doc.setFillColor(211, 211, 211); // Light grey background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.rect(currentX, currentY, blockWidth, blockHeight, 'FD');
  
        // Determine text color based on prefixes
        let isFirstInRed = false;
        let isSecondInBlue = false;
        if (userData1) {
          isFirstInRed = userData1.firstprefixes.includes(pay.bundle);
          isSecondInBlue = userData1.secondprefixes1.includes(pay.bundle) ||
                           userData1.secondprefixes2.includes(pay.bundle) ||
                           userData1.secondprefixes3.includes(pay.bundle) ||
                           userData1.secondprefixes4.includes(pay.bundle) ||
                           userData1.secondprefixes5.includes(pay.bundle);
        }
  
        if (isFirstInRed) {
          doc.setTextColor(255, 0, 0); // Red text
        } else if (isSecondInBlue) {
          doc.setTextColor(0, 0, 255); // Blue text
        } else {
          doc.setTextColor(0, 0, 0); // Black text
        }
  
        doc.setFont(undefined, 'bold');
        doc.text(pay.bundle.toString(), currentX + blockWidth / 2, currentY + blockHeight / 2, { align: 'center', baseline: 'middle' });
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0); // Reset to black for next blocks
  
        // Draw First Block
        doc.setFillColor(255, 255, 255); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.rect(currentX + blockWidth, currentY, blockWidth, blockHeight, 'FD');
  
        if (i === 1) {
          doc.setTextColor(255, 0, 0); // Red text for oversales
        }
        doc.text(pay.f.toString(), currentX + blockWidth + blockWidth / 2, currentY + blockHeight / 2, { align: 'center', baseline: 'middle' });
        doc.setTextColor(0, 0, 0); // Reset to black
  
        // Draw Second Block
        doc.setFillColor(255, 255, 255); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.rect(currentX + 2 * blockWidth, currentY, blockWidth, blockHeight, 'FD');
  
        if (i === 1) {
          doc.setTextColor(255, 0, 0); // Red text for oversales
        }
        doc.text(pay.s.toString(), currentX + 2 * blockWidth + blockWidth / 2, currentY + blockHeight / 2, { align: 'center', baseline: 'middle' });
        doc.setTextColor(0, 0, 0); // Reset to black
  
        // Move down for the next pay
        currentY += blockHeight;
      });
  
      // After placing all pays, add totals for the section
      // Ensure there's space for totals
      if (currentY + blockHeight + 10 > pageHeight - bottomMargin) {
        // Add a new page if not enough space
        doc.addPage();
        currentX = initialX;
        currentY = initialY;
  
        // Draw headers for the new column on the new page
        drawHeaders(currentX, currentY);
        currentY += blockHeight;
      } else {
        // Move to a new line after the last pay
        currentY += 5;
      }
  
      // Add totals
      doc.setFontSize(10);
      doc.text(`Total First : ${i === 0 ? totalFirst1 : totalFirst2}`, initialX, pageHeight-10);
      doc.text(`Total Second : ${i === 0 ? totalSecond1 : totalSecond2}`, initialX + 50, pageHeight-10);
      doc.text(`Total : ${sectionTotal}`, initialX + 100, pageHeight-10);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
  
      // Add section total in bold
      if (i === 0) {
        doc.text(`Total : ${total1}`, initialX + 120, pageHeight-10);
      } else {
        doc.setTextColor(255, 0, 0); // Red text for oversales total
        doc.text(`Total : ${total2}`, initialX + 120, pageHeight-10);
        doc.setTextColor(0, 0, 0); // Reset to black
      }
  
      doc.setFont(undefined, 'normal');
  
      // Add a new page if not the last section
      if (i === 0) {
        doc.addPage();
        currentX = initialX;
        currentY = initialY;
        filteredPayments = [
          ...arr.oversales
        ];
      }
    }
  
    // Save the PDF
    doc.save('merchant_save_sheet_report.pdf');
  };
  
  
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }

        const response = await fetch(`${linkurl}/report/getSalesBySheet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            ...values,
            sheetId:drawdate._id
          }),
        });
        if (response.ok) {
          const userData = await response.json();
          if(values.report==="combined"){
                      const response1 = await fetch(`${linkurl}/report/getPrefixes/${values.date}`, {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/json',
                          token: token,
                        }
                      });
                      if (response1.ok) {
                        const userData1 = await response1.json();
                        downloadinvoice1(userData,userData1)
                      } else {
                        const userData = await response.json();
                        alert(userData.Message)
                      }
           
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
            downloadinvoice2(userData,values,userData1)
          } else {
            const userData = await response.json();
            alert(userData.Message)
          }
          }
         
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
    <Form form={form} 
    initialValues={{ report: 'combined' }} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
       
      <Col xs={24} sm={12}>
  <Form.Item
    label={"Select Draw"}
    name={'date'}
    rules={[{ required: true, message: 'Please select draw' }]}
    className="flex-item"
    fieldKey={'date'}
  >
    <Select 
      placeholder="Select draw"
      onChange={(e) => {
        const temp = draws.find((obj) => obj.date === e)
        setDrawdate(temp)
        setSelectedsheet(null)
        const tempsh = sheets.filter((obj) => obj.drawid === temp._id)
        setTempSheets(tempsh)
      }}
      dropdownStyle={{ maxHeight: 150, overflow: 'auto' }}
    >
      {draws.map((obj) => {
        return (
          <Option 
            key={obj.date}
            style={{color: getExpiredOrNot(obj) === "active" ? "green" : 'red'}} 
            value={obj.date}
          >
            {obj.title + "---" + obj.date + "--" + getExpiredOrNot(obj)}
          </Option>
        )
      })}
    </Select>
  </Form.Item>
</Col>
       <Col xs={24} sm={12}>
       <Form.Item
       label={"Sheets"}
                     name={ 'sheet'}
                       rules={[{ required: true, message: 'Please select sheet' }]}
                       className="flex-item"
                       fieldKey={ 'sheet'}
                     >
                       <Select placeholder="Select sheet" 
                        onChange={(e)=>{
                          if(e==="sjkngkfjgnfkj"){
                            setSelectedsheet({_id:"sjkngkfjgnfkj",sheetname:"no save",drawid:drawdate._id})
                          }
                          else if(e==="combinedsjkngkfjgnfkj"){
                            setSelectedsheet({_id:"sjkngkfjgnfkj",sheetname:"combined",drawid:drawdate._id})
                          }
                          else{
                            const temp=sheets.find((obj)=>obj._id===e)
                            setSelectedsheet(temp)
                          }
                          
                          }}
                       >
                         {drawdate && <Option value={"combinedsjkngkfjgnfkj"}>{"combined"}</Option>}
                         {drawdate && <Option value={"sjkngkfjgnfkj"}>{(0)+"---"+" no save"}</Option>}
                         
                        {
                          
                          tempsheets.map((obj,index)=>{
                            return(
                              <>
                                {drawdate && drawdate._id===obj.drawid&& <Option value={obj._id}>{(index+1)+"---"+obj.sheetname}</Option>}
                              </>
                         
                            )
                          })
                        }
                       </Select>
                     </Form.Item>
                     </Col>
       <Col xs={24} sm={12}>
       <Form.Item
       label={"Report"}
                     name={ 'report'}
                       rules={[{ required: true, message: 'Please select report' }]}
                       className="flex-item"
                       fieldKey={ 'report'}
                     >
                       <Select placeholder="Select Status type" >
                       <Option value={"combined"}>Combined</Option>
                         <Option value={"generalsale"}>General Sale</Option>
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
        Report
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
