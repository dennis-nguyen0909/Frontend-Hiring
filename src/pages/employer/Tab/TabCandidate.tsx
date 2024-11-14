import React from 'react';
import TableComponent from '../../../components/Table/TableComponent';
import { TableProps } from 'antd';
import { Tag, Space } from 'antd';

// Ví dụ 1: Table với DataType là người dùng
interface User {
  key: string;
  name: string;
  age: number;
  address: string;
}

const userColumns: TableProps<User>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

const userData: User[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

// Ví dụ 2: Table với DataType là sản phẩm
interface Product {
  key: string;
  name: string;
  price: number;
  category: string;
}

const productColumns: TableProps<Product>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
];

const productData: Product[] = [
  {
    key: '1',
    name: 'Product 1',
    price: 100,
    category: 'Electronics',
  },
  {
    key: '2',
    name: 'Product 2',
    price: 200,
    category: 'Furniture',
  },
  {
    key: '3',
    name: 'Product 3',
    price: 150,
    category: 'Toys',
  },
];

const TabCandidate: React.FC = () => {
  return (
    <div>
      <h2>User Table</h2>
      <TableComponent<User> data={userData} columns={userColumns} />
    </div>
  );
};

export default TabCandidate;
