import { CiCircleFilled, CloseCircleFilled, CreditCardFilled, DeleteFilled, DollarCircleFilled, EditFilled, InfoCircleFilled, LockFilled, MinusCircleFilled, PlusCircleFilled, SaveFilled, SearchOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { Form, Button, Input, Space, Select, Tabs, Table, Col, Row, Modal, Spin } from 'antd';
import COLORS from '../../colors';
import Stats from "./Stats";
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router';
import 'jspdf-autotable';

const { Option } = Select;
const { TabPane } = Tabs;

const ProductTable = ({ products, setProducts, userdata }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [payment, setPayment] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();
  const searchInput = useRef(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);

  function getDateAndTime(isoString) {
    const dateObj = new Date(isoString);
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(dateObj.getUTCMilliseconds()).padStart(3, '0');
    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}:${seconds}`;
    return { date, time };
  }

  const showDeleteConfirmationModal = async (record) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/payment/getpaymentsbyid/${record._id}`, {
      method: 'GET',
      headers: {
        token: `${token}`,
      },
    });

    if (response.ok) {
      let userData = await response.json();
      for (let i = 0; i < userData.length; i++) {
        const { date, time } = getDateAndTime(userData[i].createdAt);
        userData[i].time = time;
        userData[i].date = date;
      }
      setPayment(userData);
    }
    setSelectedProduct(record);
    setDeleteConfirmationVisible(true);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText('');
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
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
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
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
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
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
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
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
      title: 'Number',
      dataIndex: 'salenumber',
      key: 'salenumber',
      ...getColumnSearchProps('salenumber'),
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

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const handleDetail = (record) => {
    setSelectedProduct(record);
    navigate(`/detail/${record._id}`);
  };

  const onFinish = (values) => {
    const { startdate, enddate } = values;
    const filteredPayments = payment.filter((pay) => {
      const payDate = new Date(pay.date);
      return payDate >= new Date(startdate) && payDate <= new Date(enddate);
    });

    const doc = new jsPDF();
    const columns = [
      { title: 'Amount', dataKey: 'amount' },
      { title: 'Type', dataKey: 'type' },
      { title: 'Cash', dataKey: 'cash' },
      { title: 'Credit', dataKey: 'credit' },
      { title: 'Balance Upline', dataKey: 'balanceupline' },
      { title: 'Date', dataKey: 'date' },
      { title: 'Description', dataKey: 'description' },
    ];
    const rows = filteredPayments.map((pay) => ({
      amount: pay.type === "Withdraw" ? "-" + pay.amount : pay.amount,
      type: pay.type,
      cash: pay.cash,
      credit: pay.credit,
      balanceupline: pay.balanceupline,
      date: `${pay.date} ${pay.time}`,
      description: pay.description,
    }));

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Payment Report', 14, 22);

    doc.setFontSize(12);
    if (selectedProduct && selectedProduct.username) {
      doc.text(`User: ${selectedProduct.name}`, 14, 30);
      doc.text(`Username: ${selectedProduct.username}`, 80, 30);
    }
    doc.text(`Report from ${startdate} to ${enddate}`, 14, 36);

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
            doc.setTextColor(255, 0, 0);
          } else if (data.cell.raw === 'Draw') {
            doc.setTextColor(0, 128, 0);
          }
        }
      },
      didDrawCell: function (data) {
        doc.setTextColor(0, 0, 0);
      },
      didDrawPage: function (data) {
        let pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10,
          { align: 'right' }
        );
      },
    });

    doc.save('payment_report.pdf');
  };

  const handleRowSelectionChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
  };

  const handleDelete = () => {
    setLoading(true);
    // Perform deletion here, for example:
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/sale/deletesale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },
      body: JSON.stringify({ saleIds: selectedRowKeys }),
    })
      .then(response => response.json())
      .then(data => {
        setProducts(products.filter(product => !selectedRowKeys.includes(product._id)));
        setSelectedRowKeys([]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error deleting products:', error);
        setLoading(false);
      });
    setDeleteConfirmationVisible(false);
  };

  return (
    <>
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Spin size="large" tip="Loading...">
              <div className="content" />
            </Spin>
          </div>
        ) : (
          <>
            {/* <Stats products={products} /> */}
            {selectedRowKeys && selectedRowKeys.length > 0 && (
              <Button
                onClick={() => setDeleteConfirmationVisible(true)}
                style={{
                  width: 90,
                  borderRadius: 10,
                  background: COLORS.deletegradient,
                  color: 'white',
                }}
                icon={<DeleteFilled />}
              >
                Delete
              </Button>
            )}
            <Table
              columns={columns}
              dataSource={products}
              rowKey="_id"
              scroll={{ x: true }}
              responsive={true}
              rowSelection={rowSelection}
            />
          </>
        )}
        <Modal
          title="Confirm Deletion"
          visible={deleteConfirmationVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteConfirmationVisible(false)}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete the selected products?</p>
        </Modal>
      </div>
    </>
  );
};

export default ProductTable;
