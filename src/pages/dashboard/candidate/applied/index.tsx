import { Button, Pagination, Table } from "antd"

const Applied = ()=>{
    const columns = [
        {
          title: 'JOBS',
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
                  <span>{record.salary}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${record.jobTypeBg} ${record.jobTypeColor}`}>{record.jobType}</span>
              </div>
            </div>
          ),
        },
        {
          title: 'DATE APPLIED',
          dataIndex: 'dateApplied',
          key: 'dateApplied',
        },
        {
          title: 'STATUS',
          dataIndex: 'status',
          key: 'status',
          render: (text) => (
            <span className="text-green-500">✓ {text}</span>
          ),
        },
        {
          title: 'ACTION',
          key: 'action',
          render: () => (
            <Button type="primary" className="bg-blue-500 hover:bg-blue-600">View Details</Button>
          ),
        },
      ]
    
      const data = [
        {
          key: '1',
          job: 'Networking Engineer',
          location: 'Washington',
          salary: '$50k-80k/month',
          dateApplied: 'Feb 2, 2019 19:28',
          status: 'Active',
          bgColor: 'bg-green-500',
          icon: 'Up',
          jobType: 'Remote',
          jobTypeBg: 'bg-blue-100',
          jobTypeColor: 'text-blue-600',
        },
        {
          key: '2',
          job: 'Product Designer',
          location: 'Dhaka',
          salary: '$50k-80k/month',
          dateApplied: 'Dec 7, 2019 23:26',
          status: 'Active',
          bgColor: 'bg-pink-500',
          icon: 'Pd',
          jobType: 'Full Time',
          jobTypeBg: 'bg-purple-100',
          jobTypeColor: 'text-purple-600',
        },
        {
          key: '3',
          job: 'Junior Graphic Designer',
          location: 'Brazil',
          salary: '$50k-80k/month',
          dateApplied: 'Feb 2, 2019 19:28',
          status: 'Active',
          bgColor: 'bg-black',
          icon: '🍎',
          jobType: 'Temporary',
          jobTypeBg: 'bg-yellow-100',
          jobTypeColor: 'text-yellow-600',
        },
        {
          key: '4',
          job: 'Visual Designer',
          location: 'Wisconsin',
          salary: '$50k-80k/month',
          dateApplied: 'Dec 7, 2019 23:26',
          status: 'Active',
          bgColor: 'bg-blue-500',
          icon: 'Vd',
          jobType: 'Contract Base',
          jobTypeBg: 'bg-green-100',
          jobTypeColor: 'text-green-600',
        },
        {
          key: '5',
          job: 'Marketing Officer',
          location: 'United States',
          salary: '$50k-80k/month',
          dateApplied: 'Dec 4, 2019 21:42',
          status: 'Active',
          bgColor: 'bg-blue-400',
          icon: '🐦',
          jobType: 'Full Time',
          jobTypeBg: 'bg-purple-100',
          jobTypeColor: 'text-purple-600',
        },
        {
          key: '6',
          job: 'UI/UX Designer',
          location: 'North Dakota',
          salary: '$50k-80k/month',
          dateApplied: 'Dec 30, 2019 07:52',
          status: 'Active',
          bgColor: 'bg-blue-600',
          icon: 'f',
          jobType: 'Full Time',
          jobTypeBg: 'bg-purple-100',
          jobTypeColor: 'text-purple-600',
        },
        {
          key: '7',
          job: 'Software Engineer',
          location: 'New York',
          salary: '$50k-80k/month',
          dateApplied: 'Dec 30, 2019 05:18',
          status: 'Active',
          bgColor: 'bg-gray-300',
          icon: '🧩',
          jobType: 'Full Time',
          jobTypeBg: 'bg-purple-100',
          jobTypeColor: 'text-purple-600',
        },
        {
          key: '8',
          job: 'Front End Developer',
          location: 'Michigan',
          salary: '$50k-80k/month',
          dateApplied: 'Mar 20, 2019 23:14',
          status: 'Active',
          bgColor: 'bg-orange-500',
          icon: '🅾️',
          jobType: 'Full Time',
          jobTypeBg: 'bg-purple-100',
          jobTypeColor: 'text-purple-600',
        },
      ]
    
    return(
        <div>
               <h1 className="text-2xl font-semibold mb-6">Applied Jobs (589)</h1>

{/* Applied Jobs Table */}
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

export default Applied