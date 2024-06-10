// src/LoadingModal.js

import React from 'react';
import { Modal, Spin } from 'antd';

const LoadingModal = ({ visible, message }) => {
  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      centered
      bodyStyle={{ textAlign: 'center' }}
    >
      <Spin size="large" />
      {message && <div style={{ marginTop: 16 }}>{message}</div>}
    </Modal>
  );
};

export default LoadingModal;
