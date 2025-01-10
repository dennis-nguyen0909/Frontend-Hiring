import React from 'react';
import { Pagination } from 'antd';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './styles.css'
interface CustomPaginationProps {
  currentPage: number;
  total: number;
  perPage: number;
  onPageChange: (current: number, pageSize: number) => void;
  className?:string;
  sizeArrow?:number ;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, total, perPage, onPageChange,className,sizeArrow=30 }) => {
  return (
    <Pagination
      className={`panigate ${className}`}
      current={currentPage}
      pageSize={perPage}
      total={total}
      pageSizeOptions={['10', '20', '30']}
      onChange={onPageChange}
      onShowSizeChange={onPageChange}
      itemRender={(current, type, originalElement) => {
        if (type === 'prev') {
          return (
            <ArrowLeft
              size={sizeArrow}
              className="hover:bg-[#f3f3f3] px-2 py-2 cursor-pointer rounded-full"
            />
          );
        }
        if (type === 'next') {
          return (
            <ArrowRight
              size={sizeArrow}
              className="hover:bg-[#f3f3f3] px-2 py-2 cursor-pointer rounded-full"
            />
          );
        }
        return originalElement;
      }}
      style={{
        marginTop: '20px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        // marginBottom:'20px'
      }}
    />
  );
};

export default CustomPagination;
