import React, { useState } from 'react';
import {Select,Tabs,Spin} from 'antd';
import AddUserForm from './Editdistributor';
import EditComission from "./Editcomission"
import Editprize from "./EditPrize"
import EditLimit from "./EditLimit"
import 'jspdf-autotable';

const { Option } = Select;
const { TabPane } = Tabs;


const ProductTable = ({ products, setProducts,userdata,setUserdata,limits,  setLimits,  alldraws,  setAllDraws }) => {
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(userdata);
  const [loading,setLoading]=useState(false)
 
 
  const renderProductSelection1 = () => {
    const renderGeneral = () => (
      <AddUserForm
          initialValues={selectedProduct}
          userdata={userdata}
          onCancel={() => setVisible(false)}
          setProducts={setProducts}
          products={products}
          setUserdata={setUserdata}
        />
    );
    const renderComission = () => (
      <EditComission
      initialValues={selectedProduct}
      userdata={userdata}
      onCancel={() => setVisible(false)}
      setProducts={setProducts}
      products={products}
      setUserdata={setUserdata}
    />
  );
    const renderPrize = () => (
      <Editprize
      initialValues={selectedProduct}
      userdata={userdata}
      onCancel={() => setVisible(false)}
      setProducts={setProducts}
      products={products}
      setUserdata={setUserdata}
    />
  );
  const renderLimit = () => (
    <EditLimit
    initialValues={selectedProduct}
    userdata={userdata}
    onCancel={() => setVisible(false)}
    setProducts={setProducts}
    products={products}
    limits={limits}
    setLimits={setLimits}
    alldraws={alldraws}
    setAllDraws={setAllDraws}
  />
  );
    return (
      <Tabs defaultActiveKey="mobile" type="card">
      <TabPane tab="Comission Settings" key="comission">
        {renderComission()}
      </TabPane>
      <TabPane tab="General Info" key="general">
        {renderGeneral()}
      </TabPane>
      <TabPane tab="Prize Setting" key="prize">
        {renderPrize()}
      </TabPane>
      <TabPane tab="Limit Cutting" key="limitprize">
        {renderLimit()}
      </TabPane>
    </Tabs>
    );
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
      
        
        {renderProductSelection1()}
    
      </>}
      </div>
     

    
    </>
  );
};

export default ProductTable;
