import React, { useState } from 'react';
import { Button } from 'antd';

import LoadingModal from './LoadingModal';
const App = () => {
    const [loading, setLoading] = useState(false);
  
    const showModal = () => {
      setLoading(true);
      // Simulate a network request or any async operation
      setTimeout(() => {
        setLoading(false);
      }, 3000); // Hide the modal after 3 seconds
    };
  
    return (
      <div style={{ padding: 50 }}>
        <Button type="primary" onClick={showModal}>
          Show Loading Modal
        </Button>
        <LoadingModal visible={loading} message="Please wait, loading..." />
      </div>
    );
  };
  
  export default App;