
import React, { useState,useRef, useEffect,useLayoutEffect,useCallback,memo  } from 'react';
import { v4 as uuidv4 } from 'uuid';
import COLORS from '../../colors';
import './App.css';
import { linkurl } from '../../link';
import Highlighter from 'react-highlight-words';
import DrawSelector from "./Draw"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import oversaleAudio from "./oversale.mp3";
import errorAudio from "./error.mp3";
import BackspaceIcon from '@mui/icons-material/Backspace';
import { Table, Button, Input, Col,Tabs,Row, Form,message, Select, Modal,Space,Spin } from 'antd';
import { BackwardFilled, CheckCircleFilled, CloseCircleFilled,CloudDownloadOutlined,SaveFilled,SearchOutlined} from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { green } from '@mui/material/colors';
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const App = ({isOnline, userdata, setProducts,credit,upline, products,balance,setBalance,setSelectedDraw,selecteddraw }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKeys1, setSelectedRowKeys1] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [selectedRowKeysBottom2, setSelectedRowKeysBottom2] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [completedraw,setCompletedraw]=useState(null)
  const [sheetname,setSheetname]=useState("")
  const [errormessage, setErrormessage] = useState("");
  const [drawdate,setDrawdate]=useState(null)
  const [lastkeypressed,setLastKeyPressed]=useState("")
  const [sheetmodal, setSheetModal] = useState(false);
  const [sheetsaveloader, setSheetsaveloader] = useState(false);
  
  const [isGModalVisible, setIsGModalVisible] = useState(false);
  const errorAudioRef = useRef(null);
  const oversaleAudioRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const showMessage = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false); // Hide the message after 3 seconds
    }, 3000);
  };
  const showErormessage = () => {
    setIsVisible1(true);
    setTimeout(() => {
      setIsVisible1(false); // Hide the message after 3 seconds
    }, 3000);
  };
  const showModal = () => {
    setIsGModalVisible(true);
  };

  const handleOk = () => {
    setIsGModalVisible(false);
  };

  const handleCancel = () => {
    setIsGModalVisible(false);
  };
  const [isGModalVisible1, setIsGModalVisible1] = useState(false);

  const showModal1 = () => {
    setIsGModalVisible1(true);
  };

  const handleOk1 = () => {
    setIsGModalVisible1(false);
  };

  const handleCancel1 = () => {
    setIsGModalVisible1(false);
  };
  const searchInput = useRef(null);
  const [isDrawloaded,setIsDrawLoaded]=useState(true)
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [deleteConfirmationVisible1, setDeleteConfirmationVisible1] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [messagePurchases, setMessagePurchases] = useState([]);
  const [smsModalVisible, setSmsModalVisible] = useState(false); // State for SMS modal visibility
  const [smsContent, setSmsContent] = useState(''); // State for SMS content
  const [modalTableData, setModalTableData] = useState([]);
  const [modalTableTotal, setModalTableTotal] = useState("");
  const [draw, setDraw] = useState(null);
  const [saledetail, setSaledetail] = useState([]);
  const [saledetailtotal, setSaledetailtotal] = useState([]);
  const [saletotal, setSaletotal] = useState([]);
  const [oversaletotal, oversetSaletotal] = useState([]);
  const [oversaledetail, setOverSaledetail] = useState([]);
  const [oversaledetailtotal, setOverSaledetailtotal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputValue4, setInputValue4] = useState("");
  const [inputValue5, setInputValue5] = useState('0');
  const [inputValue6, setInputValue6] = useState('0');
  const [activeInput, setActiveInput] = useState(null);
  const [value, setValue] = useState({a:0,b:0});
  const [inputValue3, setInputValue3] = useState('');
  const [form] = Form.useForm();
  
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
 
  const getColumnSearchProps1 = (dataIndex) => ({
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
      title: '#',
      dataIndex: 'total',
      key: 'total',
      width: 50,
    },
    {
      title: 'F',
      dataIndex: 'f',
      key: 'f',
      width: 50,
    },
    {
      title: 'S',
      dataIndex: 's',
      key: 's',
      width: 50,
    },
    {
      title: 'Total',
      dataIndex: 't',
      key: 't',
      width: 50,
    },
  ];
  const getLaptopFontSize = () => {
    return window.innerWidth >= 1024 ? 18 : 14;
  };
  
  // In your component:
  const [laptopFontSize, setLaptopFontSize] = useState(getLaptopFontSize());
  
  useEffect(() => {
    const handleResize = () => {
      setLaptopFontSize(getLaptopFontSize());
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const columns1 = [
    {
      title: '#',
      dataIndex: 'bundle',
      key: 'bundle',
      width: 50,
      ...getColumnSearchProps('bundle'),
      render: (text) => <span style={{ fontWeight: 'bolder', fontSize: laptopFontSize }}>{text}</span>,
    },
    {
      title: 'F',
      dataIndex: 'f',
      key: 'f',
      width: 50,
      ...getColumnSearchProps('f'),
      render: (text) => <span style={{ fontWeight: 'bolder', fontSize: laptopFontSize }}>{text}</span>,
    },
    {
      title: 'S',
      dataIndex: 's',
      key: 's',
      width: 50,
      ...getColumnSearchProps('s'),
      render: (text) => <span style={{ fontWeight: 'bolder', fontSize: laptopFontSize }}>{text}</span>,
    },
  ];
  
  const columns2 = [
    {
      title: '#',
      dataIndex: 'bundle',
      key: 'bundle',
      width: 50,
      ...getColumnSearchProps1('bundle'),
      render: (text) => <span style={{ color: 'red',fontWeight:'bolder',fontSize:laptopFontSize  }}>{text}</span>,
    },
    {
      title: 'F',
      dataIndex: 'f',
      key: 'f',
      width: 50,
      ...getColumnSearchProps1('f'),
      render: (text) => <span style={{ color: 'red',fontWeight:'bolder',fontSize:laptopFontSize  }}>{text}</span>,
    },
    {
      title: 'S',
      dataIndex: 's',
      key: 's',
      width: 50,
      ...getColumnSearchProps1('s'),
      render: (text) => <span style={{ color: 'red',fontWeight:'bolder',fontSize:laptopFontSize  }}>{text}</span>,
    },
  ];
  const handleRowSelectionChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
  };
  const handleRowSelectionChange1 = (selectedRowKeys) => {
    setSelectedRowKeys1(selectedRowKeys);
  };

  const rowSelection1 = {
    selectedRowKeys1,
    onChange: handleRowSelectionChange1,
  };
  const handleRowSelectionChange2 = (selectedRowKeys) => {
    setSelectedRowKeysBottom2(selectedRowKeys);
  };

 
  const handleKeyPress = (value) => {

  let tempinput=inputValue
  let tempinput1=inputValue1 
  let tempinput2=inputValue2
    if (activeInput === '1') {
      const input = document.getElementById('1');
      if (input) {
        const isTextSelected = input.selectionStart !== input.selectionEnd;
        if (isTextSelected) {
          tempinput=''
        }
      }
      
    if(String(tempinput + value).length<5){
      setInputValue(tempinput + value);
      getvalue(tempinput + value)
    }
    } else if (activeInput === '2') {
      const input = document.getElementById('2');
      if (input) {
        const isTextSelected = input.selectionStart !== input.selectionEnd;
        if (isTextSelected) {
          tempinput1=''
        }
      }
      setInputValue1(tempinput1 + value);
    } else if (activeInput === '3') {
      const input = document.getElementById('3');
      if (input) {
        const isTextSelected = input.selectionStart !== input.selectionEnd;
        if (isTextSelected) {
          tempinput2=''
        }
      }
      setInputValue2(tempinput2 + value);
    }
    setLastKeyPressed(value)
  };

  const handleBackspace = () => {
    setLastKeyPressed('back')
    if (activeInput === '1') {
      setInputValue(inputValue.slice(0, -1));
    } else if (activeInput === '2') {
      setInputValue1(inputValue1.slice(0, -1));
    } else if (activeInput === '3') {
      setInputValue2(inputValue2.slice(0, -1));
    }
    setTimeout(() => {
      setLastKeyPressed("")
    }, 500);
  };
  function isNumericOnly(str) {
    const regex = /^[0-9]+$/;  // Regular expression for digits (0-9)
    return regex.test(str);    // Returns true if the string contains only digits
  }
  
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (newValue === '' || (isNumericOnly(newValue) && newValue.length <= 4)) {
      setInputValue(newValue);
      if (newValue !== '') {
        getvalue(newValue);
      }
    }
  };
  // const handleInputChange3 = (e) => {
  //   setInputValue3(e.target.value);
  //   // setModalTableData(convertStringToArrayOfObjects(e.target.value))
  //   parseInputMessage(e.target.value)
  // };
  const handleInputChange3 = (e) => {
    const inputValue = e.target.value;
    setInputValue3(inputValue);  // Set the input value as-is for display
  
    // Process the input for parsing without changing the displayed value
    let processedValue = inputValue;
    
    // Regular expression to match patterns like '100f1s1', '100f1 s1', '100 f1s1', or '100f10'
    const regex = /(\d+)([fs])(\d+)(?:([fs])(\d+))?/gi;
    
    // Replace function to add spaces
    const replaceFunc = (match, p1, p2, p3, p4, p5) => {
      if (p4 && p5) {
        // Case for 'f' and 's' both present
        return `${p1} ${p2}${p3} ${p4}${p5}`;
      } else {
        // Case for only 'f' or 's'
        return `${p1} ${p2}${p3}`;
      }
    };
  
    // Apply the replacement to the processed value
    processedValue = processedValue.replace(regex, replaceFunc);
  
    // Parse the processed input
    parseInputMessage(processedValue);
  };
  function parseInputMessage(message) {
    if (message.length === 0) {
      setMessagePurchases([]);
      return;
    }
    try {
      // Remove all characters after the last digit
      message = message.replace(/(\d)[\D\s]*$/, '$1');

      let purchases = [];
      function mergeFirstAndSecond(arr) {
        let mergedValues = [];
        let i = 0;
  
        while (i < arr.length) {
          let currentValue = arr[i];
  
          // Check if the current value contains 'f', 's', or '+'
          if (currentValue.includes("f") || currentValue.includes("s") || currentValue.includes("+")) {
            let merged = currentValue;
  
            // Verify if the next value also contains 'f', 's', or '+', then merge
            while (
              i + 1 < arr.length &&
              (arr[i + 1].includes("f") || arr[i + 1].includes("s") || arr[i + 1].includes("+"))
            ) {
              merged += arr[i + 1];
              i++; // Skip the next value since it's already merged
            }
            mergedValues.push(merged);
          } else {
            mergedValues.push(currentValue);
          }
  
          i++;
        }
  
        return mergedValues;
      }
  
      function setFirstsAndSeconds(first, second) {
        purchases = purchases.map((purchase) => {
          let data = { ...purchase };
          if (data.first === null) {
            data.first = first;
          }
          if (data.second === null) {
            data.second = second;
          }
          return data;
        });
      }
  
      let tempMessage = message
        .trim()
        .replace(/(,|-|\/|\*|_|"|:|;|=| |\n|#|£|&|@|\(|\)|'|!)/g, ".")
        .replace(/\.{2,}/g, ".");
      tempMessage = tempMessage.replace(/[a-zA-Z]/g, (match) =>
        match.toLowerCase()
      );
      let chunks = mergeFirstAndSecond(tempMessage.split("."));
      chunks.forEach((chunk) => {
        if (chunk[0] == "f" || chunk.includes("+")) {
          let numbers = chunk.match(/\d+/g);
          let firstNumber = parseInt(numbers[0] || 0);
          let secondNumber = parseInt(numbers[1] || 0);
          setFirstsAndSeconds(firstNumber, secondNumber);
        } else if (chunk[0] == "s") {
          let numbers = chunk.match(/\d+/g);
          let firstNumber = parseInt(numbers[1] || 0);
          let secondNumber = parseInt(numbers[0] || 0);
          setFirstsAndSeconds(firstNumber, secondNumber);
        } else {
          purchases.push({ bundle: chunk, first: null, second: null });
        }
      });
  
      let temppurchases = []
      purchases.forEach((obj) => {
        temppurchases.push({
          bundle: obj.bundle,
          f: obj.first,
          s: obj.second,
          salenumber: isNaN(obj.bundle) ? 0 : obj.bundle.length,
          type: "sale",
          salecode: generateProductCode(),
          drawid: draw
        })
      })
      setMessagePurchases([...purchases]);
      let temp = 0
      temppurchases.forEach((obj) => {
        temp = Number(temp) + Number(obj.f)
        temp = Number(temp) + Number(obj.s)
      })
      setModalTableData(temppurchases)
      setModalTableTotal(temp)
    } catch (e) {
      // Handle the error
      console.log(e);
    }
  }
  function isNumericOnly(str) {
    const regex = /^[0-9]+$/;  // Regular expression for digits (0-9)
    return regex.test(str);    // Returns true if the string contains only digits
  }

  function convertStringToArrayOfObjects(inputString) {
    // Step 1: Filter out unwanted characters
    const filteredString = inputString
      .replace(/[^0-9f,s]/g, '') // Keep only numbers, 'f', 's', and ','
  
    // Step 2: Split the filtered string into items
    const items = filteredString.split(',');
    const result = [];
  
    // Step 3: Process each item
    for (let i = 0; i < items.length; i += 3) {
      const salenumber = items[i] ? items[i] : 0;
      const f = items[i + 1] || '0';
      const s = items[i + 2] || '0';
  
      // Split f and s to extract the numeric part
      let tempf = f.split('f');
      let temps = s.split('s');
      
      // Create the object with necessary properties
      const obj = {
        salenumber: isNaN(salenumber) ? 0 : salenumber.length,
        bundle: isNaN(salenumber) ? 0 : salenumber,
        f: Number(tempf[1]) || 0,
        s: Number(temps[1]) || 0,
        type: "sale",
        salecode: generateProductCode(),
        drawid: draw
      };
      result.push(obj);
    }
  
    return result;
  }
  
  // const isValidBundle = (value) => {
  //   const numberRegex = /^-?\d+$/;
  //   return numberRegex.test(value.toString());
  // };
  // const handleMakeMessagePurchases = async () => {
  //   // setIsLoading(true);
  //   let purchases = messagePurchases.map((purchase) => {
  //     return { ...getDataForBundle(purchase.bundle, currentDraw), ...purchase };
  //   });
  //   let tempMessage = message.replace(/\s/g, "").replace(/,/g, ".");
  //   tempMessage = tempMessage.replace(/[a-zA-Z]/g, (match) =>
  //     match.toLowerCase()
  //   );
  //   let temp = {
  //     draw_id: currentDraw._id,
  //     user_id: currentLoggedInUser._id,
  //     purchases: purchases,
  //     message: tempMessage,
  //   };
  //   let response = await articlesAPI.makeBulkPurchase(temp);
  //   if (response.user) {
  //     if (response.inSufCount > 0) {
  //       alertMessage(
  //         "Balance Insufficent for " + response.inSufCount + " purchases"
  //       );
  //       errorAudioRef?.current?.play();
  //     } else {
  //       successMessage("Purchase Saved");
  //     }
  //     if (response.oversaleCount > 0) {
  //       // alert("Oversale count: "+response.oversaleCount)
  //       oversaleAudioRef?.current?.play();
  //     }

  //     setCurrentLoggedInUser({ ...response.user });
  //     if (form.selectedDraw) {
  //       getSavedPurchasesOfCurrentDraw(form.selectedDraw, response.user);
  //     }
  //     setMessagePurchases([]);
  //     setMessage("");
  //   } else {
  //     alertMessage("Error");
  //     errorAudioRef?.current?.play();
  //   }
  //   setIsLoading(false);
  // };
  const handleInputChange4 = (e) => {
    
    if(e.target.value===''||isNumericOnly(e.target.value)){
    setInputValue4(e.target.value);}
  };

  const handleInputChange5 = (e) => {
    
    if(e.target.value===''||isNumericOnly(e.target.value)){
    setInputValue5(e.target.value);}
  };

  const handleInputChange6 = (e) => {
    
    if(e.target.value===''||isNumericOnly(e.target.value)){
    setInputValue6(e.target.value);}
  };
  const handleInputChange1 = (e) => {
    
    if(e.target.value===''|| isNumericOnly(e.target.value)){
    setInputValue1(e.target.value);}
  };

  const handleInputChange2 = (e) => {
    
    if(e.target.value===''|| isNumericOnly(e.target.value)){
    setInputValue2(e.target.value);}
  };

  const handleDelete = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`${linkurl}/sale/deletesale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },
      body: JSON.stringify({ saleIds: selectedRowKeys }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.status&&data.status===false)
        console.log(data,data.status,data.status)
        if(data&&(!data.status)){
          console.log(data)
          setErrormessage(data.Message)
          showErormessage();
          setDeleteConfirmationVisible(false);
          setLoading(false);
          errorAudioRef?.current?.play();
          return;
        }
        const tempproduct=[...saledetail]
        const temptodel=tempproduct.filter(product => selectedRowKeys.includes(product._id))
        let totalF = 0;
        let totalS = 0;
        temptodel.forEach(sale => {
          totalF += Number(sale.f);
          totalS += Number(sale.s);
        });
        setSaledetail(tempproduct.filter(product => !selectedRowKeys.includes(product._id)));
        setSelectedRowKeys([]);
        setLoading(false);
        setBalance(Number(balance)+Number(totalF+totalS))
      })
      .catch(error => {
        console.error('Error deleting products:', error);
        setLoading(false);
      });
    setDeleteConfirmationVisible(false);
  };

  
  const handleDelete1 = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`${linkurl}/sale/deletesale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },
      body: JSON.stringify({ saleIds: selectedRowKeys1 }),
    })
      .then(response => response.json())
      .then(data => {
        const tempproduct=[...oversaledetail]
        const temptodel=tempproduct.filter(product => selectedRowKeys1.includes(product._id))
        let totalF = 0;
        let totalS = 0;
        temptodel.forEach(sale => {
          totalF += Number(sale.f);
          totalS += Number(sale.s);
        });
        setOverSaledetail(tempproduct.filter(product => !selectedRowKeys1.includes(product._id)));
        setSelectedRowKeys1([]);
        setLoading(false);
        // setBalance(Number(balance)+Number(totalF+totalS))
      })
      .catch(error => {
        console.error('Error deleting products:', error);
        setLoading(false);
      });
    setDeleteConfirmationVisible1(false);
  };
 
  const getSaleDetail = async (e) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found in local storage');
        return;
      }

      const response = await fetch(`${linkurl}/sale/getmysaledetail/${e}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setSaledetail(userData.users.filter((obj) => obj.type === "sale"));
        setOverSaledetail(userData.users.filter((obj) => obj.type === "oversale"));
       
      } else {
        const userData = await response.json();
        alert(userData.Message);
      }
      setDraw(e);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
    
  };


  const generateProductCode = () => {
    return `S-${uuidv4()}`;
  };
  function areMultiplesOfFive(value1, value2) {
    // Helper function to check if a single value is a multiple of 5
    const isMultipleOfFive = (num) => {
      return num >= 0 && num % 5 === 0;
    };
  
    // Check both values
    return isMultipleOfFive(value1) && isMultipleOfFive(value2);
  }
  const onFinish = async () => {
    if(inputValue1==="0" && inputValue2==="0"){
      setErrormessage("Both values can not be zero.")
          showErormessage();
          return;
    }
    if (inputValue !== '' && inputValue1 !== '' && inputValue2 !== '' &&areMultiplesOfFive(inputValue1,inputValue2)) {
      let values = { f: Number(inputValue1), s: Number(inputValue2), salenumber:inputValue };
      const salecode = generateProductCode();
      try {
        if(Number(Number(values.f)+Number(values.s))>Number(balance)){
          // error1();
          setErrormessage("Insufficient Balance")
          showErormessage();
          return
        }
        // success();
        let tempvalues = { ...values };
        setInputValue('');
        
    document.getElementById('1').focus();
    setActiveInput('1');
        form.resetFields();
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token not found in local storage');
          return;
        }
        if(!isOnline){
          setErrormessage("No Internet")
          showErormessage();
          errorAudioRef?.current?.play();
          setLoading(false);
          return;
        }
        const response = await fetch(`${linkurl}/sale/addsale`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            salenumber: tempvalues.salenumber.length,
            bundle:tempvalues.salenumber,
            f: Number(tempvalues.f),
            s: Number(tempvalues.s),
            type: "sale",
            drawid: draw,
            salecode
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.data.length === 1) {
            let tempobj = { ...userData.data[0] };
            if (tempobj.type === "sale") {
              let temp = [...saledetail];
              temp.push(tempobj);
              setSaledetail(temp);
              setBalance(Number(balance)-Number(Number(tempobj.f)+Number(tempobj.s)))
            } else {
              let temp = [...oversaledetail];
              temp.push(tempobj);
              setOverSaledetail(temp);
              oversaleAudioRef?.current?.play();
            }
          } else {
            let tempobj = { ...userData.data[1] };
            let tempobj1 = { ...userData.data[0] };
            if (tempobj.type === "sale") {
              let temp = [...saledetail];
              temp.push(tempobj);
              setSaledetail(temp);
              setBalance(Number(balance)-Number(Number(tempobj.f)+Number(tempobj.s)))
            } else {
              let temp = [...oversaledetail];
              temp.push(tempobj);
              setOverSaledetail(temp);
              oversaleAudioRef?.current?.play();
            }
            if (tempobj1.type === "sale") {
              let temp = [...saledetail];
              temp.push(tempobj1);
              setSaledetail(temp);
              setBalance(Number(balance)-Number(Number(tempobj1.f)+Number(tempobj1.s)))
            } else {
              let temp = [...oversaledetail];
              temp.push(tempobj1);
              setOverSaledetail(temp);
              oversaleAudioRef?.current?.play();
            }
          }
          showMessage();
         
        } else {
          const userData = await response.json();
          // error()
          setErrormessage(userData.Message)
          showErormessage();
          errorAudioRef?.current?.play();
        }
      } catch (error) {
        alert(error.message);
      }
      setLoading(false);
    }
    else{
      alert("درست نمبر درج کریں")
    }
  };

  const onFinish1 = async () => {
    if (inputValue4 !== '' && inputValue5 !== '' && inputValue6 !== '') {
      let values = { f: Number(inputValue5), s: Number(inputValue6), salenumber:inputValue4 };
      const salecode = generateProductCode();
      try {
        if(Number(Number(values.f)+Number(values.s))>Number(balance)){
          // error1();
          setErrormessage("Insufficient Balance")
          showErormessage();
          return
        }
        // success();
        let tempvalues = { ...values };
        setInputValue4('');
        form.resetFields();
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token not found in local storage');
          return;
        }

        const response = await fetch(`${linkurl}/sale/addsale`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            salenumber: tempvalues.salenumber.length,
            bundle:tempvalues.salenumber,
            f: Number(tempvalues.f),
            s: Number(tempvalues.s),
            type: "oversale",
            drawid: draw,
            salecode
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.data.length === 1) {
            let tempobj = { ...userData.data[0] };
            if (tempobj.type === "sale") {
              let temp = [...saledetail];
              temp.push(tempobj);
              setSaledetail(temp);
              setBalance(Number(balance)-Number(Number(tempobj.buyingdetail[1].f)+Number(tempobj.buyingdetail[1].s)))
            } else {
              let temp = [...oversaledetail];
              temp.push(tempobj);
              setOverSaledetail(temp);
              oversaleAudioRef?.current?.play();
            }
          } else {
            let tempobj = { ...userData.data[1] };
            let tempobj1 = { ...userData.data[0] };
            if (tempobj.type === "sale") {
              let temp = [...saledetail];
              temp.push(tempobj);
              setSaledetail(temp);
              setBalance(Number(balance)-Number(Number(tempobj.buyingdetail[1].f)+Number(tempobj.buyingdetail[1].s)))
            } else {
              let temp = [...oversaledetail];
              temp.push(tempobj);
              setOverSaledetail(temp);
              oversaleAudioRef?.current?.play();
            }
            if (tempobj1.type === "sale") {
              let temp = [...saledetail];
              temp.push(tempobj1);
              setSaledetail(temp);
              setBalance(Number(balance)-Number(Number(tempobj1.buyingdetail[1].f)+Number(tempobj1.buyingdetail[1].s)))
            } else {
              let temp = [...oversaledetail];
              temp.push(tempobj1);
              setOverSaledetail(temp);
              oversaleAudioRef?.current?.play();
            }
          }
          showMessage();
         
        } else {
          const userData = await response.json();
          // error()
          
          setErrormessage("This is an error")
          showErormessage();
          
          errorAudioRef?.current?.play();
        }
      } catch (error) {
        alert(error.message);
      }
      setLoading(false);
    }
    else{
      alert("Fill in all the inputs")
    }
  };

  const handleSuccessModalOk = () => {
    setSuccessModalVisible(false);
  };

  const handleErrorModalOk = () => {
    setErrorModalVisible(false);
  };

  const handleSmsButtonClick = () => {
    setSmsModalVisible(true); // Open SMS modal
  };
  const downloadinvoice = (arr,type) => {
   
    const filteredPayments = [...arr]
    let totalFirst1 = 0;
    let totalSecond1 = 0;
    let total1 = 0;
      filteredPayments.forEach((pay) => {
        totalFirst1 += parseFloat(pay.f) || 0;
        totalSecond1 += parseFloat(pay.s) || 0;
        total1 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
      })
    const doc = new jsPDF();
    let temparr =[filteredPayments]
    doc.setFontSize(16);
    doc.setTextColor(40);
    if(type==="sale"){
      doc.text('Total General Sale Report', 14, 22);
    }else{
      doc.text('Total Over Sale Report', 14, 22);

    }
    
    doc.text(`Total: ${total1.toFixed(2)}`, 14, 42);
    doc.setFontSize(10);
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${completedraw.date}`, 150, 30);
      doc.text(`Draw Title: ${completedraw.title}`, 14, 35);
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
        doc.setFont(undefined, 'bold')
        doc.text(pay.bundle.toString(), startX + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
        doc.setFont(undefined, 'normal');
        // Draw f block with dark blue/purplish border
        doc.setFillColor(255, 255, 255); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
        if(type==="oversale"){
          doc.setTextColor(255, 0, 0); // Red text
        }
       
       
             
        doc.text(pay.f.toString(), startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
        // Draw s block with dark blue/purplish border
        doc.setFillColor(255, 255, 255); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.rect(startX + 2 * blockWidth, startY, blockWidth, blockHeight, 'FD');
        doc.text(pay.s.toString(), startX + 2 * blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
        doc.setTextColor(0, 0, 0); // Black text
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
    doc.setFontSize(12);
  

    doc.save('Oversale Report.pdf');
  };
  const downloadinvoice1 = (arr, values) => {
    
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
      filteredPayments.forEach((pay) => {
        totalFirst1 += parseFloat(pay.f) || 0;
        totalSecond1 += parseFloat(pay.s) || 0;
        total1 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
      })
      arr.oversales.forEach((pay) => {
        totalFirst2 += parseFloat(pay.f) || 0;
        totalSecond2 += parseFloat(pay.s) || 0;
        total2 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
      })
    totalFirstf=totalFirst1+totalFirst2
    totalSecondf=totalSecond1+totalSecond2
    totalf=total1+total2
    // doc.text(`Total of First: ${totalFirstf.toFixed(2)}`, 14, 42);
    // doc.text(`Total of Second: ${totalSecondf.toFixed(2)}`, 84, 42);
    doc.text(`Total: ${totalf.toFixed(2)}`, 14, 42);
    for (let i=0;i<2;i++){
    let arr1 = filteredPayments.filter((obj) => obj.bundle.length === 1);
    let arr2 = filteredPayments.filter((obj) => obj.bundle.length === 2);
    let arr3 = filteredPayments.filter((obj) => obj.bundle.length === 3);
    let arr4 = filteredPayments.filter((obj) => obj.bundle.length === 4);
    let temparr = [arr1, arr2, arr3, arr4];
  
    doc.setFontSize(16);
    doc.setTextColor(40);
    if(i===0){
      doc.text('Save Sheet', 14, 22);
    }else{
      
      doc.setTextColor(255, 0, 0); // Red text
      doc.text('Over Sale Save Sheet', 14, 22);
      doc.setTextColor(40);
    }
    
  
    doc.setFontSize(10);
    if (userdata && userdata.username) {
      doc.text(`User: ${userdata.name}`, 14, 30);
      doc.text(`Username: ${userdata.username}`, 80, 30);
      doc.text(`Draw: ${completedraw.date}`, 150, 30);
      doc.text(`Draw Title: ${completedraw.title}`, 14, 35);
    }
  
    let startY = 60; // Initial Y position for the first section
    let startX = 14; // Initial X position
    const blockWidth = 15; // Smaller width for each block
    const blockHeight = 8; // Smaller height for each block
    // temparr.forEach((filteredPayments, arrIndex) => {
      
    //   if(filteredPayments.length>0){
    //   filteredPayments.forEach((pay) => {
    //     totalFirst1 += parseFloat(pay.f) || 0;
    //     totalSecond1 += parseFloat(pay.s) || 0;
    //     total1 += (parseFloat(pay.f) || 0) + (parseFloat(pay.s) || 0);
    //   })
    // }
    // })
    
    doc.setFontSize(12);
    doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
    doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);
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
        if(i===1){
          doc.setTextColor(255, 0, 0); // Red text
        }
      
        doc.text(pay.bundle.toString(), startX + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
       
        // Draw f block with dark blue/purplish border
        doc.setFillColor(255, 255, 255); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.rect(startX + blockWidth, startY, blockWidth, blockHeight, 'FD');
        if(i===1){
          doc.setTextColor(255, 0, 0); // Red text
        }
        doc.text(pay.f.toString(), startX + blockWidth + blockWidth / 2, startY + blockHeight / 2, { align: 'center' });
  
        // Draw s block with dark blue/purplish border
        doc.setFillColor(255, 255, 255); // White background
        doc.setDrawColor(75, 0, 130); // Dark blue/purplish border
        doc.rect(startX + 2 * blockWidth, startY, blockWidth, blockHeight, 'FD');
        if(i===1){
          doc.setTextColor(255, 0, 0); // Red text
        }

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
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    if(i===0){
      doc.text(`Total of First: ${totalFirst1.toFixed(2)}`, 14, startY);
      doc.text(`Total of Second: ${totalSecond1.toFixed(2)}`, 84, startY);
      doc.text(`Total: ${total1.toFixed(2)}`, 154, startY);
    }else{
      
      doc.setTextColor(255, 0, 0); // Red text
      doc.text(`Total of First: ${totalFirst2.toFixed(2)}`, 14, startY);
    doc.text(`Total of Second: ${totalSecond2.toFixed(2)}`, 84, startY);
    doc.text(`Total: ${total2.toFixed(2)}`, 154, startY);
    }
    
    doc.setFont(undefined, 'normal');
    doc.addPage();
    startY = 20; 
    filteredPayments = [
      ...arr.oversales
    ];
    }
    
   
    doc.save(`${sheetname}.pdf`);
  };
  const handleDownlaodSheet=async()=>{
    setSheetsaveloader(true)
    setLoading(true)
    let sheetcreated=null
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Token not found in local storage');
        return;
      }
      if(sheetname===""){
        alert("The sheetname could not be empty")
        return;
      }
      const response = await fetch(`${linkurl}/sale/addsheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          drawid:draw,
          sheetname:sheetname
        }),
      });
    
      if (response.ok) {
        const userData = await response.json();
        setSaledetail([])
        sheetcreated=userData.newSheet
        setOverSaledetail([])
        setSheetname("")
        setSheetModal(false)
        const response1 = await fetch(`${linkurl}/report/getSalesBySheet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            date:completedraw.date,
            report:"combined",
            sheet:sheetcreated._id,
            sheetId:completedraw._id
          }),
        });
        if (response1.ok) {
          const userData1 = await response1.json();
          downloadinvoice1(userData1)
          form.resetFields();
        } else {
          const userData1 = await response1.json();
          alert(userData1.Message)
        }
      }else{
    alert("There is an error")
    return;
      }
    

    }catch(error){
      alert(error.message)
    }
    setSheetsaveloader(false)
    setLoading(false)
  }
