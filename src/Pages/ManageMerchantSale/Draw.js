import React, { useMemo,useRef,useState,useEffect, useCallback } from 'react';
import { Col, Form, Select } from 'antd';
import drawactiveAudio from "./drawactive.mp3";
import './App.css';

const { Option } = Select;

const DrawSelector = ({ completedraw, products, getSaleDetail, setCompletedraw,setSelectedDraw }) => {
  const drawactiveAudioRef = useRef(null);
  const memoizedProducts = useMemo(() => products, [products]);
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
  
    return <p style={{ fontSize: 12, paddingTop: 30}}>{remainingTime  }</p>;
  };
  const handleChange = useCallback((e) => {
    getSaleDetail(e);
    const index = memoizedProducts.findIndex((obj) => obj._id === e);
    setCompletedraw(memoizedProducts[index]);
    setSelectedDraw(memoizedProducts[index]);
    drawactiveAudioRef?.current?.play();
  }, [getSaleDetail, memoizedProducts, setCompletedraw]);

  

  const memoizedLabel = useMemo(() => 
    completedraw && (
      <CountdownTimer 
        targetDate={completedraw.date} 
        targetTime={completedraw.time} 
      />
    ),
    [completedraw]
  );
  return (
    <Col xs={25} sm={8}>
      <Form.Item
        style={{ borderBottom: '2px solid black' }}
        label={memoizedLabel}
        name={'blocked'}
        rules={[{ required: true, message: 'Please select Draw' }]}
        className="flex-item"
      >
        <Select 
          onChange={handleChange} 
          placeholder="Select Draw"
          className="custom-select"
        >
      {   
           memoizedProducts.map((element) => (
          <Option key={element._id} value={element._id}>
              {element.title + " --- " + element.date}
          </Option>
             ))
             }
        </Select>
      </Form.Item>
      <audio controls ref={drawactiveAudioRef} style={{ display: "none" }}>
        <source src={drawactiveAudio} type="audio/mp3" />
      </audio>
    </Col>
  );
};

export default React.memo(DrawSelector);