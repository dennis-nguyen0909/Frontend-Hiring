import { TableProps } from "antd";

export interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }
  
  export interface TableComponentProps {
    data: DataType[];
    columns: TableProps<DataType>['columns'];
  }