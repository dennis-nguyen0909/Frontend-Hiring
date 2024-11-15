import { useState } from 'react'
import { List, Button, Dropdown, message, Avatar } from 'antd'
import { 
  MoreOutlined, 
  MailOutlined,
  DownloadOutlined,
  BookOutlined
} from '@ant-design/icons'

interface Candidate {
  id: string
  name: string
  position: string
  avatar: string
  isBookmarked: boolean
}

export default function SavedCandidate() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Guy Hawkins',
      position: 'Technical Support Specialist',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    },
    {
      id: '2',
      name: 'Jacob Jones',
      position: 'Product Designer',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    },
    {
      id: '3',
      name: 'Cameron Williamson',
      position: 'Marketing Officer',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    },
    {
      id: '4',
      name: 'Robert Fox',
      position: 'Marketing Manager',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    },
    {
      id: '5',
      name: 'Kathryn Murphy',
      position: 'Junior Graphic Designer',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    },
    {
      id: '6',
      name: 'Darlene Robertson',
      position: 'Visual Designer',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    },
    {
      id: '7',
      name: 'Kristin Watson',
      position: 'Senior UX Designer',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    },
    {
      id: '8',
      name: 'Jenny Wilson',
      position: 'Interaction Designer',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    },
    {
      id: '9',
      name: 'Marvin McKinney',
      position: 'Networking Engineer',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    },
    {
      id: '10',
      name: 'Theresa Webb',
      position: 'Software Engineer',
      avatar: '/placeholder.svg?height=40&width=40',
      isBookmarked: true
    }
  ])

  const handleBookmark = (candidateId: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, isBookmarked: !candidate.isBookmarked }
          : candidate
      )
    )
  }

  const handleViewProfile = (candidateId: string) => {
    message.info(`Viewing profile of candidate ${candidateId}`)
  }

  const handleSendEmail = (candidateId: string) => {
    message.success('Email dialog opened')
  }

  const handleDownloadCV = (candidateId: string) => {
    message.success('Downloading CV...')
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">Saved Candidates</h1>
              <p className="text-sm text-gray-500">
                All of the candidates are visible until 24 march, 2021
              </p>
            </div>
          </div>

          <List
            itemLayout="horizontal"
            dataSource={candidates}
            renderItem={(candidate) => (
              <List.Item
                key={candidate.id}
                className="px-6 hover:bg-gray-50 transition-colors"
                actions={[
                  <Button
                    key="bookmark"
                    type="text"
                    icon={<BookOutlined className={candidate.isBookmarked ? 'text-blue-500' : ''} />}
                    onClick={() => handleBookmark(candidate.id)}
                    aria-label={candidate.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  />,
                  <Button
                    key="view"
                    type="primary"
                    className="bg-blue-500"
                    onClick={() => handleViewProfile(candidate.id)}
                  >
                    View Profile
                  </Button>,
                  <Dropdown
                    key="more"
                    menu={{
                      items: [
                        {
                          key: '1',
                          icon: <MailOutlined />,
                          label: 'Send Email',
                          onClick: () => handleSendEmail(candidate.id)
                        },
                        {
                          key: '2',
                          icon: <DownloadOutlined />,
                          label: 'Download CV',
                          onClick: () => handleDownloadCV(candidate.id)
                        }
                      ]
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <Button
                      icon={<MoreOutlined />}
                      type="text"
                      aria-label="More options"
                    />
                  </Dropdown>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={candidate.avatar}
                      alt={`${candidate.name}'s avatar`}
                      className="w-10 h-10"
                    />
                  }
                  title={
                    <span className="font-medium">{candidate.name}</span>
                  }
                  description={
                    <span className="text-gray-500">{candidate.position}</span>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  )
}