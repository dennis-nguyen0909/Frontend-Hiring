import { Button, Card, Avatar } from 'antd'
import { InstagramOutlined, FacebookOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons'
import Image from 'next/image'
import Link from 'next/link'

export default function EmployerDetail() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 text-sm">
          <span className="text-gray-500">Home / Find Employers / </span>
          <span className="font-medium">Single Employers</span>
        </div>
      </div>

      {/* Banner */}
      <div className="relative h-64">
        <Image
          src="/placeholder.svg?height=256&width=1280"
          alt="Company banner"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar size={64} icon={<InstagramOutlined />} className="bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500" />
              <div>
                <h1 className="text-2xl font-semibold">Twitter</h1>
                <p className="text-gray-500">Information Technology (IT)</p>
              </div>
            </div>
            <Button type="primary" size="large" className="bg-blue-600">
              View Open Position →
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <Card title="Description" className="shadow-sm">
              <p className="text-gray-600">
                Fusce et erat ut nibh maximus fermentum. Mauris ac justo nibh. Praesent nec lorem lorem.
                Donec ullamcorper sed metus tortor pretium malesuada. In quis porta nisi, quis fringilla orci.
                Donec porttitor, odio a efficitur blandit, orci nisi porta elit, eget volutpat quam nibh in tellus.
                Sed ut posuere risus, vitae commodo velit. Nullam in lorem dolor. Class aptent taciti sociosqu
                ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum ante ipsum primis in
                faucibus orci luctus et ultrices posuere cubilia curae; Nulla facilisi. Sed vel vehicula
                sapien. Praesent mattis ullamcorper magna. Vivamus elementum eu leo et pretium. Sed posuam
                placerat diam, ac lacinia eros rutrum sit amet. Donec imperdiet in leo at imperdiet. In hac
                habitasse platea dictumst. Sed quis nisi molestie diam ullamcorper consectetur. Sed aliquet,
                arcu eget pretium bibendum, odio enim rutrum arcu, quis suscipit mauris turpis in neque.
                Vestibulum id vestibulum odio. Sed dolor felis, lacinia eget turpis eu, lobortis imperdiet massa.
              </p>
            </Card>

            {/* Company Benefits */}
            <Card title="Company Benefits" className="shadow-sm">
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>In hac habitasse platea dictumst.</li>
                <li>Sed aliquet, arcu eget pretium bibendum, odio enim rutrum arcu.</li>
                <li>Vestibulum id vestibulum odio.</li>
                <li>Etiam libero ante accumsan id tellus venenatis rhoncus volutpate velit.</li>
                <li>Nam condimentum sit amet ipsum id malesuada.</li>
              </ul>
            </Card>

            {/* Company Vision */}
            <Card title="Company Vision" className="shadow-sm">
              <p className="text-gray-600">
                Praesent ultrices mauris at nisi euismod, ut venenatis augue blandit. Etiam massa risus,
                accumsan nec tempus nec, venenatis in nisi. Maecenas nulla ex, blandit in magna id,
                pellentesque facilisis sapien. In feugiat auctor mi, eget commodo lectus convallis ac.
              </p>
            </Card>

            {/* Share Profile */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Share profile:</span>
              <Link href="#" className="text-blue-600 hover:text-blue-800">
                <FacebookOutlined className="text-xl" />
              </Link>
              <Link href="#" className="text-blue-400 hover:text-blue-600">
                <TwitterOutlined className="text-xl" />
              </Link>
              <Link href="#" className="text-red-600 hover:text-red-800">
                <InstagramOutlined className="text-xl" />
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card title="Contact Information" className="shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🌐</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WEBSITE</p>
                    <Link href="https://www.estheroward.com" className="text-blue-600 hover:underline">
                      www.estheroward.com
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">📞</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">PHONE</p>
                    <p>+1 202-555-0141</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">✉️</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">EMAIL ADDRESS</p>
                    <p>esther.howard@gmail.com</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Company Info */}
            <Card className="shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">📅</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">FOUNDED IN</p>
                    <p className="font-medium">14 June, 2021</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🏢</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ORGANIZATION TYPE</p>
                    <p className="font-medium">Private Company</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">👥</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">TEAM SIZE</p>
                    <p className="font-medium">120-300 Candidates</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">💻</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">INDUSTRY TYPE</p>
                    <p className="font-medium">Technology</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card title="Follow us on:" className="shadow-sm">
              <div className="flex gap-4">
                <Link href="#" className="text-blue-600 hover:text-blue-800">
                  <FacebookOutlined className="text-2xl" />
                </Link>
                <Link href="#" className="text-blue-400 hover:text-blue-600">
                  <TwitterOutlined className="text-2xl" />
                </Link>
                <Link href="#" className="text-pink-600 hover:text-pink-800">
                  <InstagramOutlined className="text-2xl" />
                </Link>
                <Link href="#" className="text-red-600 hover:text-red-800">
                  <YoutubeOutlined className="text-2xl" />
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Open Position (05)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <JobCard
              title="Techical Support Specialist"
              type="PART TIME"
              salary="Salary : $20,000 - $25,000"
              company="Google Inc."
              location="Dhaka, Bangladesh"
            />
            <JobCard
              title="Senior UX Designer"
              type="FULL TIME"
              salary="Salary : $20,000 - $25,000"
              company="Google Inc."
              location="Dhaka, Bangladesh"
            />
            <JobCard
              title="Marketing Officer"
              type="INTERNSHIP"
              salary="Salary : $20,000 - $25,000"
              company="Google Inc."
              location="Dhaka, Bangladesh"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function JobCard({ title, type, salary, company, location }: {
  title: string
  type: string
  salary: string
  company: string
  location: string
}) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${type === 'PART TIME' ? 'bg-green-100 text-green-600' : ''}
                ${type === 'FULL TIME' ? 'bg-blue-100 text-blue-600' : ''}
                ${type === 'INTERNSHIP' ? 'bg-purple-100 text-purple-600' : ''}
              `}>
                {type}
              </span>
              <span className="text-sm text-gray-500">{salary}</span>
            </div>
          </div>
          <Button type="text" icon={<span className="text-gray-400">☆</span>} />
        </div>
        
        <div className="flex items-center gap-2">
          <Avatar size="small" className="bg-gray-200 text-gray-700">
            G
          </Avatar>
          <div>
            <p className="font-medium">{company}</p>
            <p className="text-sm text-gray-500">📍 {location}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

