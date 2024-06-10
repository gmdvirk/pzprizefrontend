// Import necessary modules
import React from 'react';
import ChartWidget from './ChartWidget';

// Render the component
const App = ({ title, label, profit }) => {
  return (
    <div>
      <ChartWidget id="chart1" title={title} label={label} profit={profit} />
    </div>
  );
};

export default App;