const handleSheetSave=async()=>{
  setSheetsaveloader(true)
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token not found in local storage');
    return;
  }
  if(sheetname===""){
    alert("The sheetname could not be empty")
    return;
  }
  const response = await fetch(`${linkurl}/sale/addsheet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify({
      drawid:draw,
      sheetname:sheetname
    }),
  });

  if (response.ok) {
    const userData = await response.json();
    setSaledetail([])
    setOverSaledetail([])
    setSheetname("")
    setSheetModal(false)
    setSheetsaveloader(false)
  }else{

  }
}
const handleSmsModalOk = async () => {
  try {
    let totalF = 0;
    let totalS = 0;
    modalTableData.forEach(sale => {
      totalF += Number(sale.f);
      totalS += Number(sale.s);
    });

    if (Number(totalF + totalS) > Number(balance)) {
      setErrormessage("Insufficient Balance");
      showErormessage();
      
      errorAudioRef?.current?.play();
      return;
    }

    const token = localStorage.getItem('token');
    if(modalTableData.length>200){
      setErrormessage(`There can be 200 maximum entries at a time.`);
      showErormessage();
      
      errorAudioRef?.current?.play();
      return;
    }
    let tempmodaldata = [...modalTableData];

    let invalidEntries = [];

    // Check for invalid entries
    for (let i = 0; i < tempmodaldata.length; i++) {
      let checkBundle = isNumericOnly(tempmodaldata[i].bundle);
      let checkF = isNumericOnly(tempmodaldata[i].f);
      let checkS = isNumericOnly(tempmodaldata[i].s);

      // If any of the fields are invalid, add the entry to the invalidEntries array
      if (!checkBundle || !checkF || !checkS) {
        invalidEntries.push(`Entry ${tempmodaldata[i].bundle}`);
      }
      if ( !checkS) {
        invalidEntries.push(`Entry  s: ${tempmodaldata[i].s}`);
      }
      if (!checkF ) {
        invalidEntries.push(`Entry f: ${tempmodaldata[i].f}`);
      }
    }

    // If there are invalid entries, show them in the error message
    if (invalidEntries.length > 0) {
      setErrormessage(`Invalid entries:\n${invalidEntries.join('\n')}`);
      showErormessage();
      
      errorAudioRef?.current?.play();
      return;
    }

    if (!token) {
      console.error('Token not found in local storage');
      return;
    }
    if(!isOnline){
      setErrormessage("No Internet")
      showErormessage();
      errorAudioRef?.current?.play();
      setLoading(false);
      return;
    }
    const response = await fetch(`${linkurl}/sale/addmultiplesale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        sales: tempmodaldata
      }),
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(userData)
      let tempsale = [...saledetail];
      let tempoversale = [...oversaledetail];
      let total = 0;

      for (let i = 0; i < userData.data.length; i++) {
        let tempobj = { ...userData.data[i] };
        if (tempobj.type === "sale") {
          tempsale.push(tempobj);
          total += Number(tempobj.buyingdetail[1].f);
          total += Number(tempobj.buyingdetail[1].s);
        } else {
          tempoversale.push(tempobj);
        }
      }

      setBalance(Number(balance) - Number(total));
      setSaledetail(tempsale);
      setOverSaledetail(tempoversale);
      if(tempoversale.length>0){
        oversaleAudioRef?.current?.play();
      }
      setBalance(Number(balance) - Number(totalF + totalS));
      setInputValue3("");
      setModalTableData([]);
      showMessage();


      let tempcompletedraw = { ...completedraw };
      if (!tempcompletedraw.sms) {
        tempcompletedraw.sms = {};
      }
      tempcompletedraw.sms[userdata._id] = 1 + (Number(tempcompletedraw.sms[userdata._id]) || 0);
      setCompletedraw(tempcompletedraw);
      setSmsModalVisible(false); // Close SMS modal
    } else {
      const userData = await response.json();
      alert(userData.Message);
      setSmsModalVisible(false); // Close SMS modal
    }
  } catch (error) {
    setErrormessage("An error occurred: " + error.message);
    showErormessage();
    errorAudioRef?.current?.play();
  }

  setLoading(false);
};
  const handleSmsModalCancel = () => {
    setSmsModalVisible(false); // Close SMS modal
  };

 

 
