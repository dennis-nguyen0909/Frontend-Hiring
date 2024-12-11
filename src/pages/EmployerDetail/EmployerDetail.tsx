import { Button, Card, Avatar, Image } from 'antd'
import { InstagramOutlined, FacebookOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons'
import { Link, useLocation, useParams } from 'react-router-dom'
import { USER_API } from '../../services/modules/userServices'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import parse from 'html-react-parser';

export default function EmployerDetail() {
  const {id} =useParams()
  const userDetail=useSelector(state=>state.user)
  const [employerDetail,setEmployerDetail]=useState();
  const handleGetDetailEmployerDetail = async ()=>{
    try {
        const res = await USER_API.getDetailUser(id,userDetail?.access_token)
        console.log("resm",res)
        if(res.data){
          setEmployerDetail(res.data.items);
        }
    } catch (error) {
        console.error(error)
    }
  }
  useEffect(()=>{
    if(id){
      handleGetDetailEmployerDetail()
    }
  },[])
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
          // layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar  src={employerDetail?.avatar_company} size={64}  />
              <div>
                <h1 className="text-2xl font-semibold">{employerDetail?.company_name}</h1>
                <p className="text-gray-500">{employerDetail?.organization?.industry_type}</p>
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
               {parse(employerDetail?.description || '') }
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
              {parse(employerDetail?.organization?.company_vision || '') }

              </p>
            </Card>

            {/* Share Profile */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Share profile:</span>
              <Link to="#" className="text-blue-600 hover:text-blue-800">
                <FacebookOutlined className="text-xl" />
              </Link>
              <Link to="#" className="text-blue-400 hover:text-blue-600">
                <TwitterOutlined className="text-xl" />
              </Link>
              <Link to="#" className="text-red-600 hover:text-red-800">
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

