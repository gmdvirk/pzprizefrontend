import { CiCircleFilled, CloseCircleFilled, CreditCardFilled, DeleteFilled, DollarCircleFilled, EditFilled, InfoCircleFilled, LockFilled, MinusCircleFilled, PlusCircleFilled, SaveFilled, SearchOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { Form,Button, Input, Space,Select,Tabs, Table,Col, Row ,Modal,Spin} from 'antd';
import COLORS from '../../colors';
import jsPDF from 'jspdf';
import { linkurl } from '../../link';
import 'jspdf-autotable';

const { Option } = Select;
const { TabPane } = Tabs;


const ProductTable = ({ payment, setPayment,userdata }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibledetail, setVisibleDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading,setLoading]=useState(false)
  const [transactionhistory,setTransactionhistory]=useState([])
  const [visiblechange, setVisibleChange] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [creditopen,setCreditopen] = useState(false)
  const [cashopen,setCashopen] = useState(false)
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false); // New state for delete confirmation
  function getDateAndTime(isoString) {
    // Parse the ISO 8601 string into a Date object
    const dateObj = new Date(isoString);

    // Extract the date components
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    
    // Extract the time components
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(dateObj.getUTCMilliseconds()).padStart(3, '0');

    // Format the date and time
    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}:${seconds}`;

    return { date, time };
}
  const showDeleteConfirmationModal =async (record) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${linkurl}/payment/getpaymentsbyid/${record._id}`, {
      method: 'GET',
      headers: {
        token: `${token}`,
      },
    });

    if (response.ok) {
      let userData = await response.json();
      for (let i=0;i<userData.length;i++){
        const { date, time } = getDateAndTime(userData[i].createdAt);
        userData[i].time= time ;
        userData[i].date=date
      } 
     
      setPayment(userData)
    }
    setSelectedProduct(record);
    setDeleteConfirmationVisible(true);
  };
