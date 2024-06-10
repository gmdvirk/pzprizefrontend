import React, { useState } from 'react';
import { Form, Input, Button, Card, Select } from 'antd';
import { UserOutlined, LockOutlined, LockFilled } from '@ant-design/icons';
import {auth} from "../firebase-config1";
import COLORS from '../colors';
import { useNavigate } from 'react-router-dom';
// import jwt from 'jsonwebtoken';
import {db} from "../firebase-config";
import { sendEmailVerification,updateProfile, createUserWithEmailAndPassword ,onAuthStateChanged,signOut,signInWithEmailAndPassword, updatePassword, deleteUser} from "firebase/auth";
import { doc,getDoc,setDoc,updateDoc } from 'firebase/firestore';

const { Option } = Select;
const SignInPage = () => {
  const navigate = useNavigate();
const [userdata,setUserdata]=useState(null)
function getSubstringBeforeAtSymbol(email) {
  const atIndex = email.indexOf('@');
  
  if (atIndex !== -1) {
    return email.substring(0, atIndex);
    // or use slice: return email.slice(0, atIndex);
  } else {
    // handle the case where '@' is not present in the email
    return 'Invalid email format';
  }
}
let check=false;
const onFinish1 = async (values) => {
  
  try{
    values.username=values.username+"@gmail.com"

  
    const result = getSubstringBeforeAtSymbol( values.username);
    const userDocRef = doc(db, "Users", result);
    const querySnapshot = await getDoc(userDocRef);

    if (querySnapshot.exists()) {
      const userData = querySnapshot.data();
      if(userData.password===values.password){
        if(userData.newpassword!==""){
          check=true;
    const userinfo = await signInWithEmailAndPassword(auth, values.username, userData.newpassword);
    if(userinfo){
      // Update password in Firebase Auth
      await updatePassword(auth.currentUser, userData.password);
      // Update password in Firestore
      await updateDoc(userDocRef, { newpassword: ""});
      setUserdata(userData);
      navigate("/profile");
    }
        }else{
          const userinfo = await signInWithEmailAndPassword(auth, values.username, values.password);
          if(userinfo){
            setUserdata(userData);
            navigate("/profile");
          }
        }

      }else{
        alert("Incorrect Password")
      }
    }else{
      const userinfo = await signInWithEmailAndPassword(auth, values.username, values.password);
      if(userinfo){
        await deleteUser(auth.currentUser)
        navigate("/login")
      }
    }
 
  }catch(error){
    if(error.message==="Firebase: Error (auth/invalid-credential)."){
      const result = getSubstringBeforeAtSymbol( values.username);
      const userDocRef = doc(db, "Users", result);
      const querySnapshot = await getDoc(userDocRef);

      if (querySnapshot.exists()) {
        const userData = querySnapshot.data();
        if (values.password === userData.password) {
          try{
            if(check){
              await signInWithEmailAndPassword(auth, values.username, userData.password);
              await updateDoc(userDocRef, { newpassword: ""});
              setUserdata(userData);
              navigate("/profile");
              return;
            }else{
              await createUserWithEmailAndPassword(auth, values.username, userData.password);
              setUserdata(userData);
              navigate("/profile");
              return;
            }
          
          }catch(e){
            if(error.message==="Firebase: Error (auth/invalid-credential)."){
              if(check){
                await createUserWithEmailAndPassword(auth, values.username, userData.password);
                await updateDoc(userDocRef, { newpassword: ""});
                setUserdata(userData);
                navigate("/profile");
                return;
              }
            }
           
          }
        }
      }
    }
  // }
}
}
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
      
      // Navigate to the desired route
      // navigate("/");
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
