import { CiCircleFilled, CloseCircleFilled, DeleteFilled, EditFilled, InfoCircleFilled, LockFilled, SearchOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table ,Modal,Spin} from 'antd';
import AddUserForm from './Editdraw';
import { linkurl } from '../../link';
import COLORS from '../../colors';


const ProductTable = ({ products, setProducts,userdata }) => {
  const [visible, setVisible] = useState(false);
  const [visibledetail, setVisibleDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading,setLoading]=useState(false)
  const [visiblechange, setVisibleChange] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  
  const searchInput = useRef(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false); // New state for delete confirmation

  const showDeleteConfirmationModal = (record) => {
    setSelectedProduct(record);
    setDeleteConfirmationVisible(true);
  };
//correct delte function
  const handleDeleteConfirmationOk = async () => {
    setLoading(true)
    
    setLoading(false)
  };
  

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
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
      render: (data,object) => <div style={{color:(object.firstprize===""&&object.status==="active")?"green":"red"}}><span >{object.title}</span></div>,
   
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date'),
      render: (data,object) => <div style={{color:(object.firstprize===""&&object.status==="active")?"green":"red"}}><span >{object.date}</span></div>,
    },
    {
      title: 'One Digit (A+B)',
      dataIndex: 'onedigita',
      key: 'onedigita',
      ...getColumnSearchProps('onedigita'),
      render: (data,object) => <div style={{color:(object.firstprize===""&&object.status==="active")?"green":"red"}}><span >{object.onedigita}</span><br/>
      <span >{"----"}</span><br/>
      <span >{object.onedigitb}</span></div>,
    },
    {
      title: 'Two Digit (A)',
      dataIndex: 'twodigita',
      key: 'twodigita',
      ...getColumnSearchProps('twodigita'),
      render: (data,object) => <div style={{color:(object.firstprize===""&&object.status==="active")?"green":"red"}}><span >{object.twodigita}</span><br/>
      <span >{"----"}</span><br/>
      <span >{object.twodigitb}</span></div>,
    },
    {
      title: 'Three Digit (A)',
      dataIndex: 'threedigita',
      key: 'threedigita',
      ...getColumnSearchProps('threedigita'),
      render: (data,object) => <div style={{color:(object.firstprize===""&&object.status==="active")?"green":"red"}}><span >{object.threedigita}</span><br/>
      <span >{"----"}</span><br/>
      <span >{object.threedigitb}</span></div>,
    },
    {
      title: 'Four Digit (A)',
      dataIndex: 'fourdigita',
      key: 'fourdigita',
      ...getColumnSearchProps('fourdigita'),
      render: (data,object) => <div style={{color:(object.firstprize===""&&object.status==="active")?"green":"red"}}><span >{object.fourdigita}</span><br/>
      <span >{"----"}</span><br/>
      <span >{object.fourdigitb}</span></div>,
    },
   
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
       {record.firstprize===""&&<Button
          icon={<EditFilled/>}
          style={{

borderRadius: 10,
background: COLORS.editgradient,
color: "white"
          }} onClick={() => handleEdit(record)}>
            Edit
          </Button>}
          {record.firstprize!==""&&<Button
          style={{

borderRadius: 10,
background: COLORS.detailgradient,
color: "white"
          }} >
            Posted
          </Button>}
      {record.firstprize===""&&record.status==="deactive"&& <Button
          icon={<InfoCircleFilled/>}
          style={{

borderRadius: 10,
background: COLORS.primarygradient,
color: "white"
          }} onClick={() => handleDetail(record)}>Activate</Button>}
      {record.firstprize===""&&record.status==="active"&&<Button
            icon={<InfoCircleFilled />}
            style={{
              borderRadius: 10,
              background: COLORS.deletegradient,
              color: 'white',
            }}
            onClick={() => handleDetail1(record)}
          >
            Deactivate
          </Button>}
    
        </Space>
      ),
    },
  ];

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const handleDetail = async(record) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/draw/activatedraw`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          _id:record._id
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        let tempobj={...record,status:"active"};
        let temp=[...products];
        const index=temp.findIndex((obj)=>obj._id===record._id);
        temp[index]={...tempobj}
        setProducts(temp)
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }

    }catch(error){
      alert(error.message)
    }

    setLoading(false)
  };
  const handleDetail1 = async(record) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/draw/deactivatedraw`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          _id:record._id
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        let tempobj={...record,status:"deactive"};
        let temp=[...products];
        const index=temp.findIndex((obj)=>obj._id===record._id);
        temp[index]={...tempobj}
        setProducts(temp)
      } else {
        const userData = await response.json();
        alert(userData.Message)
      }

    }catch(error){
      alert(error.message)
    }

    setLoading(false)
  };

  const handleClose = () => {
    setVisibleDetail(false);
    setSelectedProduct(null);
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
      {/* {((userdata.role === "admin")||(userdata.accesses.findIndex((obj)=>obj==="customers"||obj==="customers-stats")!==-1)  )&&  <Statisticscard data={products}/>} */}
      <Table columns={columns} dataSource={products} rowKey="id"
      
      scroll={{ x: true }} // Enable horizontal scrolling
      responsive={true} // Enable responsive behavior
      />
      </>}
      </div>
      {/* <Modal title="Customer Details" visible={visibledetail} onCancel={handleClose} footer={null}>
        {selectedProduct && (
         <div>
         <p>Name: {selectedProduct.customer}</p>
         <p>CNIC: {selectedProduct.customerCNIC}</p>
    <p>Contact: {selectedProduct.customerContact}</p>
    <p>Flat Code: {selectedProduct.roomcode}</p>
    <p>Dealdate: {selectedProduct.dealdate}</p>
    <p>Address: {selectedProduct.customerAddress}</p>
    <p>Additional details: {selectedProduct.additionalDetails}</p>
    
    {selectedProduct.guaranters.map((obj,index)=>{
      return(
        <>
        <h4>Guaranter : {index+1}</h4>
        <p>Name :{obj.guaranterName}</p>
        <p>CNIC :{obj.guaranterCnic}</p>
        <p>Contact :{obj.guaranterContact}</p>
        <p>Address :{obj.guaranterAddress}</p>
        </>
      )
    })}
  </div>
        )}
      </Modal> */}

      <Modal
        title="Edit Customer"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
      >
        {/* Assuming the EditProducts component is properly implemented */}
        <AddUserForm
          initialValues={selectedProduct}
          userdata={userdata}
          onCancel={() => setVisible(false)}
          setProducts={setProducts}
          products={products}
        />
      </Modal>

      <Modal
        title="Confirm Deletion"
        visible={deleteConfirmationVisible}
        onOk={handleDeleteConfirmationOk}
        onCancel={handleDeleteConfirmationCancel}
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
          </Button>,
          <Button
            key="delete"
            type="danger"
            onClick={handleDeleteConfirmationOk}
            icon={<DeleteFilled />}
            style={{
              borderRadius: 10,
              background: COLORS.deletegradient,
              color: 'white',
            }}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this customer?</p>
      </Modal>

    </>
  );
};

export default ProductTable;
