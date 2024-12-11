import { Avatar, Card } from 'antd'
import { EnvironmentOutlined, BookOutlined } from '@ant-design/icons'
import { Job } from './types/job';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatPercentage } from '../../../untils';

interface JobCardProps {
  job: any[];
  onSave?: (id: string) => void;
}

export function JobCard({ job, onSave }: JobCardProps) {
  const navigate =useNavigate()
  console.log("adasdasda",job)
  const getTypeColor = (key:string) => {
    switch (key) {
      case 'in_office':
        return 'bg-green-100 text-green-600';
      case 'remote':
        return 'bg-blue-100 text-blue-600';
      case 'hybird':
        return 'bg-purple-100 text-purple-600';
      case 'oversea':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-purple-100 text-purple-600';
        
    }
  };

  return (
    <Card 
      className="w-full hover:shadow-md transition-shadow duration-200 cursor-pointer"
      bodyStyle={{ padding: '1.25rem' }}
      onClick={()=>navigate(`/job-information/${job._id}`)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <div>
             <h3 className="text-lg font-semibold text-gray-900">{job?.title}</h3>
             {job?.similarity && 
             <span className="text-[11px] text-gray-500 flex items-center gap-1">Phù hợp với kỹ năng của bạn {formatPercentage(job?.similarity)}</span>
             }
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(job?.job_type?.key)}`}>
                {job?.job_type?.name}
              </span>
              {job?.is_negotiable ? (
                <span className="text-[11px] text-gray-600">
                Lương: Thỏa thuận
              </span>
              ):(
              <span className="text-[11px] text-gray-600">
                Lương: {formatCurrency(job?.salary_range?.min)}{job?.type_money?.symbol} - {formatCurrency(job?.salary_range?.max)}{job?.type_money?.symbol}
              </span>
              )}
            </div>
          </div>
          <button 
            onClick={() => onSave?.(job.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <BookOutlined className={job.isSaved ? "text-blue-500" : ""} />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar 
            shape="square"
            src={job?.user_id?.avatar_company} 
            style={{ objectFit: 'cover', display: 'block' }}
            size={40}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{job?.user_id?.company_name}</span>
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <EnvironmentOutlined className="text-xs" />
                {job?.district_id?.name}, {job?.city_id?.name}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

