import React, { useState } from 'react';
import { Form, Input, Button, Card, Select } from 'antd';
import { UserOutlined, LockOutlined, LockFilled } from '@ant-design/icons';
import ReCAPTCHA from "react-google-recaptcha";
import COLORS from '../colors';
import { linkurl } from '../link';
import { useNavigate } from 'react-router-dom';
import Logo from "./logo192.png"

const { Option } = Select;

const SignInPage = () => {
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);

  const onFinish = async (values) => {
    const { username, password } = values;

    if (!captchaValue) {
      alert("Please complete the reCAPTCHA");
      return;
    }

    try {
      const response = await fetch(`${linkurl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, captchaValue }),
      });

      if (response.ok) {
        const data = await response.json();
        if(data.Success){
          localStorage.setItem('token', data.token);
          if(data.rest._doc.role==="merchant"){
            navigate("/merchant")
          }
          else if(data.rest._doc.role==="superadmin"){
            navigate("/admindistributors")
          }
          else if(data.rest._doc.role==="distributor" || data.rest._doc.role==="subdistributor"){
            navigate("/distributorsmerchants")
          }else{
            navigate("/");
          }
        }else{
          alert(data.Message)
        }
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.Message);
        alert(errorData.Message)
      }
    } catch (error) {
      console.error('Unexpected error during login:', error.message);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (
    <div className="signin-container">
      <Card title="Sign In" className="signin-card">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img src={Logo} alt="Logo" style={{ maxWidth: '80px',borderRadius:10 }} />  {/* Adjust the size as needed */}
        </div>
        <Form
          name="signin-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
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
          <Form.Item >
            <ReCAPTCHA
              sitekey="6Ldv-lMqAAAAAFwTlBYzcqzaG1S2ZMdtOO8tAe5L"
              onChange={handleCaptchaChange}
            />
          </Form.Item>
          <Form.Item>
            <Button 
              icon={<LockFilled/>}
              style={{
                background: COLORS.primarygradient,
                color: "white"
              }}
              htmlType="submit" 
              className="signin-button"
              // disabled={!captchaValue}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignInPage;