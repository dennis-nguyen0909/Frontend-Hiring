// src/pages/register/Register.tsx

import React, { useState } from 'react';
import { Input, Button } from 'antd'; // Sử dụng Ant Design cho Input và Button
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlices';
import * as UserService from '../../services/authServices'
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    console.log(user)
  const handleRegister = async () => {
    // Xử lý đăng ký, gửi thông tin đến API
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    try {
      const response = await UserService.register({ full_name:fullName, email, password });
      console.log("response",response)
      console.log("fullName",fullName)
      console.log("email",email)
      console.log("password",password)
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Đăng Ký</h2>
      <Input
        placeholder="Họ và tên"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <Input.Password
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <Input.Password
        placeholder="Nhập lại mật khẩu"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mb-4"
      />
      <Button type="primary" onClick={handleRegister} className="w-full">
        Đăng Ký
      </Button>
    </div>
  );
};

export default Register;
