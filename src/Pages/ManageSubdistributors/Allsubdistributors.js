import { CiCircleFilled,MoreOutlined, CloseCircleFilled, CreditCardFilled, DeleteFilled, DollarCircleFilled, EditFilled, InfoCircleFilled, LockFilled, MinusCircleFilled, PlusCircleFilled, SaveFilled, SearchOutlined, ArrowDownOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { Form,Button,Menu,Dropdown,Tooltip ,  Input, Space,Select,Tabs, Table,Col, Row ,Modal,Spin} from 'antd';
import AddUserForm from './Editsubdistributor';
import EditComission from "./Editcomission"
import Editprize from "./EditPrize"
import COLORS from '../../colors';
import Loginasanother from "./Loginasanother"
import Cashmanager from "./Cashmanager"
import Creditmanager from "./Creditmanager"
import Stats from "./NewStats"
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router';
import { linkurl } from '../../link';
import 'jspdf-autotable';
import moment from 'moment-timezone';

const { Option } = Select;
const { TabPane } = Tabs;


const ProductTable = ({ products, setProducts,userdata ,completeuserdata}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibledetail, setVisibleDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading,setLoading]=useState(false)
  const [transactionhistory,setTransactionhistory]=useState([])
  const [loginvisible,setLoginVisible] = useState(false)
  const [visiblechange, setVisibleChange] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [creditopen,setCreditopen] = useState(false)
  const [cashopen,setCashopen] = useState(false)
  const [searchedColumn, setSearchedColumn] = useState('');
  const [payment, setPayment] = useState([]);
  const navigate=useNavigate()
  const searchInput = useRef(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false); // New state for delete confirmation
  function getDateAndTime(isoString) {
    // Convert the ISO string to a moment object in Pakistan Standard Time
    const dateObj = moment(isoString).tz('Asia/Karachi');

    // Extract the date components
    const year = dateObj.year();
    const month = String(dateObj.month() + 1).padStart(2, '0');
    const day = String(dateObj.date()).padStart(2, '0');

    // Extract the time components
    const hours = String(dateObj.hours()).padStart(2, '0');
    const minutes = String(dateObj.minutes()).padStart(2, '0');
    const seconds = String(dateObj.seconds()).padStart(2, '0');

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
  const handleLoginasanother =(record)=>{
    setSelectedProduct(record);
    setLoginVisible(true);
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
  const getActionMenu = (record) => (
    <Menu>
      <Menu.Item style={{margin:5,background:COLORS.editgradient,color:'white',borderRadius:10}} key="edit" icon={<EditFilled />} onClick={() => handleEdit(record)}>
        Edit
      </Menu.Item>
      <Menu.Item style={{margin:5,background:COLORS.primarygradient,color:'white',borderRadius:10}}  key="detail" icon={<InfoCircleFilled />} onClick={() => handleDetail(record)}>
        Detail
      </Menu.Item>
      <Menu.Item style={{margin:5,background:COLORS.detailgradient,color:'white',borderRadius:10}}  key="payment" icon={<DollarCircleFilled />} onClick={() => showDeleteConfirmationModal(record)}>
        Payment
      </Menu.Item>
      <Menu.Item style={{margin:5,background:COLORS.primarygradient,color:'white',borderRadius:10}}  key="login" icon={<InfoCircleFilled />} onClick={() => handleLoginasanother(record)}>
        Login
      </Menu.Item>
    </Menu>
  );
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
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      render: (_, record) => (
        
        <span>
         
   <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
          <Tooltip title="Click for actions">
          <Button 
  icon={<ArrowDownOutlined style={{ fontSize: '12px', color: 'blue'  }} />} 
  style={{ height: 25, borderRadius: 10, padding: '0 8px' }} 
/>
          </Tooltip>
        </Dropdown>
        {' '}
        {record.name}
        </span>
     
      ),
    },
    // {
    //   title: 'Contact',
    //   dataIndex: 'contact',
    //   key: 'contact',
    //   ...getColumnSearchProps('contact'),
    // },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      ...getColumnSearchProps('username'),
      render: (username, record) => (
        <span style={{color:record.blocked?"red":'green'}}>
          {username}
        </span>
     
      ),
    },
    {
      title: 'Upline',
      key: 'role',
      render: (_, record) => (
        <span style={{color:record.payment.balanceupline>0?"green":'red'}}>
          {record.payment.balanceupline}
        </span>
     
      ),
    },
    // {
    //     title: 'Username',
    //     dataIndex: 'username',
    //     key: 'username',
    //     ...getColumnSearchProps('username'),
    //   },
    // {
    //   title: 'Security Deposit',
    //   dataIndex: 'security',
    //   key: 'security',
    //   sorter: (a, b) => a.security - b.security,
    // },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//        <Button
//           icon={<EditFilled/>}
//           style={{

// borderRadius: 10,
// background: COLORS.editgradient,
// color: "white"
//           }} onClick={() => handleEdit(record)}>
//             Edit
//           </Button>
//        <Button
//           icon={<InfoCircleFilled/>}
//           style={{

// borderRadius: 10,
// background: COLORS.primarygradient,
// color: "white"
//           }} onClick={() => handleDetail(record)}>Detail</Button>
//       <Button
//             icon={<DollarCircleFilled />}
//             style={{
//               borderRadius: 10,
//               background: COLORS.detailgradient,
//               color: 'white',
//             }}
//             onClick={() => showDeleteConfirmationModal(record)}
//           >
//             Payment
//           </Button>
//           <Button
//           icon={<InfoCircleFilled/>}
//           style={{

// borderRadius: 10,
// background: COLORS.primarygradient,
// color: "white"
//           }} onClick={() => handleLoginasanother(record)}>Login</Button>
//         </Space>
//       ),
//     },
// {
//   title: 'Actions',
//   key: 'actions',
//   render: (_, record) => (
//     <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
//       <Tooltip title="Click for actions">
//         <Button icon={<MoreOutlined />} style={{ borderRadius: 10 }} />
//       </Tooltip>
//     </Dropdown>
//   ),
// },
  ];
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
          
          {balanceupline}
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
          {availablebalance}
        </span>
      ),
    },
    // {
    //   title: 'Type',
    //   dataIndex: 'type',
    //   key: 'type',
    //   render: (type) => (
    //     <span style={{ color: type === 'Withdraw' ? 'red' : 'green' }}>
    //       {type === 'Withdraw' ? (
    //         <MinusCircleFilled style={{ color: 'red' }} />
    //       ) : (
    //         <PlusCircleFilled style={{ color: 'green' }} />
    //       )}{' '}
    //       {type}
    //     </span>
    //   ),
    // },
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
    // {
    //   title: 'Balance Upline',
    //   dataIndex: 'balanceupline',
    //   key: 'balanceupline',
    //   ...getColumnSearchProps('balanceupline'),
    //   render: (balanceupline) => (
    //     <span style={{ color: balanceupline < 0? 'red' : 'green' }}>
          
    //       {balanceupline}
    //     </span>
    //   ),
    // },
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
    navigate(`/distributordetail/${record._id}`)
    // setVisibleDetail(true);
  };

  const handleClose = () => {
    setVisibleDetail(false);
    setSelectedProduct(null);
  };
  const renderProductSelection = () => {
    const renderGeneral = () => (
      <AddUserForm
          initialValues={selectedProduct}
          userdata={userdata}
          onCancel={() => setVisible(false)}
          setProducts={setProducts}
          products={products}
        />
    );
    const renderComission = () => (
      <EditComission
      initialValues={selectedProduct}
      userdata={userdata}
      onCancel={() => setVisible(false)}
      setProducts={setProducts}
      products={products}
    />
  );
    const renderPrize = () => (
      <Editprize
      initialValues={selectedProduct}
      userdata={userdata}
      onCancel={() => setVisible(false)}
      setProducts={setProducts}
      products={products}
    />
  );
    return (
      <Tabs defaultActiveKey="mobile" type="card">
      {/* <TabPane tab="Comission Settings" key="comission">
        {renderComission()}
      </TabPane> */}
      <TabPane tab="General Info" key="general">
        {renderGeneral()}
      </TabPane>
      <TabPane tab="Prize Setting" key="prize">
        {renderPrize()}
      </TabPane>
    </Tabs>
    );
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
      { title: 'Balance Upline', dataKey: 'balanceupline' },
      { title: 'Available Balance', dataKey: 'availablebalance' },
      // { title: 'Type', dataKey: 'type' },
      { title: 'Cash', dataKey: 'cash' },
      { title: 'Credit', dataKey: 'credit' },
      { title: 'Date', dataKey: 'date' },
      { title: 'Description', dataKey: 'description' },
    ];
  
    // Define table rows
    const rows = filteredPayments.map((pay) => ({
      amount: pay.type==="Withdraw"?"-"+pay.amount:pay.amount,
      balanceupline: pay.balanceupline,
      availablebalance: pay.availablebalance?pay.availablebalance:0,
      // type: pay.type,
      cash: pay.cash,
      credit: pay.credit,
      date: `${pay.date} ${pay.time}`,
      description: pay.description,
    }));
  
    // Add title to the PDF with styling
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Payment Report', 14, 22);
  
    // Add username and subtitle with date range
    doc.setFontSize(12);
    if (selectedProduct && selectedProduct.username) {
      doc.text(`User: ${selectedProduct.name}`, 14, 30);
      doc.text(`Username: ${selectedProduct.username}`, 80, 30);
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
  const today = new Date().toISOString().split('T')[0];


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
      {/* {((userdata.role === "admin")||(userdata.accesses.findIndex((obj)=>obj==="customers"||obj==="customers-stats")!==-1)  )&&  <Statisticscard data={products}/>} */}
      <Row gutter={16}>
      <Col xs={12} sm={12} md={6}>
                <p>Name: {completeuserdata.name}</p>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <p>Username: {completeuserdata.username}</p>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <p>Cash: {completeuserdata.payment.cash}</p>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <p>Credit:{completeuserdata.payment.credit}</p>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <p style={{color:completeuserdata.payment.balanceupline>0?"green":'red'}}>Balance Upline: {completeuserdata.payment.balanceupline}</p>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <p>Available Balance:{completeuserdata.payment.availablebalance}</p>
              </Col>
            </Row>
            <h1>Users : {products.length}</h1>
      <Table columns={columns} dataSource={products} rowKey="id"
      
      scroll={{ x: true }} // Enable horizontal scrolling
      responsive={true} // Enable responsive behavior
      />
      </>}
      </div>
     

      <Modal
        title="Edit Customer"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
      >
        
        {renderProductSelection()}
      </Modal>
     
      <Modal
        title="Payment"
        visible={deleteConfirmationVisible}
        onOk={handleDeleteConfirmationOk}
        onCancel={handleDeleteConfirmationCancel}
        width={1000}
        footer={[
          <Button
          icon={<CloseCircleFilled/>}
            key="cancel"
            onClick={handleDeleteConfirmationCancel}
            style={{
              borderRadius: 10,
              background: COLORS.editgradient,
              color: 'white',
            }}
          >
            Cancel
          </Button>
        ]}
      >
        {selectedProduct&&selectedProduct.payment && <Stats data={selectedProduct.payment}/>}
    
                 
        <Button
          icon={<DollarCircleFilled/>}
            key="cash"
            onClick={handleCashOpen}
            style={{
              borderRadius: 10,
              background: COLORS.primarygradient,
              color: 'white',
            }}
          >
            Cash
          </Button>
          {' '}
          <Button
          icon={<CreditCardFilled/>}
            key="credit"
            onClick={handleCreditOpen}
            style={{
              borderRadius: 10,
              background: COLORS.deletegradient,
              color: 'white',
            }}
          >
            Credit
          </Button>
               
       {creditopen&& <Creditmanager  selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} payment={payment} setPayment={setPayment} products={products} setProducts={setProducts} />}
   {cashopen&& <Cashmanager selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} payment={payment} setPayment={setPayment} products={products} setProducts={setProducts}  />}
  
          <Form form={form} onFinish={onFinish} layout="vertical"
          initialValues={{
            startdate: today,
            enddate: today
          }}
          >
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
      </Modal>
      
      {selectedProduct&&<Modal
        title={"Log in as : "+selectedProduct.username}
        visible={loginvisible}
        onCancel={() => setLoginVisible(false)}
        footer={null}
        width={800}
      >
     <Loginasanother selectedProduct={selectedProduct} userdata={userdata}/>
      </Modal>}
    </>
  );
};

export default ProductTable;
