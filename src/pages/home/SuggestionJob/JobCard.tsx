import { Card } from 'antd'
import { EnvironmentOutlined, BookOutlined } from '@ant-design/icons'
import { Job } from './types/job';

interface JobCardProps {
  job: any[];
  onSave?: (id: string) => void;
}

export function JobCard({ job, onSave }: JobCardProps) {
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
        
    }
  };

  return (
    <Card 
      className="w-full hover:shadow-md transition-shadow duration-200"
      bodyStyle={{ padding: '1.25rem' }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job?.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(job?.job_type?.key)}`}>
                {job?.job_type?.name}
              </span>
              <span className="text-sm text-gray-600">
                Salary: ${job?.salary_range?.min} - ${job?.salary_range?.max}
              </span>
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
          <img 
            src={job?.company?.logo} 
            alt={`${job?.company?.name} logo`}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{job?.company?.name}</span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <EnvironmentOutlined className="text-xs" />
              {job?.location?.city}, {job?.location?.country}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

