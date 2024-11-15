
import { EllipsisOutlined, FileTextOutlined, SaveOutlined, TeamOutlined } from "@ant-design/icons";
import { Badge, Button, Dropdown, Table } from "antd";
import { Text } from "lucide-react";

const OverviewEmployer = () => {
    const columns = [
        {
          title: 'JOBS',
          dataIndex: 'title',
          key: 'title',
          render: (text: string, record: any) => (
            <div>
              <div className="font-medium">{text}</div>
              <div className="text-gray-500 text-sm">
                {record.type} • {record.timeRemaining}
              </div>
            </div>
          ),
        },
        {
          title: 'STATUS',
          dataIndex: 'status',
          key: 'status',
          render: (status: string) => (
            <Badge
              status={status === 'Active' ? 'success' : 'error'} 
              text={status} 
              className="whitespace-nowrap"
            />
          ),
        },
        {
          title: 'APPLICATIONS',
          dataIndex: 'applications',
          key: 'applications',
          render: (count: number) => (
            <div className="flex items-center gap-2">
              <TeamOutlined />
              <span>{count} Applications</span>
            </div>
          ),
        },
        {
          title: 'ACTIONS',
          key: 'actions',
          render: () => (
            <div className="flex gap-2">
              <Button type="primary" className="bg-blue-500">
                View Applications
              </Button>
              <Dropdown
                menu={{
                  items: [
                    { key: '1', label: 'Promote Job' },
                    { key: '2', label: 'View Detail' },
                    { key: '3', label: 'Mark as expired' },
                  ],
                }}
                trigger={['click']}
              >
                <Button icon={<EllipsisOutlined />} />
              </Dropdown>
            </div>
          ),
        },
      ]
    
      const data = [
        {
          key: '1',
          title: 'UI/UX Designer',
          type: 'Full Time',
          timeRemaining: '27 days remaining',
          status: 'Active',
          applications: 798,
        },
        {
          key: '2',
          title: 'Senior UX Designer',
          type: 'Internship',
          timeRemaining: '8 days remaining',
          status: 'Active',
          applications: 185,
        },
        {
          key: '3',
          title: 'Technical Support Specialist',
          type: 'Part Time',
          timeRemaining: '4 days remaining',
          status: 'Active',
          applications: 558,
        },
        {
          key: '4',
          title: 'Junior Graphic Designer',
          type: 'Full Time',
          timeRemaining: '24 days remaining',
          status: 'Active',
          applications: 583,
        },
        {
          key: '5',
          title: 'Front End Developer',
          type: 'Full Time',
          timeRemaining: 'Dec 7, 2019',
          status: 'Expired',
          applications: 740,
        },
      ]
    return (
       <div>
         <div className="mb-8">
        <p >Hello, Instagram</p>
        <Text className="text-gray-500">Here is your daily activities and applications</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-3xl font-bold">589</div>
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <span>Open Jobs</span>
          </div>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="text-3xl font-bold">2,517</div>
          <div className="flex items-center gap-2">
            <SaveOutlined />
            <span>Saved Candidates</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <p  className="mb-0">Recently Posted Jobs</p>
          <Button type="link">View all</Button>
        </div>
        <Table
          columns={columns} 
          dataSource={data} 
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-gray-50"
        />
      </div>
       </div>
    )
}


export default OverviewEmployer;