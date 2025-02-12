import React, { useEffect, useState,useRef } from 'react';
import { Form, Input, Button, Select, Modal,Card,Table,Space, Row, Col,DatePicker,Upload ,message,Tabs,Spin} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { linkurl } from '../../link';
import { CheckCircleFilled, CloseCircleFilled, DeleteFilled, PlusCircleFilled, SaveFilled, ScanOutlined, SecurityScanFilled,SearchOutlined } from '@ant-design/icons';
const { Option } = Select;

const AddProductForm = ({ userdata,draws,setProducts,products,limits}) => {
  const [form] = Form.useForm();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [option, setOption] = useState("All");
  const [tempvalues,setTempvalues]=useState({
    onedigita:0,
    onedigitb:0,
    twodigita:0,
    twodigitb:0,
    threedigita:0,
    threedigitb:0,
    fourdigita:0,
    fourdigitb:0
  })
  const [limitsettings ,setLimitSettings ] = useState({
    hindsaa:0,
    hindsab:0,
    akraa:0,
    akrab:0,
    tendolaa:0,
    tendolab:0,
    panogadaa:0,
    panogadab:0
  });
  const [drawdate,setDrawdate]=useState(null)
  const [type,setType]=useState("uplimit")
  const [loading, setLoading] = useState(false);
  const generateProductCode = () => {
    return `COLLECTION-${uuidv4()}`;
  };
  function isValidPassword(password) {
    // Check for the absence of special characters and spaces
    const specialCharsAndSpacesRegex = /[^a-zA-Z0-9]/;
    return !specialCharsAndSpacesRegex.test(password);
  }
  const downloadinvoice4 = (arr,values,userData1) => {
    let filteredPayments = arr;
    for (let i=0;i<filteredPayments.length;i++){
      if(filteredPayments[i].bundle.length===1){
        if(option==="All"||option==="A"){filteredPayments[i].f=filteredPayments[i].f-Number(values.onedigita)
        filteredPayments[i].s=filteredPayments[i].s-Number(values.onedigitb)
        if(filteredPayments[i].f<0){
          filteredPayments[i].f=0
        }
        if(filteredPayments[i].s<0){
          filteredPayments[i].s=0
        }}
      }
      if(filteredPayments[i].bundle.length===2){
        if(option==="All"||option==="B")
        {filteredPayments[i].f=filteredPayments[i].f-Number(values.twodigita)
        filteredPayments[i].s=filteredPayments[i].s-Number(values.twodigitb)
        if(filteredPayments[i].f<0){
          filteredPayments[i].f=0
        }
        if(filteredPayments[i].s<0){
          filteredPayments[i].s=0
        }}
      }
      if(filteredPayments[i].bundle.length===3){
        if(option==="All"||option==="C"){filteredPayments[i].f=filteredPayments[i].f-Number(values.threedigita)
        filteredPayments[i].s=filteredPayments[i].s-Number(values.threedigitb)
        if(filteredPayments[i].f<0){
          filteredPayments[i].f=0
        }
        if(filteredPayments[i].s<0){
          filteredPayments[i].s=0
        }}
      }
      if(filteredPayments[i].bundle.length===4){
        if(option==="All"||option==="D"){filteredPayments[i].f=filteredPayments[i].f-Number(values.fourdigita)
        filteredPayments[i].s=filteredPayments[i].s-Number(values.fourdigitb)
        if(filteredPayments[i].f<0){
          filteredPayments[i].f=0
        }
        if(filteredPayments[i].s<0){
          filteredPayments[i].s=0
        }}
      }
    }
    // let arr1=filteredPayments.filter((obj)=>obj.bundle.length===1)
    // let arr2=filteredPayments.filter((obj)=>obj.bundle.length===2)
    // let arr3=filteredPayments.filter((obj)=>obj.bundle.length===3)
    // let arr4=filteredPayments.filter((obj)=>obj.bundle.length===4)
    // let totalFirst1 = 0;
    //   let totalSecond1 = 0;
    //   let total1 = 0;
    // let temparr=[arr1,arr2,arr3,arr4]
  
    const doc = new jsPDF();
    // const columns = [
    //   { title: 'Bundle', dataKey: 'bundle' },
    //   { title: 'First', dataKey: 'f' },
    //   { title: 'Second', dataKey: 's' },
    // ];
  
  
    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.text('Total Sale Report', 14, 22);
  
    // doc.setFontSize(12);
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      // doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${drawdate.date}`, 150, 30);
      doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    }
    filteredPayments=filteredPayments.filter((obj)=>obj.f>0 || obj.s >0)
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
    doc.text(`Total First: ${totalFirst.toFixed(2)}`, 14, startY);
    doc.text(`Total Second: ${totalSecond.toFixed(2)}`, 84, startY);
    doc.text(`Total: ${total.toFixed(2)}`, 154, startY);
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
    doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);

  
    doc.save('admin_total_sale_report.pdf');
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
  const downloadinvoice5 = (arr,values,userData1) => {
    console.log(values)
    let filteredPayments = arr;
    for (let i=0;i<filteredPayments.length;i++){
      if(filteredPayments[i].bundle.length===1){
        if((option==="All"||option==="A")){
          if(values.limittype==="uplimit"){
            if(Number(values.onedigita)>filteredPayments[i].f){
              filteredPayments[i].f=Number(filteredPayments[i].f)-Number(values.onedigita)
            }else{
              filteredPayments[i].f=filteredPayments[i].f
            }
           if(filteredPayments[i].s<Number(values.onedigitb)){
            filteredPayments[i].s=Number(filteredPayments[i].s)-Number(values.onedigitb)
           }
           else{
            filteredPayments[i].s=filteredPayments[i].s
           }
          }else if(values.limittype==="downlimit"){
            if(Number(values.onedigita)>filteredPayments[i].f){
              filteredPayments[i].f=filteredPayments[i].f
            }else{
              filteredPayments[i].f=Number(values.onedigita)
            }
           if(filteredPayments[i].s<Number(values.onedigitb)){
            filteredPayments[i].s=filteredPayments[i].s
           }
           else{
            filteredPayments[i].s=Number(values.onedigitb)
           }
          }
      }
      }
      if(filteredPayments[i].bundle.length===2){
         if(option==="All"||option==="B"){
          if(values.limittype==="uplimit"){
          if(filteredPayments[i].f<Number(values.twodigita)){
          filteredPayments[i].f=Number(filteredPayments[i].f)-Number(values.twodigita)
        }
        if(filteredPayments[i].s<Number(values.twodigitb)){
          filteredPayments[i].s=Number(filteredPayments[i].s)-Number(values.twodigitb)
        }
      }
      else if(values.limittype==="downlimit"){
        if(filteredPayments[i].f<Number(values.twodigita)){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(values.twodigita)
        }
        if(filteredPayments[i].s<Number(values.twodigitb)){
          filteredPayments[i].s=filteredPayments[i].s
        }else{
          filteredPayments[i].s=Number(values.twodigitb)
        }
      }
        
      }
     
      }
      if(filteredPayments[i].bundle.length===3){
        if(option==="All"||option==="C"){
          if(values.limittype==="uplimit"){
          if(filteredPayments[i].f<Number(values.threedigita)){
          filteredPayments[i].f=Number(filteredPayments[i].f)-Number(values.threedigita)
        }
        if(filteredPayments[i].s<Number(values.threedigitb)){
          filteredPayments[i].s=Number(filteredPayments[i].s)-Number(values.threedigitb)
        }
      }else if(values.limittype==="downlimit"){
        if(filteredPayments[i].f<Number(values.threedigita)){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(values.threedigita)
        }
        if(filteredPayments[i].s<Number(values.threedigitb)){
          filteredPayments[i].s=filteredPayments[i].s
        }
        else{
          filteredPayments[i].s=Number(values.threedigitb)
        }
      }
        }
     
      }
      if(filteredPayments[i].bundle.length===4){
        if(option==="All"||option==="D"){
          if(values.limittype==="uplimit"){
          if(filteredPayments[i].f<Number(values.fourdigita)){
          filteredPayments[i].f=Number(filteredPayments[i].f)-Number(values.fourdigita)
        }
        
        if(filteredPayments[i].s<Number(values.fourdigitb)){
          filteredPayments[i].s=Number(filteredPayments[i].s)-Number(values.fourdigitb)
        }
      }else if(values.limittype==="downlimit"){
        if(filteredPayments[i].f<Number(values.fourdigita)){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(values.fourdigita)
        }
        
        if(filteredPayments[i].s<Number(values.fourdigitb)){
          filteredPayments[i].s=filteredPayments[i].s
        }else{
          filteredPayments[i].s=Number(values.fourdigitb)
        }
      }
      }
     
      }
    }
    // let arr1=filteredPayments.filter((obj)=>obj.bundle.length===1)
    // let arr2=filteredPayments.filter((obj)=>obj.bundle.length===2)
    // let arr3=filteredPayments.filter((obj)=>obj.bundle.length===3)
    // let arr4=filteredPayments.filter((obj)=>obj.bundle.length===4)
    // let totalFirst1 = 0;
    //   let totalSecond1 = 0;
    //   let total1 = 0;
    // let temparr=[arr1,arr2,arr3,arr4]
  
  
    const doc = new jsPDF();
    // const columns = [
    //   { title: 'Bundle', dataKey: 'bundle' },
    //   { title: 'First', dataKey: 'f' },
    //   { title: 'Second', dataKey: 's' },
    // ];
    doc.setFontSize(10);
    // doc.setTextColor(40);
    doc.text('Total Sale Report', 14, 22);
  
    // doc.setFontSize(12);
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      // doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${drawdate.date}`, 150, 30);
      doc.text(`Draw Title: ${drawdate.title}`, 14, 35);
    }
    filteredPayments=filteredPayments.filter((obj)=>obj.f>0 || obj.s >0)
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
      doc.text(`Total First: ${totalFirst.toFixed(2)}`, 14, startY);
      doc.text(`Total Second: ${totalSecond.toFixed(2)}`, 84, startY);
      doc.text(`Total: ${total.toFixed(2)}`, 154, startY);
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
    doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);

    
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
                              let tempobj={
                                hindsaa :values.onedigita,
                                hindsab:values.onedigitb,
                                akraa :values.twodigita,
                                akrab :values.twodigitb,
                                tendolaa:values.threedigita,
                                tendolab:values. threedigitb,
                                panogadaa:values. fourdigita,
                                panogadab:values. fourdigitb
                              }
      const response3 = await fetch(`${linkurl}/user/editLimit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          _id:id,
          userid:userdata._id,
          drawid:drawdate._id,
          limit:{...tempobj}
        }),
      });
      if (response3.ok) {
        const userData3 = await response3.json();

      }else{
        alert("Facing error")
        return;
      }
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
                  filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.hindsaa);
                  filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.hindsab);
                  if(filteredPayments[i].f<0){
                    filteredPayments[i].f=0
                  }
                  if(filteredPayments[i].s<0){
                    filteredPayments[i].s=0
                  }
                  if(alldraws.includes(filteredPayments[i].bundle)){
                    drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
                }else{
                    alldraws.push(filteredPayments[i].bundle)
                    drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
                }
                }
                if (filteredPayments[i].bundle.length === 2) {
                  filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.akraa);
                  filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.akrab);
                  if(filteredPayments[i].f<0){
                    filteredPayments[i].f=0
                  }
                  if(filteredPayments[i].s<0){
                    filteredPayments[i].s=0
                  }
                  if(alldraws.includes(filteredPayments[i].bundle)){
                    drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
                }else{
                    alldraws.push(filteredPayments[i].bundle)
                    drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
                }
                }
                if (filteredPayments[i].bundle.length === 3) {
                  filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.tendolaa);
                  filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.tendolab);
                  if(filteredPayments[i].f<0){
                    filteredPayments[i].f=0
                  }
                  if(filteredPayments[i].s<0){
                    filteredPayments[i].s=0
                  }
                  if(alldraws.includes(filteredPayments[i].bundle)){
                    drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
                }else{
                    alldraws.push(filteredPayments[i].bundle)
                    drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
                }
                }
                if (filteredPayments[i].bundle.length === 4) {
                  filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.panogadaa);
                  filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.panogadab);
                  if(filteredPayments[i].f<0){
                    filteredPayments[i].f=0
                  }
                  if(filteredPayments[i].s<0){
                    filteredPayments[i].s=0
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

          }else{
        userData.forEach((Payments) => {
          let filteredPayments=Payments.drawarrtosend
      
          for (let i = 0; i < filteredPayments.length; i++) {
            if (filteredPayments[i].bundle.length === 1) {
              filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.hindsaa);
                  filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.hindsab);
                  if(filteredPayments[i].f<0){
                    filteredPayments[i].f=0
                  }
                  if(filteredPayments[i].s<0){
                    filteredPayments[i].s=0
                  }
              if(alldraws.includes(filteredPayments[i].bundle)){
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
            }else{
                alldraws.push(filteredPayments[i].bundle)
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
            }
            }
            if (filteredPayments[i].bundle.length === 2) {
              filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.akraa);
                  filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.akrab);
                  if(filteredPayments[i].f<0){
                    filteredPayments[i].f=0
                  }
                  if(filteredPayments[i].s<0){
                    filteredPayments[i].s=0
                  }
              if(alldraws.includes(filteredPayments[i].bundle)){
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
            }else{
                alldraws.push(filteredPayments[i].bundle)
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
            }
            }
            if (filteredPayments[i].bundle.length === 3) {
              filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.tendolaa);
                  filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.tendolab);
                  if(filteredPayments[i].f<0){
                    filteredPayments[i].f=0
                  }
                  if(filteredPayments[i].s<0){
                    filteredPayments[i].s=0
                  }
              if(alldraws.includes(filteredPayments[i].bundle)){
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:Number( drawtosend[filteredPayments[i].bundle].f )+filteredPayments[i].f,s:Number( drawtosend[filteredPayments[i].bundle].s )+filteredPayments[i].s}
            }else{
                alldraws.push(filteredPayments[i].bundle)
                drawtosend[filteredPayments[i].bundle] ={bundle:filteredPayments[i].bundle,f:filteredPayments[i].f,s:filteredPayments[i].s}
            }
            }
            if (filteredPayments[i].bundle.length === 4) {
              filteredPayments[i].f = filteredPayments[i].f - Number(Payments.limits.panogadaa);
                  filteredPayments[i].s = filteredPayments[i].s - Number(Payments.limits.panogadab);
                  if(filteredPayments[i].f<0){
                    filteredPayments[i].f=0
                  }
                  if(filteredPayments[i].s<0){
                    filteredPayments[i].s=0
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
            downloadinvoice5(drawarrtosend,values,userData1)
          } else {
            const userData = await response.json();
            alert(userData.Message)
          }
          // downloadinvoice5(drawarrtosend,values)
          }
        // form.resetFields();
        }    
      else {
        const userData = await response.json();
        alert(userData.Message)
      }

    }catch(error){
      alert(error.message)
    }

    setLoading(false)
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
        head: [['Name',
          // 'Username', 
          'Comission', 'Pc percentage']],
        body: [
          [
            report.name,
            // report.username,
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
      doc.setTextColor(80, 80, 80);
      doc.text(`Total Sale: ${totalF + totalS+totalFfour+totalSfour}`, 14, doc.autoTable.previous.finalY + 25);
      doc.text(`Total Comsission: ${pcPercentageAmount+commissionAmount}`, 14, doc.autoTable.previous.finalY + 30);
      const safeSale=(totalF + totalS+totalFfour+totalSfour)-pcPercentageAmount-commissionAmount
      doc.text(`Safi Sale: ${safeSale.toFixed(0)}`, 14, doc.autoTable.previous.finalY + 35);
      doc.text(`Total Prizes: ${totalPrizes.toFixed(0)}`, 14, doc.autoTable.previous.finalY + 40);
   // Calculate the numeric bill value
const billValue = (totalF + totalS + totalFfour + totalSfour) - Number(totalPrizes) - pcPercentageAmount - commissionAmount;

// Convert to a fixed string (if needed for display)
const Bill = billValue.toFixed(0);

// Set text color based on the bill value: red if negative, green if positive (or zero)
if (billValue < 0) {
  // Red color (RGB: 255, 0, 0)
  doc.setTextColor(255, 0, 0);
} else {
  // Green color (RGB: 0, 128, 0)
  doc.setTextColor(0, 128, 0);
}

// Add the text to the document
doc.text(`Bill: ${Bill}`, 14, doc.autoTable.previous.finalY + 45);

// Optionally, reset text color to default if needed later in the document
doc.setTextColor(0);
 
      footer(doc.internal.getNumberOfPages());
    });
  
    doc.save('BillSheetReport.pdf');
  };
  const applymoreuplimit=(arr,values)=>{
    let filteredPayments = arr;
    for (let i=0;i<filteredPayments.length;i++){
      if(filteredPayments[i].bundle.length===1){
        if(option==="All"||option==="A"){
          if(Number(values.onedigita)>filteredPayments[i].f){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(values.onedigita)
        }
       if(filteredPayments[i].s<Number(values.onedigitb)){
        filteredPayments[i].s=filteredPayments[i].s
       }
       else{
        filteredPayments[i].s=Number(values.onedigitb)
       }
      }
      }
      if(filteredPayments[i].bundle.length===2){
         if(option==="All"||option==="B"){if(filteredPayments[i].f<Number(values.twodigita)){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(values.twodigita)
        }
        if(filteredPayments[i].s<Number(values.twodigitb)){
          filteredPayments[i].s=filteredPayments[i].s
        }else{
          filteredPayments[i].s=Number(values.twodigitb)
        }}
        
      }
      if(filteredPayments[i].bundle.length===3){
        if(option==="All"||option==="C"){if(filteredPayments[i].f<Number(values.threedigita)){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(values.threedigita)
        }
        if(filteredPayments[i].s<Number(values.threedigitb)){
          filteredPayments[i].s=filteredPayments[i].s
        }
        else{
          filteredPayments[i].s=Number(values.threedigitb)
        }
        }
      }
      if(filteredPayments[i].bundle.length===4){
        if(option==="All"||option==="D"){if(filteredPayments[i].f<Number(values.fourdigita)){
          filteredPayments[i].f=filteredPayments[i].f
        }else{
          filteredPayments[i].f=Number(values.fourdigita)
        }
        
        if(filteredPayments[i].s<Number(values.fourdigitb)){
          filteredPayments[i].s=filteredPayments[i].s
        }else{
          filteredPayments[i].s=Number(values.fourdigitb)
        }}
      }
    }
  }
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
        type:type,
        limitsettings:limitsettings
      }),
    });
    if (response.ok) {
      const userData = await response.json();
      generatePDFReport(userData)
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



  useEffect(() => {
    form.setFieldsValue(tempvalues);
  }, [tempvalues, form]);

  useEffect(() => {
    setTempvalues({...limitsettings})
  }, [limitsettings, form]);


  return (
    <div>

    {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
          <p>Please Wait...</p>
        </div>):
    <Form form={form} onFinish={onFinish} layout="vertical">
       <Row gutter={16}>
       {/* <Col xs={24} sm={8}>
       <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please enter a date' }]}>
         <Input type='date' placeholder="Enter Date" />
       </Form.Item>
       </Col> */}
       
        <Col xs={24} sm={16}>
       <Form.Item
       label={"Select Draw"}
                     name={ 'date'}
                       rules={[{ required: true, message: 'Please select draw' }]}
                       className="flex-item"
                       fieldKey={ 'date'}
                     >
                           <Select placeholder="Select draw" 
                           onChange={(e)=>{
                            const temp=draws.find((obj)=>obj.date===e)
                            setDrawdate(temp)
                            const index=limits.data.findIndex((obj)=>obj.drawid===temp._id)
                            if(index===-1){
                              setLimitSettings({
                                hindsaa:0,
                                hindsab:0,
                                akraa:0,
                                akrab:0,
                                tendolaa:0,
                                tendolab:0,
                                panogadaa:0,
                                panogadab:0
                              })
                              // form.setFieldsValue(limitsettings);
                            }else{
                              setLimitSettings(limits.data[index])
                              let tempobj={
                                onedigita:limits.data[index].hindsaa,
                                onedigitb:limits.data[index].hindsab,
                                twodigita:limits.data[index].akraa,
                                twodigitb:limits.data[index].akrab,
                                threedigita:limits.data[index].tendolaa,
                                threedigitb:limits.data[index].tendolab,
                                fourdigita:limits.data[index].panogadaa,
                                fourdigitb:limits.data[index].panogadab
                              }
                              setId(limits.data[index]._id)
                              form.setFieldsValue(tempobj);
                            }
                            
                          }
                          }
                        //    onChange={(e)=>{
                        // const temp=draws.find((obj)=>obj.date===e)
                        // setDrawdate(temp)}}
                        
                        
                        >
                        
                        
                      {draws.map((obj)=>{
                        return(
                          <Option style={{color:getExpiredOrNot(obj)==="active"?"green":'red'}} value={obj.date}>{obj.title+"---"+obj.date+"--"+getExpiredOrNot(obj)}</Option>
                        )
                      })  }
                       </Select>
                     </Form.Item>
                     </Col>
      <Col xs={12} sm={8}>
      <Form.Item
      label={"Bundle"}
                    name={ 'bundle'}
                      rules={[{ required: true, message: 'Please select' }]}
                      className="flex-item"
                      fieldKey={ 'bundle'}
                      initialValue={"All"}
                    >
                      <Select placeholder="Select bundle type" onChange={(e)=>{setOption(e)}}>
                        <Option value={"All"}>All Bundles</Option>
                        <Option value={"A"}>A</Option>
                        <Option value={"B"}>B</Option>
                        <Option value={"C"}>C</Option>
                        <Option value={"D"}>D</Option>
                      </Select>
                    </Form.Item>
                    </Col>
                        
      <Col xs={12} sm={8}>
      <Form.Item
      label={"Limit Type"}
                    name={ 'limittype'}
                      rules={[{ required: true, message: 'Please select' }]}
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
      {(option==="All"||option==="A")&& <Col xs={12} sm={8}>
      <Form.Item name="onedigita" onChange={(e)=>{
        let temp={...limitsettings}
        temp.hindsaa=e.target.value
        setLimitSettings(temp)
        }} label="First A" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter one digit first" />
      </Form.Item>
      </Col>}
    {(option==="All"||option==="A")&&  <Col xs={12} sm={8}>
      <Form.Item name="onedigitb"
      onChange={(e)=>{
        let temp={...limitsettings}
        temp.hindsab=e.target.value
        setLimitSettings(temp)
        }}
      label="Second A" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter one digit second" />
      </Form.Item>
      </Col>}
      {(option==="All"||option==="B")&&<Col xs={12} sm={8}>
      <Form.Item name="twodigita" 
      onChange={(e)=>{
        let temp={...limitsettings}
        temp.akraa=e.target.value
        setLimitSettings(temp)
        }}
      label="First B" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter two digit first" />
      </Form.Item>
      </Col>}
     {(option==="All"||option==="B")&& <Col xs={12} sm={8}>
      <Form.Item name="twodigitb"
      onChange={(e)=>{
        let temp={...limitsettings}
        temp.akrab=e.target.value
        setLimitSettings(temp)
        }}
      
      label="Second B" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter two digit second" />
      </Form.Item>
      </Col>}
      {(option==="All"||option==="C")&&<Col xs={12} sm={8}>
      <Form.Item name="threedigita"
      onChange={(e)=>{
        let temp={...limitsettings}
        temp.tendolaa=e.target.value
        setLimitSettings(temp)
        }}
      label="First C" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter three digit first" />
      </Form.Item>
      </Col>}
      {(option==="All"||option==="C")&&<Col xs={12} sm={8}>
      <Form.Item name="threedigitb"
      onChange={(e)=>{
        let temp={...limitsettings}
        temp.tendolab=e.target.value
        setLimitSettings(temp)
        }}
      label="Second C" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter three digit second" />
      </Form.Item>
      </Col>}
      {(option==="All"||option==="D")&&<Col xs={12} sm={8}>
      <Form.Item name="fourdigita" 
      onChange={(e)=>{
        let temp={...limitsettings}
        temp.panogadaa=e.target.value
        setLimitSettings(temp)
        }}
      label="First D" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter four digit first" />
      </Form.Item>
      </Col>}
     {(option==="All"||option==="D")&& <Col xs={12} sm={8}>
      <Form.Item name="fourdigitb"
      onChange={(e)=>{
        let temp={...limitsettings}
        temp.panogadab=e.target.value
        setLimitSettings(temp)
        }}
      label="Second D" rules={[{ required: true, message: 'Please enter a number' }]}>
        <Input type='number' placeholder="Enter four digit second" />
      </Form.Item>
      </Col>}
   
 
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
