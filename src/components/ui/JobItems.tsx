import React from 'react';
import { Image } from 'antd';
interface JobItemsProps {
  count: string;
  label: string;
  key:number;
  image:string;
}

const JobItems: React.FC<JobItemsProps> = ({ count, label,key,image }) => {

  return (
    <div key={key} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow w-[280px]">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
        <Image  src={image} preview={false} />
      </div>
      <div>
        <div className="text-2xl  text-grayText font-sans">{count}</div>
        <div className="text-gray-500 font-sans">{label}</div>
      </div>
    </div>
  );
};

export default JobItems;
