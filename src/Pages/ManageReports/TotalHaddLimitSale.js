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
  const [type,setType]=useState("uplimit")
  const [drawdate,setDrawdate]=useState(null)
    const [reporttype, setReportType] = useState("uplimit");
  const [loading, setLoading] = useState(false);
  const generateProductCode = () => {
    return `COLLECTION-${uuidv4()}`;
  };
  function isValidPassword(password) {
    // Check for the absence of special characters and spaces
    const specialCharsAndSpacesRegex = /[^a-zA-Z0-9]/;
    return !specialCharsAndSpacesRegex.test(password);
  }

  const downloadinvoice = (arr,values,limits,useritself,userData1) => {
    // console.log(arr,values,limits,useritself,userData1)
    let filteredPayments = arr;
    for (let i=0;i<filteredPayments.length;i++){
      if(filteredPayments[i].bundle.length===1){
        filteredPayments[i].f=filteredPayments[i].f-Number(limits.hindsaa)
        filteredPayments[i].s=filteredPayments[i].s-Number(limits.hindsab)
      }
      if(filteredPayments[i].bundle.length===2){
        filteredPayments[i].f=filteredPayments[i].f-Number(limits.akraa)
        filteredPayments[i].s=filteredPayments[i].s-Number(limits.akrab)
        
      }
      if(filteredPayments[i].bundle.length===3){
        filteredPayments[i].f=filteredPayments[i].f-Number(limits.tendolaa)
        filteredPayments[i].s=filteredPayments[i].s-Number(limits.tendolab)
        
      }
      if(filteredPayments[i].bundle.length===4){
        filteredPayments[i].f=filteredPayments[i].f-Number(limits.panogadaa)
        filteredPayments[i].s=filteredPayments[i].s-Number(limits.panogadab)
      }
    }
    for (let i=0;i<filteredPayments.length;i++){
      if(Number(filteredPayments[i].f)<0){
        filteredPayments[i].f=0
      }
      if(Number(filteredPayments[i].s)<0){
        filteredPayments[i].s=0
      }
    }
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text(`Total Sale Report ${type}`, 14, 22);
  
    doc.setFontSize(10);
    if (userdata && userdata.username) {
        doc.text(`User: ${useritself.name}`, 14, 30);
        doc.text(`Username: ${useritself.username}`, 80, 30);
        doc.text(`Draw: ${drawdate.date}`, 150, 30);
        doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    }
    filteredPayments=filteredPayments.filter((obj)=>obj.f>0 || obj.s >0)
    let arr1 = filteredPayments.filter((obj) => obj.bundle.length === 1);
    let arr2 = filteredPayments.filter((obj) => obj.bundle.length === 2);
    let arr3 = filteredPayments.filter((obj) => obj.bundle.length === 3);
    let arr4 = filteredPayments.filter((obj) => obj.bundle.length === 4);
    let totalFirst1 = 0;
    let totalSecond1 = 0;
    let total1 = 0;
    let temparr = [arr1, arr2, arr3, arr4];
  
    let startY = 40; // Initial Y position for the first section
    let startX = 14; // Initial X position
    const blockWidth = 15; // Smaller width for each block
    const blockHeight = 8; // Smaller height for each block
  
    temparr.forEach((filteredPayments, arrIndex) => {
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
  
            // Draw first value block with white background and dark blue/purplish border
            doc.setFillColor(255, 255, 255); // White background
            doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
            doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
            // Check if the bundle matches any entry in firstprefixes
            
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
        doc.text(`Total First: ${totalFirst.toFixed(0)}`, 14, startY);
        doc.text(`Total Second: ${totalSecond.toFixed(0)}`, 84, startY);
        doc.text(`Total: ${total.toFixed(0)}`, 154, startY);
        startY += 5;
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
    doc.text(`Total of First: ${totalFirst1.toFixed(0)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond1.toFixed(0)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(0)}`, 154, startY);
    doc.save('admin_total_sale_report.pdf');
  };
  const downloadinvoice4 = (arrList,values,userData1) => {
    const doc = new jsPDF();
  let filteredPayments=[...arrList]
  filteredPayments=filteredPayments.filter((obj)=>obj.f>0 || obj.s >0)
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text(`Total Sale Report ${type}`, 14, 22);
  
    doc.setFontSize(10);
    if (userdata && userdata.username) {
        doc.text(`User: ${userdata.name}`, 14, 30);
        doc.text(`Username: ${userdata.username}`, 80, 30);
        doc.text(`Draw: ${drawdate.date}`, 150, 30);
        doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    }
  
    let arr1 = filteredPayments.filter((obj) => obj.bundle.length === 1);
    let arr2 = filteredPayments.filter((obj) => obj.bundle.length === 2);
    let arr3 = filteredPayments.filter((obj) => obj.bundle.length === 3);
    let arr4 = filteredPayments.filter((obj) => obj.bundle.length === 4);
    let totalFirst1 = 0;
    let totalSecond1 = 0;
    let total1 = 0;
    let temparr = [arr1, arr2, arr3, arr4];
  
    let startY = 40; // Initial Y position for the first section
    let startX = 14; // Initial X position
    const blockWidth = 15; // Smaller width for each block
    const blockHeight = 8; // Smaller height for each block
  
    temparr.forEach((filteredPayments, arrIndex) => {
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
            let  isFirstInRed=false;
            let isFSecondInRed=false
            if(userData1){
              isFirstInRed = userData1.firstprefixes.includes(pay.bundle);
              isFSecondInRed =userData1.secondprefixes1.includes(pay.bundle) || userData1.secondprefixes2.includes(pay.bundle)||userData1.secondprefixes3.includes(pay.bundle)||userData1.secondprefixes4.includes(pay.bundle)||userData1.secondprefixes5.includes(pay.bundle);
              
            }
            if (isFirstInRed) {
                doc.setTextColor(255, 0, 0); // Red text
            } else {
              if(type==="uplimit"){
                doc.setTextColor(0, 0, 0); // Black text
              }else{
                doc.setTextColor(0, 100, 0); // Black text
              }
              
            }
            if (!(isFirstInRed) && isFSecondInRed) {
             doc.setTextColor(0, 0, 255); // Blue text
            } 
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
        doc.text(`Total First: ${totalFirst.toFixed(0)}`, 14, startY);
        doc.text(`Total Second: ${totalSecond.toFixed(0)}`, 84, startY);
        doc.text(`Total: ${total.toFixed(0)}`, 154, startY);
        startY += 5;
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
    doc.text(`Total of First: ${totalFirst1.toFixed(0)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond1.toFixed(0)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(0)}`, 154, startY);
    doc.save('admin_total_sale_report.pdf');
  };
  
    

  const downloadinvoice2 = (dataArrays, values,userData1) => {
    
    const doc = new jsPDF();
    const columns = [
      { title: 'Bundle', dataKey: 'bundle' },
      { title: 'First', dataKey: 'f' },
      { title: 'Second', dataKey: 's' },
    ];
  
    let currentY = 42; // Initial Y position for tables
    const tableMargin = 10; // Margin between tables
  
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text(`Total Sale Report ${type}`, 14, 22);
  
    doc.setFontSize(10);
  
  
  
    dataArrays.forEach((Payments) => {
      let filteredPayments=Payments.drawarrtosend.filter((obj)=>obj.f>0 || obj.s >0)
      if(filteredPayments.length>0){
      
      if (userdata && userdata.username) {
        doc.text(`User: ${Payments.name}`, 14, 30);
        doc.text(`Username: ${Payments.username}`, 80, 30);
        doc.text(`Draw: ${drawdate.date}`, 150, 30);
        doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
      }
      for (let i = 0; i < filteredPayments.length; i++) {
        if (filteredPayments[i].bundle.length === 1) {
          filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.hindsaa);
          filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.hindsab);
        }
        if (filteredPayments[i].bundle.length === 2) {
          filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.akraa);
          filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.akrab);
        }
        if (filteredPayments[i].bundle.length === 3) {
          filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.tendolaa);
          filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.tendolab);
        }
        if (filteredPayments[i].bundle.length === 4) {
          filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.panogadaa);
          filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.panogadab);
        }
      }
      for (let i=0;i<filteredPayments.length;i++){
        if(Number(filteredPayments[i].f)<0){
          filteredPayments[i].f=0
        }
        if(Number(filteredPayments[i].s)<0){
          filteredPayments[i].s=0
        }
      }
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
    
    temparr.forEach((filteredPayments, arrIndex) => {
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
      doc.text(`Total First: ${totalFirst.toFixed(0)}`, 14, startY);
      doc.text(`Total Second: ${totalSecond.toFixed(0)}`, 84, startY);
      doc.text(`Total: ${total.toFixed(0)}`, 154, startY);
      startY += 5;
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
    doc.text(`Total of First: ${totalFirst1.toFixed(0)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond1.toFixed(0)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(0)}`, 154, startY);
  
      // Calculate the maximum height of any part
      // const maxRows = Math.max(...parts.map(part => part.length));
      // const rowHeight = 10; // Approximate row height in PDF
      
      doc.addPage();
    
    }
      // currentY += maxRows * rowHeight + tableMargin; // Update currentY for the next set of tables with margin
    });
  
    doc.save('admin_total_sale_report.pdf');
  };
  const downloadinvoice3 = (dataArrays, values,userData1) => {
    const doc = new jsPDF();
    const columns = [
      { title: 'Bundle', dataKey: 'bundle' },
      { title: 'First', dataKey: 'f' },
      { title: 'Second', dataKey: 's' },
    ];
  
    let currentY = 42; // Initial Y position for tables
    const tableMargin = 10; // Margin between tables
  
    // doc.setFontSize(18);
    // doc.setTextColor(40);
    doc.text(`Total Sale Report ${type}`, 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(0, 100, 0); // White text  
    dataArrays.forEach((Payments) => {
      let filteredPayments=Payments.drawarrtosend.filter((obj)=>obj.f>0 || obj.s >0)
      if(filteredPayments.length>0){
      if (userdata && userdata.username) {
        doc.text(`User: ${Payments.name}`, 14, 30);
        doc.text(`Username: ${Payments.username}`, 80, 30);
        doc.text(`Draw: ${drawdate.date}`, 150, 30);
        doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
      }
   
    
      for (let i = 0; i < filteredPayments.length; i++) {
        if(filteredPayments[i].bundle.length===1){
          if(Number(Payments.limits.hindsaa)>filteredPayments[i].f){
            filteredPayments[i].f=filteredPayments[i].f
          }else{
            filteredPayments[i].f=Number(Payments.limits.hindsaa)
          }
         if(filteredPayments[i].s<Number(Payments.limits.hindsab)){
          filteredPayments[i].s=filteredPayments[i].s
         }
         else{
          filteredPayments[i].s=Number(Payments.limits.hindsab)
         }
        }
        if(filteredPayments[i].bundle.length===2){
          if(filteredPayments[i].f<Number(Payments.limits.akraa)){
            filteredPayments[i].f=filteredPayments[i].f
          }else{
            filteredPayments[i].f=Number(Payments.limits.akraa)
          }
          if(filteredPayments[i].s<Number(Payments.limits.akrab)){
            filteredPayments[i].s=filteredPayments[i].s
          }else{
            filteredPayments[i].s=Number(Payments.limits.akrab)
          }
          
        }
        if(filteredPayments[i].bundle.length===3){
          if(filteredPayments[i].f<Number(Payments.limits.tendolaa)){
            filteredPayments[i].f=filteredPayments[i].f
          }else{
            filteredPayments[i].f=Number(Payments.limits.tendolaa)
          }
          if(filteredPayments[i].s<Number(Payments.limits.tendolab)){
            filteredPayments[i].s=filteredPayments[i].s
          }
          else{
            filteredPayments[i].s=Number(Payments.limits.tendolab)
          }
          
        }
        if(filteredPayments[i].bundle.length===4){
          if(filteredPayments[i].f<Number(Payments.limits.panogadaa)){
            filteredPayments[i].f=filteredPayments[i].f
          }else{
            filteredPayments[i].f=Number(Payments.limits.panogadaa)
          }
          
          if(filteredPayments[i].s<Number(Payments.limits.panogadab)){
            filteredPayments[i].s=filteredPayments[i].s
          }else{
            filteredPayments[i].s=Number(Payments.limits.panogadab)
          }
          
         
        }
      }
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
    
  
    temparr.forEach((filteredPayments, arrIndex) => {
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
          doc.setTextColor(0, 100, 0); // Black text
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
                doc.setTextColor(0, 100, 0); // Black text
            }
             if (!(isFirstInRed) && isFSecondInRed) {
             doc.setTextColor(0, 0, 255); // Blue text
            } 
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
      doc.text(`Total First: ${totalFirst.toFixed(0)}`, 14, startY);
      doc.text(`Total Second: ${totalSecond.toFixed(0)}`, 84, startY);
      doc.text(`Total: ${total.toFixed(0)}`, 154, startY);
      startY += 5;
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
    doc.text(`Total of First: ${totalFirst1.toFixed(0)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond1.toFixed(0)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(0)}`, 154, startY);
  
      // Calculate the maximum height of any part
      // const maxRows = Math.max(...parts.map(part => part.length));
      // const rowHeight = 10; // Approximate row height in PDF
      
    

      doc.addPage();
  
     
  }
   });
  
    doc.save('admin_total_sale_report.pdf');
  };
  
  const downloadinvoice1 = (arr,values,limits,useritself,userData1) => {
    
    let filteredPayments = arr;
    
    for (let i=0;i<filteredPayments.length;i++){
      if(filteredPayments[i].bundle.length===1){
        if(Number(limits.hindsaa)>filteredPayments[i].f){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(limits.hindsaa)
        }
       if(filteredPayments[i].s<Number(limits.hindsab)){
        filteredPayments[i].s=filteredPayments[i].s
       }
       else{
        filteredPayments[i].s=Number(limits.hindsab)
       }
      }
      if(filteredPayments[i].bundle.length===2){
        if(filteredPayments[i].f<Number(limits.akraa)){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(limits.akraa)
        }
        if(filteredPayments[i].s<Number(limits.akrab)){
          filteredPayments[i].s=filteredPayments[i].s
        }else{
          filteredPayments[i].s=Number(limits.akrab)
        }
        
      }
      if(filteredPayments[i].bundle.length===3){
        if(filteredPayments[i].f<Number(limits.tendolaa)){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(limits.tendolaa)
        }
        if(filteredPayments[i].s<Number(limits.tendolab)){
          filteredPayments[i].s=filteredPayments[i].s
        }
        else{
          filteredPayments[i].s=Number(limits.tendolab)
        }
        
      }
      if(filteredPayments[i].bundle.length===4){
        if(filteredPayments[i].f<Number(limits.panogadaa)){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(limits.panogadaa)
        }
        
        if(filteredPayments[i].s<Number(limits.panogadab)){
          filteredPayments[i].s=filteredPayments[i].s
        }else{
          filteredPayments[i].s=Number(limits.panogadab)
        }
      }
    }
    // let filteredPayments = [...arr];
  
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.setTextColor(0,100,0);
    doc.text(`Total Sale Report ${type}`, 14, 22);
  
    doc.setFontSize(10);
    if (userdata && userdata.username) {
        doc.text(`User: ${useritself.name}`, 14, 30);
        doc.text(`Username: ${useritself.username}`, 80, 30);
        doc.text(`Draw: ${drawdate.date}`, 150, 30);
        doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    }
    filteredPayments=filteredPayments.filter((obj)=>obj.f>0 || obj.s >0)
  
    let arr1 = filteredPayments.filter((obj) => obj.bundle.length === 1);
    let arr2 = filteredPayments.filter((obj) => obj.bundle.length === 2);
    let arr3 = filteredPayments.filter((obj) => obj.bundle.length === 3);
    let arr4 = filteredPayments.filter((obj) => obj.bundle.length === 4);
    let totalFirst1 = 0;
    let totalSecond1 = 0;
    let total1 = 0;
    let temparr = [arr1, arr2, arr3, arr4];
  
    let startY = 40; // Initial Y position for the first section
    let startX = 14; // Initial X position
    const blockWidth = 15; // Smaller width for each block
    const blockHeight = 8; // Smaller height for each block
  
    temparr.forEach((filteredPayments, arrIndex) => {
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
            doc.setTextColor(0, 100, 0); // Black text
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
                doc.setTextColor(0, 100, 0); // Black text
            }if (!(isFirstInRed) && isFSecondInRed) {
             doc.setTextColor(0, 0, 255); // Blue text
            } 
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
        doc.text(`Total First: ${totalFirst.toFixed(0)}`, 14, startY);
        doc.text(`Total Second: ${totalSecond.toFixed(0)}`, 84, startY);
        doc.text(`Total: ${total.toFixed(0)}`, 154, startY);
        startY += 5;
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
    doc.text(`Total of First: ${totalFirst1.toFixed(0)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond1.toFixed(0)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(0)}`, 154, startY);
    doc.save('admin_total_sale_report.pdf');
   };
  const convertObjectToArray = (obj) => {
    return Object.values(obj);
  };
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      if(values.dealer!=="allcombined"&&values.dealer!=="allseparate"){
        const response = await fetch(`${linkurl}/report/getHaddLimitReportforparticulardistributor`, {
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
        let tempobj=userData.drawarrtosend;
        if(values.limittype==="uplimit"){
          const response1 = await fetch(`${linkurl}/report/getPrefixes/${values.date}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            }
          });
          if (response1.ok) {
            const userData1 = await response1.json();
            downloadinvoice(tempobj,values,userData.limits,userData)
          // setSoldValues(userData)
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
            downloadinvoice1(tempobj,values,userData.limits,userData)
          // setSoldValues(userData)
          } else {
            const userData = await response.json();
            alert(userData.Message)
          }
        }
       
        // form.resetFields();
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }
}else if (values.dealer==="allseparate"){
  const response = await fetch(`${linkurl}/report/getHaddLimitReportforalldistributor`, {
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
    // let tempobj=userData.drawarrtosend;
    if(values.limittype==="uplimit"){
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
        downloadinvoice3(userData,values,userData1)
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }
    }
    // form.resetFields();
  } else {
    const userData = await response.json();
    alert(userData.Message)
  }
}
else if (values.dealer==="allcombined"){
  const response = await fetch(`${linkurl}/report/getHaddLimitReportforalldistributor`, {
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
    let fulldata=[]
    let alldraws=[]
      let drawtosend={}
      if(values.limittype==="uplimit"){
        

        userData.forEach((Payments) => {
          let filteredPayments=Payments.drawarrtosend

      
          for (let i = 0; i < filteredPayments.length; i++) {
            if (filteredPayments[i].bundle.length === 1) {
              // filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.hindsaa);
              // filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.hindsab);
              if(Number(Payments.limits.hindsaa)>filteredPayments[i].f){
                filteredPayments[i].f=0
              }else{
                filteredPayments[i].f= Number(filteredPayments[i].f)-Number(Payments.limits.hindsaa)
              }
             if(filteredPayments[i].s<Number(Payments.limits.hindsab)){
              filteredPayments[i].s=0
             }else{
              filteredPayments[i].s= Number(filteredPayments[i].s)-Number(Payments.limits.hindsab)
             }
              
              if(alldraws.includes(filteredPayments[i].bundle)){
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
            }else{
                alldraws.push(filteredPayments[i].bundle)
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
            }
            }
            if (filteredPayments[i].bundle.length === 2) {
              if(filteredPayments[i].f<Number(Payments.limits.akraa)){
                filteredPayments[i].f=0
              }else{
                filteredPayments[i].f=Number(filteredPayments[i].f)-Number(Payments.limits.akraa)
              }
              
              if(filteredPayments[i].s<Number(Payments.limits.akrab)){
                filteredPayments[i].s=0
              }else{
                filteredPayments[i].s=Number(filteredPayments[i].s)-Number(Payments.limits.akrab)
              }
              if(alldraws.includes(filteredPayments[i].bundle)){
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
            }else{
                alldraws.push(filteredPayments[i].bundle)
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
            }
            }
            if (filteredPayments[i].bundle.length === 3) {
              if(filteredPayments[i].f<Number(Payments.limits.tendolaa)){
                filteredPayments[i].f=0
              }else{
                filteredPayments[i].f=Number(filteredPayments[i].f)-Number(Payments.limits.tendolaa)
              }
              
              if(filteredPayments[i].s<Number(Payments.limits.tendolab)){
                filteredPayments[i].s=0
              }else{
                filteredPayments[i].s=Number(filteredPayments[i].s)-Number(Payments.limits.tendolab)
              }
              if(alldraws.includes(filteredPayments[i].bundle)){
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
            }else{
                alldraws.push(filteredPayments[i].bundle)
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
            }
            }
            if (filteredPayments[i].bundle.length === 4) {
              if(filteredPayments[i].f<Number(Payments.limits.panogadaa)){
                filteredPayments[i].f=0
              }else{
                filteredPayments[i].f=Number(filteredPayments[i].f)-Number(Payments.limits.panogadaa)
              }
              
              if(filteredPayments[i].s<Number(Payments.limits.panogadab)){
                filteredPayments[i].s=0
              }else{
                filteredPayments[i].s=Number(filteredPayments[i].s)-Number(Payments.limits.panogadab)
              }
              if(alldraws.includes(filteredPayments[i].bundle)){
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
            }else{
                alldraws.push(filteredPayments[i].bundle)
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
            }
            }
          }})
          
         
          let drawarrtosend=convertObjectToArray(drawtosend);
          const response1 = await fetch(`${linkurl}/report/getPrefixes/${values.date}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            }
          });
          if (response1.ok) {
            const userData1 = await response1.json();
            downloadinvoice4(drawarrtosend,values,userData1)
          } else {
            const userData = await response.json();
            alert(userData.Message)
          }
      }else{
        
    userData.forEach((Payments) => {
      let filteredPayments=Payments.drawarrtosend
      for (let i = 0; i < filteredPayments.length; i++) {
        if (filteredPayments[i].bundle.length === 1) {
          if(Number(Payments.limits.hindsaa)>filteredPayments[i].f){
            filteredPayments[i].f=filteredPayments[i].f
          }else{
            filteredPayments[i].f=Number(Payments.limits.hindsaa)
          }
         if(filteredPayments[i].s<Number(Payments.limits.hindsab)){
          filteredPayments[i].s=filteredPayments[i].s
         }
         else{
          filteredPayments[i].s=Number(Payments.limits.hindsab)
         }
          if(alldraws.includes(filteredPayments[i].bundle)){
            drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
        }else{
            alldraws.push(filteredPayments[i].bundle)
            drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
        }
        }
        if (filteredPayments[i].bundle.length === 2) {
          if(filteredPayments[i].f<Number(Payments.limits.akraa)){
            filteredPayments[i].f=filteredPayments[i].f
          }else{
            filteredPayments[i].f=Number(Payments.limits.akraa)
          }
          if(filteredPayments[i].s<Number(Payments.limits.akrab)){
            filteredPayments[i].s=filteredPayments[i].s
          }else{
            filteredPayments[i].s=Number(Payments.limits.akrab)
          }
          if(alldraws.includes(filteredPayments[i].bundle)){
            drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
        }else{
            alldraws.push(filteredPayments[i].bundle)
            drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
        }
        }
        if (filteredPayments[i].bundle.length === 3) {
          if(filteredPayments[i].f<Number(Payments.limits.tendolaa)){
            filteredPayments[i].f=filteredPayments[i].f
          }else{
            filteredPayments[i].f=Number(Payments.limits.tendolaa)
          }
          if(filteredPayments[i].s<Number(Payments.limits.tendolab)){
            filteredPayments[i].s=filteredPayments[i].s
          }
          else{
            filteredPayments[i].s=Number(Payments.limits.tendolab)
          }
          if(alldraws.includes(filteredPayments[i].bundle)){
            drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
        }else{
            alldraws.push(filteredPayments[i].bundle)
            drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
        }
        }
        if (filteredPayments[i].bundle.length === 4) {
          if(filteredPayments[i].f<Number(Payments.limits.panogadaa)){
            filteredPayments[i].f=filteredPayments[i].f
          }else{
            filteredPayments[i].f=Number(Payments.limits.panogadaa)
          }
          
          if(filteredPayments[i].s<Number(Payments.limits.panogadab)){
            filteredPayments[i].s=filteredPayments[i].s
          }else{
            filteredPayments[i].s=Number(Payments.limits.panogadab)
          }
          if(alldraws.includes(filteredPayments[i].bundle)){
            drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
        }else{
            alldraws.push(filteredPayments[i].bundle)
            drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
        }
        }
      }})
      
     
      let drawarrtosend=convertObjectToArray(drawtosend);
      const response1 = await fetch(`${linkurl}/report/getPrefixes/${values.date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        }
      });
      if (response1.ok) {
        const userData1 = await response1.json();
        downloadinvoice4(drawarrtosend,values,userData1)
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }
      // downloadinvoice4(drawarrtosend,values)
      }
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
  const generatePDFReport = (data) => {
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
    let totalFp = 0;
    let totalSs = 0;
    let totalF = 0;
    let totalS = 0;


    let totalPrizes = 0
    let commissionValue = 0;
    let commissionAmount = 0
    let pcPercentageAmount = 0
    let pcPercentageValue = 0
    header();
    data.majorsalesreport.forEach((report, index) => {
      // if (index !== 0) {
      //   doc.addPage();
      // }
  
   
  
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
  
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
       totalFp += Number(report.prize.tempobj.f);
       totalSs += Number(report.prize.tempobj.s);
       totalF += Number(report.prize.tempsale.f);
       totalS += Number(report.prize.tempsale.s);
  
  
      //  totalPrizes += (Number(totalFp )+ Number(totalSs)) 
      //  commissionValue += report.comission.comission;
       commissionAmount += Number(report.comission.comission===0?report.comission.comission:(((totalF + totalS)*Number(report.comission.comission))/100));
       pcPercentageAmount += Number(report.comission.pcpercentage===0?report.comission.pcpercentage:(((totalF + totalS)*Number(report.comission.pcpercentage))/100));
      //  pcPercentageValue = report.comission.pcpercentage;

    });
    totalPrizes = (Number(totalFp )+ Number(totalSs)) 
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Totals:`, 14, doc.autoTable.previous.finalY + 10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Total F: ${totalF}`, 14, doc.autoTable.previous.finalY + 15);
    doc.text(`Total S: ${totalS}`, 14, doc.autoTable.previous.finalY + 20);
    doc.text(`Grand Total: ${totalF + totalS}`, 14, doc.autoTable.previous.finalY + 25);
    doc.text(`Total Prizes: ${totalPrizes}`, 14, doc.autoTable.previous.finalY + 30);
   doc.text(`Commission Amount: ${commissionAmount }`, 14, doc.autoTable.previous.finalY + 45);
    doc.text(`PC Percentage Amount: ${pcPercentageAmount}`, 14, doc.autoTable.previous.finalY + 50);
    doc.text(`Safi Total: ${(totalF + totalS)-pcPercentageAmount-commissionAmount}`, 14, doc.autoTable.previous.finalY + 55);
    doc.text(`Net Total: ${((totalF + totalS)- Number(totalPrizes)-pcPercentageAmount-commissionAmount).toFixed(0)}`, 14, doc.autoTable.previous.finalY + 60);
   
    footer(doc.internal.getNumberOfPages());
    doc.save('MajorsalesReport.pdf');
  };
  const gettheadminbillsheet=async()=>{
    try{
      if(!drawdate){
        alert("Choose a draw first")
        return;
      }
    const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      if(!type){
        alert("Choose a limit type")
        return;
      }

    const response = await fetch(`${linkurl}/report/getHaddLimitReportforalldistributoradminbillsheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        date:drawdate,
        type:type
      }),
    });
    if (response.ok) {
      const userData = await response.json();
      
      generatePDFReport(userData)
      // form.resetFields();
    } else {
      const userData = await response.json();
      alert(userData.Message)
    }}
    catch(e){
      alert(e.message)
    }
  }
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
        </div>):
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
       
      <Col xs={24} sm={24}>
       <Form.Item
       label={"Select Draw"}
                     name={ 'date'}
                       rules={[{ required: true, message: 'Please select draw' }]}
                       className="flex-item"
                       fieldKey={ 'date'}
                     >
                       <Select placeholder="Select draw" onChange={(e)=>{
                        const temp=draws.find((obj)=>obj.date===e)
                        setDrawdate(temp)}} >
                        
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
                       initialValue={"allcombined"}
                     >
                       <Select placeholder="Select dealer" >
                         <Option value={"allcombined"}>All Distributors Combined</Option>
                         <Option value={"allseparate"}>All Distributors Separate</Option>
                         {products.map((element)=>{
                          return(
                            <Option value={element._id}>{element.username+" ("+element.name+" )"}</Option>
                          )
                         })}

                       </Select>
                     </Form.Item>
                     </Col>
                     <Col xs={24} sm={12}>
       <Form.Item
       label={"Limit Type"}
                     name={ 'limittype'}
                       rules={[{ required: true, message: 'Please select limit type' }]}
                       className="flex-item"
                       fieldKey={ 'limittype'}
                       initialValue={"uplimit"}
                     >
                       <Select placeholder="Select limit type" onChange={(e)=>setType(e)} >
                         <Option value={"uplimit"}>Up Limit</Option>
                         <Option value={"downlimit"}>Down Limit</Option>
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
      {" "}
      <Button   style={{
            borderRadius:10,
                background: COLORS.primarygradient,
                color:"white"
                      }}
                      icon={<SaveFilled/>}
                      onClick={gettheadminbillsheet}
                      >
        Admin Bill Sheet
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