useEffect(()=>{
    let tempsalenumber=[]
    let temparr=[]
    for(let i=0;i<saledetail.length;i++){
      if(tempsalenumber.includes(saledetail[i].bundle)){
  const index=temparr.findIndex((obj)=>obj.bundle===saledetail[i].bundle)
        temparr[index]={bundle:saledetail[i].bundle,salenumber:saledetail[i].salenumber,f:(Number(temparr[index].f)+Number(saledetail[i].f)),s:(Number(temparr[index].s)+Number(saledetail[i].s))}
      }else{
        tempsalenumber.push(saledetail[i].bundle)
        temparr.push({bundle:saledetail[i].bundle,salenumber:saledetail[i].salenumber,f:Number(saledetail[i].f),s:Number(saledetail[i].s)})
      }
    }
    temparr.sort((a, b) => a.salenumber - b.salenumber);
    setSaledetailtotal(temparr);
},[saledetail])
useEffect(()=>{
  let temparr=[{total:saledetail.length,f:0,s:0,t:0}]
  for(let i=0;i<saledetail.length;i++){
    temparr[0].f=Number(saledetail[i].f)+Number(temparr[0].f)
    temparr[0].s=Number(saledetail[i].s)+Number(temparr[0].s)
  }
  temparr[0].t=Number(temparr[0].f)+Number(temparr[0].s)
  setSaletotal(temparr)
},[saledetail])
useEffect(()=>{
  let temparr=[{total:oversaledetail.length,f:0,s:0,t:0}]
  for(let i=0;i<oversaledetail.length;i++){
    temparr[0].f=Number(oversaledetail[i].f)+Number(temparr[0].f)
    temparr[0].s=Number(oversaledetail[i].s)+Number(temparr[0].s)
  }
  temparr[0].t=Number(temparr[0].f)+Number(temparr[0].s)
  oversetSaletotal(temparr)
},[oversaledetail])
useEffect(()=>{
  let tempsalenumber=[]
  let temparr=[]
  for(let i=0;i<oversaledetail.length;i++){
    if(tempsalenumber.includes(oversaledetail[i].bundle)){
const index=temparr.findIndex((obj)=>obj.bundle===oversaledetail[i].bundle)
      temparr[index]={bundle:oversaledetail[i].bundle,salenumber:oversaledetail[i].salenumber,f:(Number(temparr[index].f)+Number(oversaledetail[i].f)),s:(Number(temparr[index].s)+Number(oversaledetail[i].s))}
    }else{
      tempsalenumber.push(oversaledetail[i].bundle)
      temparr.push({bundle:oversaledetail[i].bundle,salenumber:oversaledetail[i].salenumber,f:Number(oversaledetail[i].f),s:Number(oversaledetail[i].s)})
    }
  }
  temparr.sort((a, b) => a.salenumber - b.salenumber);
  setOverSaledetailtotal(temparr);
},[oversaledetail])
const getvalue = async (inputValue) => {
  if (inputValue !== "") {
    const token = localStorage.getItem('token');
    const response = await fetch(`${linkurl}/draw/getdrawfieldsvalue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Add this line to specify the content type
        token: `${token}`,
      },
      body: JSON.stringify({
        bundle: inputValue, // Use inputValue here
        drawid: draw // Make sure this is the correct draw ID
      }),
    });

    if (response.ok) {
      const userData = await response.json();
      setValue(userData.data);
    } else {
      setValue({ a: 0, b: 0 });
    }
  } else {
    setValue({ a: 0, b: 0 });
  }
};
const CountdownTimer = ({ targetDate, targetTime }) => {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const targetDateTime = new Date(`${targetDate}T${targetTime}`);

    const updateRemainingTime = () => {
      const now = new Date();
      const timeDifference = targetDateTime - now;

      if (timeDifference <= 0) {
        setRemainingTime("Time's up!");
        return;
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setRemainingTime(`${days}D ${hours}H ${minutes}M ${seconds}S`);
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return <p style={{ fontSize: 14, paddingTop: 30}}>{remainingTime}</p>;
};
const handleNext = () => {
  setLastKeyPressed('next')
  if (activeInput === '1') {
    document.getElementById('2').focus();
    setActiveInput('2');
  } else if (activeInput === '2') {
    document.getElementById('3').focus();
    setActiveInput('3');
  } else if (activeInput === '3') {
    onFinish(); // Call handleApply when all inputs have been focused
    document.getElementById('1').focus();
    setActiveInput('1');
  }
  setTimeout(() => {
    setLastKeyPressed("")
  }, 500);
};
const handleNext1 = () => {
  if (activeInput === '1') {
    document.getElementById('2').focus();
    setActiveInput('2');
  } else if (activeInput === '2') {
    document.getElementById('3').focus();
    setActiveInput('3');
  } else if (activeInput === '3') {
    onFinish(); // Call handleApply when all inputs have been focused
    document.getElementById('1').focus();
    setActiveInput('1');
  }
};
useEffect(() => {
  const handleFocus = (e) => {
    const originalScrollY = window.scrollY;

    setTimeout(() => {
      window.scrollTo(0, originalScrollY);
    }, 0);
  };

  const inputs = document.querySelectorAll('input');

  inputs.forEach(input => {
    input.addEventListener('focus', handleFocus);
  });


  // Cleanup event listeners on component unmount
  return () => {
    inputs.forEach(input => {
      input.removeEventListener('focus', handleFocus);
    });
  };
}, []);
const tableRef = useRef(null);
const tableRef1 = useRef(null);
useLayoutEffect(() => {
  const tableBody = tableRef.current?.querySelector('.ant-table-body');
  if (tableBody) {
    // Ensure the scroll happens after the DOM updates
    tableBody.scrollTop = tableBody.scrollHeight;
  }
  const tableBody1 = tableRef1.current?.querySelector('.ant-table-body');
  if (tableBody1) {
    // Ensure the scroll happens after the DOM updates
    tableBody1.scrollTop = tableBody1.scrollHeight;
  }
}, [saledetail,oversaledetail]);
// UseEffect to check screen width and set readonly dynamically
useEffect(() => {
  const handleResize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1024) {
      setIsReadOnly(false); // Editable on laptop screens (1024px and above)
    } else {
      setIsReadOnly(true); // ReadOnly on smaller screens
    }
  };

  // Initial check
  handleResize();

  // Add event listener for window resize
  window.addEventListener('resize', handleResize);

  // Cleanup the event listener on unmount
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
// const setPageZoom = (zoomLevel) => {
//   document.body.style.zoom = zoomLevel;
//   document.body.style.MozTransform = `scale(${zoomLevel})`;  // For Firefox
//   document.body.style.WebkitTransform = `scale(${zoomLevel})`;  // For Chrome, Safari, and newer versions of Opera
//   document.body.style.OTransform = `scale(${zoomLevel})`;  // For old versions of Opera
//   document.body.style.transform = `scale(${zoomLevel})`;  // Standard property
// };
// useEffect(() => {
//   // Set the desired zoom level (e.g., 0.8 for 80% zoom)
//   setPageZoom(0.8);
// }, []);
useEffect(() => {
  const timer = setTimeout(() => {
    const inputElement = document.getElementById('1');
    if (inputElement) {
      inputElement.focus();
    }
  }, 1000); // 100ms delay
setActiveInput('1')
  return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
}, [selecteddraw]);
const getTableHeight = () => {
  return !isMobile ? '350px' : '160px'; // Adjust these values as needed
};
const Keyboard = () => {
  // Memoize the number buttons layout
  const numberButtons = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  // Create a single click handler for all number buttons
  const handleNumberClick = (number) => {
    handleKeyPress(number.toString());
    setLastKeyPressed(number.toString());
    setTimeout(() => setLastKeyPressed(""), 200); // Reduced timeout
  };

  // Create a single click handler for special characters
  const handleSpecialClick = (char) => {
    setLastKeyPressed(char);
    setTimeout(() => setLastKeyPressed(""), 200); // Reduced timeout
  };

  return (
    <div className="keyboard">
      {/* First row */}
      {numberButtons[0].map((num) => (
        <div
          key={num}
          style={{
            backgroundColor: lastkeypressed === num.toString() ? '#d2d5d9' : 'white',
            color: lastkeypressed === num.toString() ? 'white' : 'black',
          }}
          onClick={() => handleNumberClick(num)}
        >
          {num}
        </div>
      ))}
      <div 
        style={{backgroundColor: lastkeypressed === 'back' ? 'red' : '#d3a6ed'}} 
        onClick={handleBackspace}
      >
        <BackspaceIcon />
      </div>

      {/* Second row */}
      {numberButtons[1].map((num) => (
        <div
          key={num}
          style={{
            backgroundColor: lastkeypressed === num.toString() ? '#d2d5d9' : 'white',
            color: lastkeypressed === num.toString() ? 'white' : 'black',
          }}
          onClick={() => handleNumberClick(num)}
        >
          {num}
        </div>
      ))}
      <div 
        style={{backgroundColor: lastkeypressed === 'next' ? 'green' : '#52cca7'}} 
        onClick={handleNext}
      >
        <ArrowForwardIcon />
      </div>

      {/* Third row */}
      {numberButtons[2].map((num) => (
        <div
          key={num}
          style={{
            backgroundColor: lastkeypressed === num.toString() ? '#d2d5d9' : 'white',
            color: lastkeypressed === num.toString() ? 'white' : 'black',
          }}
          onClick={() => handleNumberClick(num)}
        >
          {num}
        </div>
      ))}

      {/* Special characters */}
      <div
        style={{
          backgroundColor: lastkeypressed === "_" ? '#d2d5d9' : 'white',
          color: lastkeypressed === "_" ? 'white' : 'black',
        }}
        onClick={() => handleSpecialClick("_")}
      >
        {'_'}
      </div>

      <div
        style={{
          backgroundColor: lastkeypressed === "," ? '#d2d5d9' : 'white',
          color: lastkeypressed === "," ? 'white' : 'black',
        }}
        onClick={() => handleSpecialClick(",")}
      >
        {','}
      </div>

      <div
        style={{
          backgroundColor: lastkeypressed === "0" ? '#d2d5d9' : 'white',
          color: lastkeypressed === "0" ? 'white' : 'black',
        }}
        onClick={() => handleNumberClick(0)}
      >
        0
      </div>

      <div
        style={{
          backgroundColor: lastkeypressed === "." ? '#d2d5d9' : 'white',
          color: lastkeypressed === "." ? 'white' : 'black',
        }}
        onClick={() => handleSpecialClick(".")}
      >
        {'.'}
      </div>

      <div
        style={{
          backgroundColor: lastkeypressed === "-" ? '#d2d5d9' : 'white',
          color: lastkeypressed === "-" ? 'white' : 'black',
        }}
        onClick={() => handleSpecialClick("-")}
      >
        {'-'}
      </div>
    </div>
  );
};
const [tableHeight, setTableHeight] = useState(getTableHeight());
// Add this near your other state declarations
// const [isOnline, setIsOnline] = useState(navigator.onLine);
// console.log(isOnline)
// // Add this useEffect
// useEffect(() => {
// if(isOnline){
//   console.log("Online")
// }else{
//   console.log("Offline")
// }

//   // Check initial state
//   if (!navigator.onLine) {
//     setErrormessage("No internet connection");
//     showErormessage();
//     errorAudioRef?.current?.play();
//   }
// }, []);
// Memoize the input components to prevent unnecessary re-renders

 
const handleKeyDown = (e, currentId) => {
  // Trigger when user presses Enter or tries to move to next field
  if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault(); // Prevent normal tabbing if desired
    switch (currentId) {
      case '4':
        // Move focus to input '5'
        document.getElementById('5').focus();
        break;
      case '5':
        // Move focus to input '6'
        document.getElementById('6').focus();
        break;
      case '6':
        // If on last input ('6'), cycle back to first ('4')
        document.getElementById('4').focus();
        break;
      default:
        break;
    }
  }
};
const handleKeyDown1 = (e, currentId) => {
  // Trigger when user presses Enter or tries to move to next field
  if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault(); // Prevent normal tabbing if desired
    switch (currentId) {
      case '1':
        if(inputValue===''){

        }else{
          // Move focus to input '5'
          document.getElementById('2').focus();
          setActiveInput('2')
        }
        

        break;
      case '2':
        // Move focus to input '6'
        if(inputValue1===''){

        }else{
          document.getElementById('3').focus();
        setActiveInput('3')
        }
        
        break;
      case '3':
        if(inputValue2===''){

        }else{
// If on last input ('6'), cycle back to first ('4')
document.getElementById('1').focus();
setActiveInput('1')
onFinish();
        }
        
        break;
      default:
        break;
    }
  }
};

  return (
    <>
    
    <div className="App prevent-bounce">
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
          <p>Please Wait...</p>
        </div>):<>
      {isVisible && (
        <div className="custom-success-message show">
          Entry is saved successfully!
        </div>
      )}
      {isVisible1 && (
        <div style={{zIndex:9999}} className="custom-error-message show">
          {errormessage}
        </div>
      )}
     <audio controls ref={errorAudioRef} style={{ display: "none" }}>
        <source src={errorAudio} type="audio/mp3" />
      </audio>
      <audio controls ref={oversaleAudioRef} style={{ display: "none" }}>
        <source src={oversaleAudio} type="audio/mp3" />
      </audio>
     <DrawSelector 
  completedraw={completedraw}
  products={products}
  getSaleDetail={getSaleDetail}
  setCompletedraw={setCompletedraw}
  setSelectedDraw={setSelectedDraw}
/>
     <div style={{display:'flex',flexDirection:'row',marginTop:15, borderBottom: '2px solid black',paddingBottom:-5}}>
      {<p style={{fontSize:14,marginLeft:10,marginRight:10}}>{userdata.username}</p>}
      {/* {<p style={{fontSize:14,marginRight:10}}>Credit : {credit}</p>} */}
      {<p style={{fontSize:14}}>Balanace : {balance.toFixed(0)}</p>}
     { upline<0&&<p style={{fontSize:14,marginLeft:10,color:'red'}}>Upline : {upline.toFixed(0)}</p>}
      {upline>0&&<p style={{fontSize:14,marginLeft:10,color:'green'}}>Upline : {upline.toFixed(0)}</p>}
      {completedraw && !isMobile && 
  <p style={{
    zIndex: 9999,
    color: "green",
    marginTop: -10,
    marginLeft: 50
  }}>
    {"Draw : "+completedraw.title+" "+completedraw.date+" "+completedraw.time}
  </p>
}
      </div>
     {draw&& <>
     
     
    <div style={{display:'flex',flexDirection:'row', borderBottom: '2px solid black',padding:2,paddingTop:4}}>

      <div
      >
    {/* <Button type="primary" style={{marginLeft:10, width: 140,fontWeight:'bold' }} onClick={showModal}>{"Game Ok : " + (saletotal&&saletotal.length>0)?saletotal[0].t:0}</Button>{' '} */}
    <Button 
  type="primary" 
  style={{
    marginLeft: 0, 
    width: 120,
    textAlign: 'left',
    paddingLeft: 10 // Add some padding to prevent text from sticking to the edge
  }} 
  onClick={showModal}
>
  {"G:" + (saletotal && saletotal.length > 0 ? saletotal[0].t : 0)}
</Button>
    {/* {selectedRowKeys && selectedRowKeys.length > 0 && ( */}
      <Button style={{width:50,paddingLeft:-10,fontSize:10 }} danger onClick={() => setDeleteConfirmationVisible(true)} disabled={!(selectedRowKeys && selectedRowKeys.length > 0)} type="primary">Delete</Button>
    {/* )} */}
    {' '}
  <Button style={{marginRight:10 }} onClick={() => setSheetModal(true)} type="primary">Save</Button>
    <Button style={{right:0,position:'absolute' }} type="primary" danger onClick={showModal1}> {"No Ok:" + (oversaletotal && oversaletotal.length > 0 ? oversaletotal[0].t : 0)}</Button>{' '}

</div>
     </div>
   
     
      <div className="table-container">
        <div className="scrollable-table-container"
        style={{
          borderRight: '2px solid black', // Complete border property with width, style, and color
        }}
        >
  
        <div 
        ref={tableRef}
        
        >
        <Table
       
        columns={columns1}
        id="saletable"
        dataSource={saledetail}
        pagination={false}
        rowKey="_id"
        bordered
        size="small"
        rowSelection={rowSelection}
        scroll={{ y: tableHeight }} // Adjust the height as needed
      />
      </div>
        </div>
        <div  className="scrollable-table-container2">
       
        <div ref={tableRef1} >
              <Table
                columns={columns2}
                id="oversaletable"
                dataSource={oversaledetail}
                pagination={false}
                rowKey="_id"
                bordered
                size="small"
                scroll={{ y:tableHeight}} 
              />
            </div>
        </div>
      
      </div>
      <Form >
      <Row style={{marginTop:-25}} gutter={6}>
      <Col xs={4} sm={4}>
      <div style={{display:'flex',flexDirection:'column'}}>
  <Form.Item style={{ marginTop: 45, marginLeft: 5 }}>
  <Input
  id="1"
  inputMode="numeric" 
  pattern="[0-9]*" 
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          data-lpignore="true"
          enterKeyHint="next"
          autoComplete="off"
          role="presentation"
  // readOnly={isReadOnly}
  value={inputValue}
  placeholder="No"
  onKeyDown={(e) => handleKeyDown1(e, '1')}
  onFocus={(e) => {
    e.target.select();
    setActiveInput('1');
  }}
  onClick={(e) => {
    e.target.select();
    setActiveInput('1');
  }}
  onChange={handleInputChange}
  onKeyPress={(e) => {
    if (e.key === 'Enter' && inputValue!=="") {
      e.preventDefault();
      handleNext1()
    }
  }}
  className="custom-input no-select no-context-menu black-border-focus no-caret"
  style={{ 
    marginTop: 0,
    fontWeight: 'bold',
    fontSize: 18,
    zIndex: 999,
    height: 30,
  }}
/>
</Form.Item>

  </div>
  </Col>
  <Col xs={4} sm={4}>
  <div style={{display:'flex',flexDirection:'column'}}>
  <p style={{marginLeft:30,marginTop:25,marginBottom:5,color:'green',zIndex:99}}>{value.a}</p>
  <Form.Item style={{ marginLeft: 10 }} >
  <Input
  id='2'
  inputMode="numeric"
  pattern="[0-9]*"
  autoCapitalize="off"
  autoCorrect="off"
  spellCheck="false"
  data-lpignore="true"
  
  enterKeyHint="next"
  autoComplete="off"
  role="presentation"
  onKeyDown={(e) => handleKeyDown1(e, '2')}
  value={inputValue1}
  placeholder='F'
  onFocus={(e) => {
    e.target.select();
    setActiveInput('2');
  }}
  onClick={(e) => {
    e.target.select();
    setActiveInput('2');
  }}
  onChange={handleInputChange1}
  className="custom-input no-select no-context-menu black-border-focus no-caret"
  onKeyPress={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext1();
    }
  }}
  style={{
    marginLeft: 10,
    height: 30,
    marginTop: -100,
    fontWeight: 'bold',
    fontSize: 18,
    zIndex: 999,
    caretColor: 'transparent', // This will hide the cursor
  }}
/>
  </Form.Item>
  </div>
  </Col>
  <Col xs={4} sm={4}>
  <div style={{display:'flex',flexDirection:'column'}}>
  <p style={{marginLeft:40,marginTop:25,marginBottom:5,color:'green',zIndex:99}}>{value.b}</p>
  <Form.Item style={{ marginLeft: 15,zIndex:99 }}>
      <Input
      id="3"
      onKeyDown={(e) => handleKeyDown1(e, '3')}
      // readOnly={isReadOnly} // Dynamically set readOnly based on screen width
      value={inputValue2}
      inputMode="numeric" 
  pattern="[0-9]*" 
  autoCapitalize="off"
  autoCorrect="off"
  spellCheck="false"
  data-lpignore="true"
  enterKeyHint="next"
  autoComplete="off"
  role="presentation"
      placeholder="S"
      onFocus={(e) => {
        e.target.select();
        setActiveInput('3');
      }}
      onClick={(e) => {
        e.target.select();
        setActiveInput('3');
      }}
      onChange={handleInputChange2}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default form submission
          handleNext1()
        }
      }}
      className="custom-input no-select no-context-menu black-border-focus no-caret"
      style={{
        marginLeft: 20,
        height:30,
        marginTop: -100,
        zIndex: 999,
        fontWeight: 'bold',fontSize:18
      }}
    />
  </Form.Item>
  
  </div>
 
  </Col>
  <Col xs={4} sm={4}>
  <Form.Item>
    
    <Button style={{height:45,marginTop:32,marginLeft:50,zIndex:999,fontWeight:'bold' }} onClick={onFinish} type="primary">
      Add
    </Button>
  </Form.Item>
  </Col>
  <Col xs={4} sm={4}>
  <Form.Item>
    <Button style={{marginTop:35,marginLeft:55,fontWeight:'bold' }}onClick={handleSmsButtonClick}type="primary">
    SMS
    </Button>
  </Form.Item>
  </Col>
  </Row>
</Form>

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
        <Modal
          title="Confirm Deletion"
          visible={deleteConfirmationVisible1}
          onOk={handleDelete1}
          onCancel={() => setDeleteConfirmationVisible1(false)}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete the {selectedRowKeys1.length} selected rows?</p>
        </Modal>
     
      <Modal
            title="Success"
            visible={successModalVisible}
            onOk={handleSuccessModalOk}
            onCancel={handleSuccessModalOk}
            footer={[
              <Button
                icon={<CloseCircleFilled />}
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
            Sale added successfully!
          </Modal>

          <Modal
            title="Error"
            visible={errorModalVisible}
            onOk={handleErrorModalOk}
            onCancel={handleErrorModalOk}
          >
            Error adding sale. Please try again.
          </Modal>
          <Modal
  title={`Send SMS Total Game: ${modalTableTotal}`}
  visible={smsModalVisible}
  onOk={handleSmsModalOk}
  onCancel={handleSmsModalCancel}
  style={{
    zIndex: 9999
  }}
  bodyStyle={{
    height: '500px',  // Set a fixed height for the modal body
    display: 'flex',
    flexDirection: 'column'
  }}
>
  <p>{completedraw && completedraw.sms && completedraw.sms[userdata._id] ? completedraw.sms[userdata._id] : "0"}</p>
  <TextArea
    value={inputValue3}
    placeholder="1,f1,s1 or 2,f2,s2"
    onChange={handleInputChange3}
    rows={6}
    style={{
      width: '100%',
      fontSize: '14px',
      resize: 'vertical',
      marginBottom: '10px'
    }}
  />
  <div style={{ flex: 1, overflow: 'auto' }}>
    <Table
      columns={columns1}
      dataSource={modalTableData}
      pagination={false}
      bordered
      size="small"
      scroll={{ y: 'calc(100% - 10px)' }}  // Make the table body scrollable
      style={{ marginTop: 20 }}
    />
  </div>
</Modal>
      <Modal
        title={"Save Sheet"}
        visible={sheetmodal}
        onOk={handleSheetSave}
        onCancel={()=>setSheetModal(false)}
        style={{
          zIndex:9999
        }}
        footer={[
          <Button
            key="dedlete"
            type="danger"
            disabled={sheetsaveloader}
            onClick={handleDownlaodSheet}
            icon={<CloudDownloadOutlined />}
            style={{
              borderRadius: 10,
              background: COLORS.savegradient,
              color: 'white',
            }}
          >
            Download
          </Button>,
          <Button
            key="delete"
            type="danger"
            disabled={sheetsaveloader}
            onClick={handleSheetSave}
            icon={<SaveFilled />}
            style={{
              borderRadius: 10,
              background: COLORS.primarygradient,
              color: 'white',
            }}
          >
            Save
          </Button>,
        ]}
      >
        <p style={{fontWeight:'bolder',fontSize:16}}>Total : {saletotal&&saletotal[0]?saletotal[0].t+(oversaletotal&&oversaletotal[0]?oversaletotal[0].t:0):0}</p>
        <Input
          value={sheetname}
          placeholder="sheet name"
          onChange={(e)=>{setSheetname(e.target.value)}}
        />
      </Modal>
      <Modal
        title="General sale"
        visible={isGModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
        style={{
          zIndex:9999
        }}
      >
        <p><strong>Username : </strong> {userdata.username}</p>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Invoice" key="1">
          <Button
                key="downloadinvoicesale"
                type="danger"
                onClick={()=>downloadinvoice(saledetail,"sale")}
                icon={<SaveFilled />}
                style={{
                  borderRadius: 10,
                  background: COLORS.savegradient,
                  color: 'white',
                }}
              >
                Download
              </Button>
              <Table
            columns={columns}
            dataSource={saletotal}
            pagination={false}
            rowKey="_id"
            bordered
            size="small"            
          />
          <div style={{minHeight:20}}>

          </div>
          <Table
            columns={columns1}
            dataSource={saledetail}
            rowKey="_id"
            bordered
            size="small"            
          />
          </TabPane>
          <TabPane tab="Alltotal" key="2">
          <Button
                key="downloadinvoicesaletotal"
                type="danger"
                onClick={()=>downloadinvoice(saledetailtotal,"sale")}
                icon={<SaveFilled />}
                style={{
                  borderRadius: 10,
                  background: COLORS.savegradient,
                  color: 'white',
                }}
              >
                Download
              </Button>
          
          <Table
            columns={columns1}
            dataSource={saledetailtotal}
            rowKey="_id"
            bordered
            size="small"
          />
          </TabPane>
        </Tabs>
      </Modal>
      <Modal
        title="Over sale :  گیم کا لین دین نہیں ہو گا No ok"
        visible={isGModalVisible1}
        onOk={handleOk1}
        onCancel={handleCancel1}
        width={400}
        style={{
          zIndex:9999
        }}
      >
        <p><strong>Username : </strong> {userdata.username}</p>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Invoice" key="1">
          <Button
                key="downloadinvoiceoversale"
                type="danger"
                onClick={()=>downloadinvoice(oversaledetail,"oversale")}
                icon={<SaveFilled />}
                style={{
                  borderRadius: 10,
                  background: COLORS.savegradient,
                  color: 'white',
                }}
              >
                Download
              </Button>
              {selectedRowKeys1 && selectedRowKeys1.length > 0 && <Button onClick={() => setDeleteConfirmationVisible1(true)} type="primary" danger>Delete</Button>}{' '}
              <Table
            columns={columns}
            dataSource={oversaletotal}
            rowKey="_id"
            pagination={false}
            bordered
            size="small"            
          />
          <div style={{minHeight:20}}>

</div>
          <Table
            columns={columns1}
            dataSource={oversaledetail}
            rowKey="_id"
            bordered
            size="small"
        rowSelection={rowSelection1}
          />
          <Form style={{zIndex:99999}}>
          <Row gutter={6}>
           
   <Col xs={4} sm={4}>
        <Form.Item>
          <Input
            id='4'
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue4}
            placeholder='No'
            onFocus={(e) => {
              e.target.select();
              setActiveInput('4');
            }}
            onKeyDown={(e) => handleKeyDown(e, '4')}
            onChange={handleInputChange4 }
            className="custom-input"
          />
        </Form.Item>
      </Col>
      <Col xs={4} sm={4}>
        <Form.Item>
          <Input
            id='5'
            inputMode="numeric"
            pattern="[0-9]*"
            value={ inputValue5 }
            placeholder='f'
            onFocus={(e) => {
              e.target.select();
              setActiveInput('5');
            }}
            onKeyDown={(e) => handleKeyDown(e, '5')}
            onChange={handleInputChange5}
            className="custom-input"
            style={{ marginLeft: 20 }}
          />
        </Form.Item>
      </Col>
      <Col xs={4} sm={4}>
        <Form.Item>
          <Input
            id='6'
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue6 }
            placeholder='s'
            onFocus={(e) => {
              e.target.select();
              setActiveInput('6');
            }}
            onKeyDown={(e) => handleKeyDown(e, '6')}
            onChange={ handleInputChange6 }
            className="custom-input"
            style={{
              zIndex: 9999,
              marginLeft: 40
            }}
          />
        </Form.Item>
      </Col>
  <Col xs={4} sm={4}>
  <Form.Item>
    <Button style={{height:30,marginTop:0,marginLeft:70,zIndex:999}} onClick={onFinish1} type="primary">
      Add
    </Button>
  </Form.Item>
  </Col>
  
  </Row>
</Form>
          </TabPane>
          <TabPane tab="Alltotal" key="2">
          <Button
                key="downloadinvoiceoversaletotal"
                type="danger"
                onClick={()=>downloadinvoice(oversaledetailtotal,"oversale")}
                icon={<SaveFilled />}
                style={{
                  borderRadius: 10,
                  background: COLORS.savegradient,
                  color: 'white',
                }}
              >
                Download
              </Button>
          <Table
            columns={columns1}
            dataSource={oversaledetailtotal}
            rowKey="_id"
            bordered
            size="small"
          />
          </TabPane>
        </Tabs>
      </Modal>
      </>}</>}
    </div>
    </>
  );
};

export default App;

