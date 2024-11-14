import { Button, Table } from "antd"



const OverViewCandidate = ()=>{
    const recentlyAppliedColumns = [
        {
          title: 'Job',
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
              </div>
            </div>
          ),
        },
        {
          title: 'Date Applied',
          dataIndex: 'dateApplied',
          key: 'dateApplied',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (text) => (
            <span className="text-green-500">✓ {text}</span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: () => (
            <Button type="primary" className="bg-blue-500 hover:bg-blue-600">View Details</Button>
          ),
        },
      ]
    
      const recentlyAppliedData = [
        {
          key: '1',
          job: 'Networking Engineer',
          location: 'Washington',
          salary: '$50k-80k/month',
          dateApplied: 'Feb 2, 2019 19:28',
          status: 'Active',
          bgColor: 'bg-green-500',
          icon: 'Up',
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
        },
      ]
    return (
        <div>
             <h1 className="text-2xl font-semibold mb-1">Hello, Esther Howard</h1>
        <p className="text-gray-500 mb-6">Here is your daily activities and job alerts</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-3xl font-bold">589</div>
            <div className="text-blue-600">Applied jobs</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-3xl font-bold">238</div>
            <div className="text-yellow-600">Favorite jobs</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-3xl font-bold">574</div>
            <div className="text-green-600">Job Alerts</div>
          </div>
        </div>

        {/* Profile Alert */}
        <div className="bg-red-100 p-4 rounded-lg flex items-center mb-6">
          <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="w-10 h-10 rounded-full mr-4" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-700">Your profile editing is not completed.</h3>
            <p className="text-red-600">Complete your profile editing & build your custom Resume</p>
          </div>
          <Button type="primary" className="bg-white text-red-500 border-red-500 hover:bg-red-50">
            Edit Profile →
          </Button>
        </div>

        {/* Recently Applied Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recently Applied</h2>
            <a href="#" className="text-blue-500 hover:underline">View all →</a>
          </div>
          <Table columns={recentlyAppliedColumns} dataSource={recentlyAppliedData} pagination={false} />
        </div>
        </div>
    )
}

export default OverViewCandidate