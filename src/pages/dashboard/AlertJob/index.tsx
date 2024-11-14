import { EditOutlined } from "@ant-design/icons"
import { Button, Pagination, Table } from "antd"
import { Bookmark } from "lucide-react"


const AlertJob = ()=>{const columns = [
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
              <span className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {record.timeRemaining}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${record.jobTypeBg} ${record.jobTypeColor}`}>{record.jobType}</span>
          </div>
        </div>
      ),
    },
    {
      title: '',
      key: 'bookmark',
      render: (_, record) => (
        <Bookmark className={record.bookmarked ? "text-blue-500" : "text-gray-400"} />
      ),
    },
    {
      title: '',
      key: 'action',
      render: () => (
        <Button type="primary" className="bg-blue-500 hover:bg-blue-600">
          Apply Now →
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
      timeRemaining: '4 Days Remaining',
      bgColor: 'bg-gray-200',
      icon: 'G',
      jobType: 'Full Time',
      jobTypeBg: 'bg-blue-100',
      jobTypeColor: 'text-blue-600',
      bookmarked: false,
    },
    {
      key: '2',
      job: 'UI/UX Designer',
      location: 'Minnesota, USA',
      salary: '$10K-$15K',
      timeRemaining: '4 Days Remaining',
      bgColor: 'bg-red-500',
      icon: '▶️',
      jobType: 'Full Time',
      jobTypeBg: 'bg-blue-100',
      jobTypeColor: 'text-blue-600',
      bookmarked: false,
    },
    {
      key: '3',
      job: 'Front End Developer',
      location: 'Mymensingh, Bangladesh',
      salary: '$10K-$15K',
      timeRemaining: '4 Days Remaining',
      bgColor: 'bg-orange-500',
      icon: '🅾️',
      jobType: 'Internship',
      jobTypeBg: 'bg-yellow-100',
      jobTypeColor: 'text-yellow-600',
      bookmarked: true,
    },
    {
      key: '4',
      job: 'Marketing Officer',
      location: 'Montana, USA',
      salary: '$50K-$60K',
      timeRemaining: '4 Days Remaining',
      bgColor: 'bg-blue-700',
      icon: '👍',
      jobType: 'Full Time',
      jobTypeBg: 'bg-blue-100',
      jobTypeColor: 'text-blue-600',
      bookmarked: false,
    },
    {
      key: '5',
      job: 'Networking Engineer',
      location: 'Michigan, USA',
      salary: '$5K-$10K',
      timeRemaining: '4 Days Remaining',
      bgColor: 'bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500',
      icon: '📷',
      jobType: 'Full Time',
      jobTypeBg: 'bg-blue-100',
      jobTypeColor: 'text-blue-600',
      bookmarked: true,
    },
    {
      key: '6',
      job: 'Senior UX Designer',
      location: 'United Kingdom of Great Britain',
      salary: '$30K-$35K',
      timeRemaining: '4 Days Remaining',
      bgColor: 'bg-gray-300',
      icon: '🧩',
      jobType: 'Full Time',
      jobTypeBg: 'bg-blue-100',
      jobTypeColor: 'text-blue-600',
      bookmarked: false,
    },
  ]

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Job Alerts <span className="text-blue-500 text-sm">(9 new jobs)</span></h1>
          <Button icon={<EditOutlined />} className="flex items-center">
            Edit Job Alerts
          </Button>
        </div>

        {/* Job Alerts Table */}
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
export default AlertJob