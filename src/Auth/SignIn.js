import React, { useState } from 'react';
import { Form, Input, Button, Card, Select } from 'antd';
import { UserOutlined, LockOutlined, LockFilled } from '@ant-design/icons';
import COLORS from '../colors';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const SignInPage = () => {
  const navigate = useNavigate();

const onFinish = async (values) => {
  const { username, password } = values;

  try {
    const response = await fetch(`http://localhost:3001/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Store relevant data in localStorage
      localStorage.setItem('token', data.token);
      navigate("/");
    } else {
      const errorData = await response.json();
      console.error('Login failed:', errorData.Message);
      // Handle the error, e.g., show an error message to the user
    }
  } catch (error) {
    console.error('Unexpected error during login:', error.message);
    // Handle unexpected errors
  }
};

  return (
    <div className="signin-container">
      <Card title="Sign In" className="signin-card">
        <Form
          name="signin-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
                   {/* <Form.Item
      // label={"Account Type"}
                    name={ 'accountType'}
                      rules={[{ required: true, message: 'Please select Account Type' }]}
                      className="flex-item"
                      fieldKey={ 'accountType'}
                    >
                      <Select placeholder="Select Account Type" >
                        <Option value="Customer">Customer</Option>
                        <Option value="Management">Management</Option>
                      </Select>
                    </Form.Item> */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button 
            icon={<LockFilled/>}
            style={{
              background:COLORS.primarygradient,
               color:"white"
            }}
            htmlType="submit" className="signin-button">
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignInPage;
