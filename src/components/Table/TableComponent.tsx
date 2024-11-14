import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface TableComponentProps<T> {
  data: T[];  // Dữ liệu có kiểu động
  columns: TableProps<T>['columns'];  // Cột cũng phải hỗ trợ kiểu động
}

const TableComponent = <T extends object>({ data, columns }: TableComponentProps<T>) => {
  return <Table<T> columns={columns} dataSource={data} />;
};

export default TableComponent;