import { Image, Input, Pagination } from 'antd'
import { Search, MapPin } from 'lucide-react'
import { USER_API } from '../../services/modules/userServices'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { Meta } from '../../types'
import CustomPagination from '../../components/ui/CustomPanigation/CustomPanigation'
import { current } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'

const popularSearches = [
  'Front-end',
  'Back-end',
  'Development',
  'PHP',
  'Laravel',
  'Bootstrap',
  'Developer',
  'Team Lead',
  'Product Testing',
  'JavaScript',
]

const jobListings = Array(12).fill({
  company: 'Dribbble',
  location: 'Dhaka, Bangladesh',
  featured: true,
  openPositions: 3,
  logo: '/placeholder.svg',
})

export default function EmployeesPage() {
  const [searchValue,setSearchValue]=useState<string>('')
  const userDetail = useSelector(state=>state.user)
  const [companies,setCompanies]=useState([])
  const [meta,setMeta]=useState<Meta>({})
  const navigate =useNavigate()
  const handleSearch = async(query:any,current=1,pageSize=15)=>{
    try {
      const params =  {
          current,
          pageSize,
          query
      }
        const response = await USER_API.getAllCompany(params,userDetail?.access_token);
        if(response.data){
          setCompanies(response.data.items);
          setMeta(response.data.meta)
        }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(()=>{
    handleSearch({})
  },[])

  const debounceSearchValue = useDebounce(searchValue,500);
  const onSearch =  async()=>{
      await handleSearch({
        company_name:debounceSearchValue
      });
  }
  const handleNavigate = (id)=>{
    navigate(`/employer-detail/${id}`)
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Search Section */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                size="large"
                placeholder="Search by: Name company ..."
                value={searchValue}
                onChange={(e)=>setSearchValue(e.target.value)}
                prefix={<Search className="text-gray-400" size={20} />}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input
                size="large"
                placeholder="City, state or zip code"
                prefix={<MapPin className="text-gray-400" size={20} />}
                className="w-full"
              />
            </div>
            <button onClick={onSearch} className="rounded-lg bg-blue-600 px-8 py-2 text-white transition-colors hover:bg-blue-700">
              Find Job
            </button>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Popular searches:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies?.map((company, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-pink-500">
                    <Image
                      src={company?.avatar_company}
                      alt={company?.avatar_company}
                      width={48}
                      height={48}
                      preview={false}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{company?.company_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{`${company?.district_id?.name},${company?.city_id?.name}`}</span>
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-600">
                  Featured
                </span>
              </div>
              <button onClick={()=>handleNavigate(company?._id)} className="w-full rounded-lg bg-blue-50 py-2 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">
                Open Position ({company?.jobs_ids?.length || 0})
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <CustomPagination
          currentPage={meta?.current_page}
          perPage={meta?.per_page}
          total={meta?.total}
          onPageChange={(current,pageSize)=>handleSearch({
          },current,
          pageSize)}
           />
        </div>
      </div>
    </div>
  )
}

