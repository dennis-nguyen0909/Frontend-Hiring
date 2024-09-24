import React, { useEffect, useState } from 'react';
import * as UserService from '../../services/authServices';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
const navigation =useNavigate()
    const handleLogin = async (e:any) => {
        e.preventDefault();
        setError('');

        try {
            const res = await UserService.login({ username: email, password });
            if(res){
                navigation('/')
            }
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại');
        }
    };
    const checkToken = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/check-token`, {
                withCredentials: true, // Quan trọng: Gửi cookie theo yêu cầu
            });
            if (response.data.valid) {
                console.log('Token hợp lệ:', response.data.user);
                // Tiến hành thực hiện điều gì đó với thông tin người dùng
            } else {
                console.log('Token không hợp lệ');
                // Xử lý nếu token không hợp lệ, ví dụ: chuyển hướng đến trang đăng nhập
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra token:', error);
        }
    };

    useEffect(()=>{
        checkToken()
    },[])
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition">Đăng Nhập</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
