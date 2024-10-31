import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Info } from 'lucide-react'
import { ArrowLeftOutlined, ArrowRightOutlined, InfoOutlined, SearchOutlined } from '@ant-design/icons'

const locations = [
  "Thành phố Hồ Chí Minh",
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 9",
  "Quận 10",
  "Quận 11",
  "Quận 12",
]

export default function LocationSlider() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0])
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSearchJobs = () => {

    // Implement job search functionality here
  }

  const handleViewDetails = () => {

    // Implement location details view functionality here
  }

  return (
    <div className="relative max-w-screen-xl ">
      <div className="relative flex justify-between px-[40px]">
        <button
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-[#d3464f]"
          aria-label="Scroll left"
        >
          <ArrowLeftOutlined className="h-6 w-6 text-gray-600" />
        </button>
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 py-[10px]"
          style={{scrollbarWidth:'none',msOverflowStyle:'none'}}
        >
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#d3464f] ${
                selectedLocation === location
                  ? 'bg-[#d3464f] text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-[#d3464f]"
          aria-label="Scroll right"
        >
          <ArrowRightOutlined className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  )
}