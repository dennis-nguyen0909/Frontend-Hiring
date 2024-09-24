import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigation =useNavigate()
    const handleLogin = ()=>{
        navigation('/login')
    }
    const handleRegister = ()=>{
        navigation('/register')

    }
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-[#666666]">
          <a href="/">DevWork</a>
        </div>

        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm việc làm..."
            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-2 text-gray-500">
            <SearchOutlined />
          </button>
        </div>

        {/* Navigation Links */}
        <nav>
        <ul className="flex space-x-6 text-gray-700">
            <li>
              <Link to="/jobs" className="hover:text-blue-600">Việc làm</Link>
            </li>
            <li>
              <Link to="/companies" className="hover:text-blue-600">Công ty</Link>
            </li>
            <li>
              <Link to="/cv-template" className="hover:text-blue-600">Mẫu CV</Link>
            </li>
            <li>
              <Link to="/career-guide" className="hover:text-blue-600">Hướng dẫn nghề nghiệp</Link>
            </li>
          </ul>
        </nav>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button onClick={handleLogin} className="bg-[#666666] text-white px-4 py-2 rounded hover:bg-blue-700">
            Đăng nhập
          </button>
          <button onClick={handleRegister} className="border border-[#666666] text-[#666666] px-4 py-2 rounded hover:bg-blue-50">
            Đăng ký
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
