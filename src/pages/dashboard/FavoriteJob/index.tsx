import { Button, Pagination, Table } from "antd"
import { Bookmark } from "lucide-react"


const FavoriteJob = ()=>{
    const columns = [
        {
          title: '',
          dataIndex: 'job',
          key: 'job',
          render: (text, record) => (
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg mr-3 flex items-center justify-center text-white ${record.bgColor}`}>
                {record.icon}
              </div>
              <div>
                <div className="font-semibold">{text}</div>
                <div className="text-gray-500 text-sm">
                  <span className="mr-2">{record.location}</span>
                  <span className="mr-2">{record.salary}</span>
                  {record.jobExpire && <span className="text-red-500">{record.jobExpire}</span>}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${record.jobTypeBg} ${record.jobTypeColor}`}>{record.jobType}</span>
              </div>
            </div>
          ),
        },
        {
          title: '',
          key: 'bookmark',
          render: () => (
            <Bookmark className="text-gray-400" />
          ),
        },
        {
          title: '',
          key: 'action',
          render: (_, record) => (
            <Button 
              type={record.status === 'Deadline Expired' ? 'default' : 'primary'}
              className={record.status === 'Deadline Expired' ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 hover:bg-blue-600'}
            >
              {record.status === 'Deadline Expired' ? 'Deadline Expired' : 'Apply Now →'}
            </Button>
          ),
        },
      ]
    
      const data = [
        {
          key: '1',
          job: 'Technical Support Specialist',
          location: 'Idaho, USA',
          salary: '$15K-$20K',
          jobExpire: 'Job Expire',
          bgColor: 'bg-gray-200',
          icon: 'G',
          jobType: 'Full Time',
          jobTypeBg: 'bg-blue-100',
          jobTypeColor: 'text-blue-600',
          status: 'Deadline Expired',
        },
        {
          key: '2',
          job: 'UI/UX Designer',
          location: 'Minnesota, USA',
          salary: '$10K-$15K',
          bgColor: 'bg-red-500',
          icon: '▶️',
          jobType: 'Full Time',
          jobTypeBg: 'bg-blue-100',
          jobTypeColor: 'text-blue-600',
          status: 'Apply Now',
        },
        {
          key: '3',
          job: 'Senior UX Designer',
          location: 'United Kingdom of Great Britain',
          salary: '$30K-$35K',
          bgColor: 'bg-gray-300',
          icon: '🧩',
          jobType: 'Full Time',
          jobTypeBg: 'bg-blue-100',
          jobTypeColor: 'text-blue-600',
          status: 'Apply Now',
        },
        {
          key: '4',
          job: 'Junior Graphic Designer',
          location: 'Mymensingh, Bangladesh',
          salary: '$40K-$50K',
          bgColor: 'bg-blue-600',
          icon: 'f',
          jobType: 'Full Time',
          jobTypeBg: 'bg-blue-100',
          jobTypeColor: 'text-blue-600',
          status: 'Apply Now',
        },
        {
          key: '5',
          job: 'Technical Support Specialist',
          location: 'Idaho, USA',
          salary: '$15K-$20K',
          jobExpire: 'Job Expire',
          bgColor: 'bg-gray-200',
          icon: 'G',
          jobType: 'Full Time',
          jobTypeBg: 'bg-blue-100',
          jobTypeColor: 'text-blue-600',
          status: 'Deadline Expired',
        },
        {
          key: '6',
          job: 'Product Designer',
          location: 'Sivas, Turkey',
          salary: '$50K-$70K',
          bgColor: 'bg-blue-400',
          icon: '🐦',
          jobType: 'Full Time',
          jobTypeBg: 'bg-blue-100',
          jobTypeColor: 'text-blue-600',
          status: 'Apply Now',
        },
        {
          key: '7',
          job: 'Project Manager',
          location: 'Ohio, USA',
          salary: '$50K-$80K',
          bgColor: 'bg-red-400',
          icon: 'u',
          jobType: 'Full Time',
          jobTypeBg: 'bg-blue-100',
          jobTypeColor: 'text-blue-600',
          status: 'Apply Now',
        },
        {
          key: '8',
          job: 'Marketing Manager',
          location: 'Konya, Turkey',
          salary: '$20K-$25K',
          bgColor: 'bg-blue-200',
          icon: '⊞',
          jobType: 'Temporary',
          jobTypeBg: 'bg-yellow-100',
          jobTypeColor: 'text-yellow-600',
          status: 'Apply Now',
        },
      ]
    return (
        <div>
             <h1 className="text-2xl font-semibold mb-6">Favorite Jobs (17)</h1>

{/* Favorite Jobs Table */}
<div className="bg-white rounded-lg shadow">
  <Table columns={columns} dataSource={data} pagination={false} />
</div>

{/* Pagination */}
<div className="mt-4 flex justify-center">
  <Pagination defaultCurrent={1} total={50} />
</div>
        </div>
    )
}

export default FavoriteJob