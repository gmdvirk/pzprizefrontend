import React, { useEffect, useState,useRef } from 'react';
import { Form, Input, Button, Select, Modal,Card,Table,Space, Row, Col,DatePicker,Upload ,message,Tabs,Spin} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Highlighter from 'react-highlight-words';
import COLORS from '../../colors';
import { linkurl } from '../../link';
import { CheckCircleFilled, CloseCircleFilled, DeleteFilled, PlusCircleFilled, SaveFilled, ScanOutlined, SecurityScanFilled,SearchOutlined, InfoCircleFilled } from '@ant-design/icons';
const { Option } = Select;

const AddProductForm = ({ setProducts,draws,products}) => {
  const [form] = Form.useForm();
  const [alldata,setAlldata]=useState([])
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalf, setTotalF] = useState(0);
  const [totals, setTotalS] = useState(0);
  
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  
  const searchInput = useRef(null);
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
    return "active"
 }
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        
        return;
      }
      const response = await fetch(`${linkurl}/report/getSearchBundleAdmin`, {
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
        let temparr=[]
        let temptotal={f:0,s:0}
        for(let i=0;i<userData.length;i++){
          let temp={f:0,s:0}
          for(let j=0;j<userData[i].saledata.length;j++){
            temp.f=Number(temp.f)+Number(userData[i].saledata[j].f)
            temp.s=Number(temp.s)+Number(userData[i].saledata[j].s)
          }
          temptotal.f=Number(temptotal.f)+Number(temp.f)
          temptotal.s=Number(temptotal.s)+Number(temp.s)
         
          temparr.push({saledata:userData[i].saledata,bundle:values.bundle,name:userData[i].name,username:userData[i].username,f:temp.f,s:temp.s})
        }
        setTotalF(temptotal.f)
        setTotalS(temptotal.s)
        setAlldata(temparr)
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
  const handleDelete = async() => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${linkurl}/sale/deletesale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `${token}`,
        },
        body: JSON.stringify({ saleIds: selectedRowKeys }),
      });
  
      if (response.ok) {
        const filteredSelected = selected.filter(product => !selectedRowKeys.includes(product._id));
        setSelected(filteredSelected);
  
        // Update alldata array by filtering out deleted records
        const updatedAlldata = alldata.map(data => {
          const filteredSaleData = data.saledata.filter(sale => !selectedRowKeys.includes(sale._id));
          return {
            ...data,
            saledata: filteredSaleData,
            f: filteredSaleData.reduce((acc, curr) => acc + Number(curr.f), 0),
            s: filteredSaleData.reduce((acc, curr) => acc + Number(curr.s), 0),
          };
        }).filter(data => data.saledata.length > 0);
  
        setAlldata(updatedAlldata);
  
        setSelectedRowKeys([]);
        setLoading(false);
      } else {
        const userData = await response.json();
        alert(userData.Message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting products:', error);
      setLoading(false);
    }
  
    setDeleteConfirmationVisible(false);
  };
  
  const handleDetail = async(record) => {

    setSelected(record.saledata)
    setModalVisible(true)
  }

  const handleSuccessModalOk = () => {
    setSuccessModalVisible(false);
  };

  const handleErrorModalOk = () => {
    setErrorModalVisible(false);
  };
  const handleErrorModalOk1 = () => {
    setModalVisible(false);
    setSelected([])
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
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      ...getColumnSearchProps('username'),
      render: (_, record) => (
        <>{record.username+"("+record.name+")"}</>
        
      )
    },
    {
      title: 'Bundle',
      dataIndex: 'bundle',
      key: 'bundle',
      ...getColumnSearchProps('bundle'),
    },
    {
      title: 'f',
      dataIndex: 'f',
      key: 'f',
      ...getColumnSearchProps('f'),
    },
    {
      title: 's',
      dataIndex: 's',
      key: 's',
      ...getColumnSearchProps('s'),
    },
   
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
    
        
    <Button
          icon={<InfoCircleFilled/>}
          style={{

borderRadius: 10,
background: COLORS.primarygradient,
color: "white"
          }} onClick={() => handleDetail(record)}>Detail</Button>
   
    
        </Space>
      ),
    },
  ];
  const columns1 = [
    {
      title: 'Bundle',
      dataIndex: 'bundle',
      key: 'bundle',
      ...getColumnSearchProps('bundle'),
    },
    {
      title: 'F',
      dataIndex: 'f',
      key: 'f',
      ...getColumnSearchProps('f'),
    },
    {
      title: 'S',
      dataIndex: 's',
      key: 's',
      ...getColumnSearchProps('s'),
    },
  
  ];
   
  const handleRowSelectionChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
  };
  return (
    <div>

    {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
          <p>Please Wait...</p>
        </div>):
        <>
    <Form form={form} onFinish={onFinish} layout="vertical">
       <Row gutter={16}>
       
     
      <Col xs={24} sm={8}>
      <Form.Item
       label={"Select Draw"}
                     name={ 'date'}
                       rules={[{ required: true, message: 'Please select draw' }]}
                       className="flex-item"
                       fieldKey={ 'date'}
                     >
                       <Select placeholder="Select draw" >
                        
                      {draws.map((obj)=>{
                        return(
                          <Option style={{color:getExpiredOrNot(obj)==="active"?"green":'red'}} value={obj._id}>{obj.title+"---"+obj.date+"--"+getExpiredOrNot(obj)}</Option>
                          
                        )
                      })  }
                       </Select>
                     </Form.Item>
      </Col>
      
      <Col xs={24} sm={8}>
      <Form.Item name="bundle" label="Bundle" rules={[{ required: true, message: 'Please enter a bundle' }]}>
        <Input type='number' placeholder="Enter Bundle" />
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
        Search
      </Button>
    </Form.Item>


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
      <Modal
          title="Confirm Deletion"
          visible={deleteConfirmationVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteConfirmationVisible(false)}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete the {selectedRowKeys.length} selected rows?</p>
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

    </Form>
    <Modal
        title="Detail"
        visible={modalVisible}
        onOk={handleErrorModalOk1}
        onCancel={handleErrorModalOk1}
      >
         {selectedRowKeys && selectedRowKeys.length > 0 && <Button onClick={() => setDeleteConfirmationVisible(true)} type="primary">Delete</Button>}{' '}
      <Table 
      columns={columns1} dataSource={selected}
      rowSelection={rowSelection}
            rowKey="_id"
      scroll={{ x: true }} // Enable horizontal scrolling
      responsive={true} // Enable responsive behavior
      />
      </Modal>
<p>TotalF: {totalf}</p>
<p>TotalS: {totals}</p>
    <Table columns={columns} dataSource={alldata} rowKey="_id"
      
      scroll={{ x: true }} // Enable horizontal scrolling
      responsive={true} // Enable responsive behavior
      />
    </>}
    </div>
  );
};

export default AddProductForm;