//correct delte function
  const handleDeleteConfirmationOk = async () => {
    setLoading(true)
    
    setLoading(false)
  };
  const handleCreditOpen=()=>{
    setCreditopen(true)
    setCashopen(false)
  }
  const handleCashOpen=()=>{
    setCashopen(true)
    setCreditopen(false)
  }

  const handleDeleteConfirmationCancel = () => {
    // Close the confirmation modal
    setDeleteConfirmationVisible(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters,confirm) => {
    clearFilters();
    setSearchText('');
    confirm();
  
    // Reset the table to its original state
    // setFilteredInfo({});
    // setSortedInfo({});
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
              borderRadius: 10,
              background: COLORS.primarygradient,
              color: "white"
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters,confirm)}
            size="small"
            style={{
              width: 90,
              borderRadius: 10,
              background: COLORS.editgradient,
              color: "white"
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  
  const paymentcolumns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      ...getColumnSearchProps('amount'),
      render: (_,record) => (
        <span >
         {record.type==="Withdraw"?"-"+record.amount:record.amount}
        </span>
      ),
    },
    {
      title: 'Balance Upline',
      dataIndex: 'balanceupline',
      key: 'balanceupline',
      ...getColumnSearchProps('balanceupline'),
      render: (balanceupline) => (
        <span style={{ color: balanceupline < 0? 'red' : 'green' }}>
          
          {balanceupline.toFixed(0)}
        </span>
      ),
    },
    {
      title: 'Available Balance',
      dataIndex: 'availablebalance',
      key: 'availablebalance',
      ...getColumnSearchProps('availablebalance'),
      render: (availablebalance) => (
        <span style={{ color: availablebalance < 0? 'red' : 'green' }}>
          
          {availablebalance.toFixed(0)}
        </span>
      ),
    },
    {
      title: 'Cash',
      dataIndex: 'cash',
      key: 'cash',
      ...getColumnSearchProps('cash'),
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      ...getColumnSearchProps('credit'),
    },
   
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (_,record) => (
        <span >
         {record.date+" "+record.time}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ...getColumnSearchProps('description'),
    },
  ];
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const handleDetail = (record) => {
    setSelectedProduct(record);
    setVisibleDetail(true);
  };

  const handleClose = () => {
    setVisibleDetail(false);
    setSelectedProduct(null);
  };

  const onFinish = (values) => {
    const { startdate, enddate } = values;
    const filteredPayments = payment.filter((pay) => {
      const payDate = new Date(pay.date);
      return payDate >= new Date(startdate) && payDate <= new Date(enddate);
    });
  
    // Create a new jsPDF instance
    const doc = new jsPDF();
  
    // Define table columns
    const columns = [
      { title: 'Amount', dataKey: 'amount' },
      { title: 'Type', dataKey: 'type' },
      { title: 'Cash', dataKey: 'cash' },
      { title: 'Credit', dataKey: 'credit' },
      { title: 'Balance Upline', dataKey: 'balanceupline' },
      { title: 'Date', dataKey: 'date' },
      { title: 'Description', dataKey: 'description' },
    ];
  
    // Define table rows
    const rows = filteredPayments.map((pay) => ({
      amount: pay.type==="Withdraw"?"-"+pay.amount:pay.amount,
      type: pay.type,
      cash: pay.cash,
      credit: pay.credit,
      balanceupline: pay.balanceupline.toFixed(2),
      date: `${pay.date} ${pay.time}`,
      description: pay.description,
    }));
  
    // Add title to the PDF with styling
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Payment Report', 14, 22);
  
    // Add username and subtitle with date range
    doc.setFontSize(12);
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      doc.text(`Username: ${userdata.username}`, 80, 30);
    }
    doc.text(`Report from ${startdate} to ${enddate}`, 14, 36);
  
    // Generate the PDF table with styling and custom cell rendering
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 42,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'center',
        valign: 'middle',
        lineColor: [44, 62, 80],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontSize: 12,
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 42 },
      willDrawCell: function (data) {
        if (data.column.dataKey === 'type') {
          if (data.cell.raw === 'Withdraw') {
            doc.setTextColor(255, 0, 0); // Red
          } else if (data.cell.raw === 'Draw') {
            doc.setTextColor(0, 128, 0); // Green
          }
        }
      },
      didDrawCell: function (data) {
        // Reset text color after drawing each cell to avoid affecting other cells
        doc.setTextColor(0, 0, 0); // Default text color
      },
      didDrawPage: function (data) {
        // Footer with page number
        let pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, 
                 doc.internal.pageSize.width - 20, 
                 doc.internal.pageSize.height - 10, 
                 {
                   align: 'right',
                 });
      },
    });
  
    // Save the PDF
    doc.save('payment_report.pdf');
  };
  

  return (
    <>
        <div>
    {loading ? (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" tip="Loading...">
        <div className="content" />
          </Spin>
      </div>): 
      <>
      
      </>}
      </div>
          <Form form={form} onFinish={onFinish} layout="vertical">
  <Row gutter={16}>
    <Col xs={24} sm={12}>
      <Form.Item name="startdate" label="Start Date" rules={[{ required: true, message: 'Please enter a start date' }]}>
        <Input type="date" placeholder="Enter date" />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12}>
      <Form.Item name="enddate" label="End Date" rules={[{ required: true, message: 'Please enter an end date' }]}>
        <Input type="date" placeholder="Enter date" />
      </Form.Item>
    </Col>
  </Row>
  <Form.Item>
    <Button
      style={{
        borderRadius: 10,
        background: COLORS.savegradient,
        color: 'white',
      }}
      icon={<SaveFilled />}
      htmlType="submit"
    >
      Download
    </Button>
  </Form.Item>
</Form>
 
          <Table columns={paymentcolumns} dataSource={payment} rowKey="id"
      
      scroll={{ x: true }} // Enable horizontal scrolling
      responsive={true} // Enable responsive behavior
      />
 
    </>
  );
};

export default ProductTable;
