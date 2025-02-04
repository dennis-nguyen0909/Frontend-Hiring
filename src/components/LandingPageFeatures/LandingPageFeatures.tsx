
import { Button, Image } from "antd"
import { Search, Bell, BarChart2, CheckCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import logoH from '../../assets/logo/LogoH.png';
import ButtonComponent from "../Button/ButtonComponent";
import CandidateDashboard from '../../assets/introduce/dashboardCandidate.png'
import EmployerDashboard from '../../assets/introduce/dashboardEmployer.png'
export default function LandingPageExtended() {
    const navigate = useNavigate()
    const handleScrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
  return (
    <div className="bg-white text-black min-h-screen">
      {/* Header */}
      <header className="bg-black text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center cursor-pointer" onClick={()=>navigate('/')}>
            <Image preview={false} src={logoH}alt="HireDev Logo" width={40} height={40} className="mr-2" />
            HireDev
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="#features" onClick={() => handleScrollToSection('features')} className="hover:text-gray-300">
                  Tính năng
                </Link>
              </li>
              <li>
                <Link to="#for-candidates" onClick={() => handleScrollToSection('for-candidates')}  className="hover:text-gray-300">
                  Cho ứng viên
                </Link>
              </li>
              <li>
                <Link to="#for-employers" onClick={() => handleScrollToSection('for-employers')} className="hover:text-gray-300">
                  Cho nhà tuyển dụng
                </Link>
              </li>
              <li>
                <ButtonComponent onClick={()=>navigate('/login')}><div>Đăng nhập</div></ButtonComponent>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl font-bold mb-6">Kết nối tài năng với cơ hội</h1>
            <p className="text-xl mb-8">
              HireDev - Nền tảng tuyển dụng hàng đầu cho ngành công nghệ, kết nối ứng viên tài năng với các công ty hàng
              đầu.
            </p>
            <div className="flex space-x-4">
              <ButtonComponent><div>Tìm việc làm</div></ButtonComponent>
              <ButtonComponent><div>Đăng tuyển</div></ButtonComponent>
              
            </div>
          </div>
          <div className="md:w-1/2">
            <Image src={logoH} preview={false} alt="HireDev Platform" width={400} height={400} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">100,000+</h3>
              <p className="text-xl">Ứng viên tài năng</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">5,000+</h3>
              <p className="text-xl">Công ty hàng đầu</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">50,000+</h3>
              <p className="text-xl">Việc làm được đăng tải</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="w-12 h-12" />}
              title="Tìm kiếm thông minh"
              description="Sử dụng AI để đề xuất việc làm và ứng viên phù hợp nhất"
            />
            <FeatureCard
              icon={<BarChart2 className="w-12 h-12" />}
              title="Dashboard chi tiết"
              description="Quản lý công việc và ứng tuyển với giao diện trực quan"
            />
            <FeatureCard
              icon={<Bell className="w-12 h-12" />}
              title="Thông báo real-time"
              description="Nhận thông báo ngay lập tức về các cơ hội mới"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cách HireDev hoạt động</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Tạo hồ sơ"
              description="Ứng viên tạo hồ sơ chuyên nghiệp, nhà tuyển dụng tạo trang công ty"
            />
            <StepCard
              number="2"
              title="Kết nối"
              description="Hệ thống AI của chúng tôi kết nối ứng viên với công việc phù hợp nhất"
            />
            <StepCard
              number="3"
              title="Tuyển dụng"
              description="Nhà tuyển dụng phỏng vấn và tuyển dụng ứng viên tài năng"
            />
          </div>
        </div>
      </section>

      {/* For Candidates Section */}
      <section id="for-candidates" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Dành cho ứng viên</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Tìm kiếm cơ hội phát triển sự nghiệp</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  <span>Tìm việc làm phù hợp với kỹ năng và mong muốn</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  <span>Khám phá và ứng tuyển vào các công ty hàng đầu</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  <span>Nhận đề xuất việc làm phù hợp dựa trên AI</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  <span>Theo dõi trạng thái ứng tuyển trong thời gian thực</span>
                </li>
              </ul>
              <div className="mt-8">
              <ButtonComponent><div>Tạo hồ sơ ngay</div></ButtonComponent>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <Image src={CandidateDashboard} alt="Candidate Dashboard" preview={false} />
            </div>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section id="for-employers" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Dành cho nhà tuyển dụng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <Image src={EmployerDashboard} alt="Employer Dashboard" preview={false} className="object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-semibold mb-4">Quản lý tuyển dụng hiệu quả</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  <span>Đăng tin tuyển dụng và tiếp cận hàng ngàn ứng viên tiềm năng</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  <span>Sử dụng AI để lọc và đề xuất ứng viên phù hợp nhất</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  <span>Quản lý quy trình tuyển dụng với dashboard trực quan</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  <span>Phân tích dữ liệu tuyển dụng để tối ưu chiến lược</span>
                </li>
              </ul>
              <div className="mt-8">
                <ButtonComponent><div>Bắt đầu tuyển dụng</div></ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Khách hàng nói gì về chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="HireDev đã giúp chúng tôi tìm được những nhân tài tuyệt vời cho đội ngũ phát triển của mình."
              author="Nguyễn Văn A"
              position="CTO, Tech Solutions Inc."
              avatar="/avatar1.jpg"
            />
            <TestimonialCard
              quote="Tôi đã tìm được công việc mơ ước của mình thông qua HireDev. Quy trình ứng tuyển rất suôn sẻ và chuyên nghiệp."
              author="Trần Thị B"
              position="Senior Developer"
              avatar="/avatar2.jpg"
            />
            <TestimonialCard
              quote="Là một startup, chúng tôi đánh giá cao khả năng tiếp cận nhanh chóng đến các ứng viên chất lượng cao của HireDev."
              author="Lê Văn C"
              position="Founder, InnoTech"
              avatar="/avatar3.jpg"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng để bắt đầu?</h2>
          <p className="text-xl mb-8">
            Cho dù bạn đang tìm kiếm cơ hội mới hay muốn tuyển dụng nhân tài, HireDev luôn sẵn sàng hỗ trợ bạn.
          </p>
          <div className="flex justify-center space-x-4">
            <ButtonComponent><div>Tìm việc làm</div></ButtonComponent>

            <ButtonComponent><div>Đăng tuyển</div></ButtonComponent>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 flex items-center">
                <Image src="/logo.svg" alt="HireDev Logo" width={40} height={40} className="mr-2" />
                HireDev
              </div>
              <p className="text-gray-400">Kết nối tài năng với cơ hội trong ngành công nghệ</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Cho ứng viên</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Tìm việc làm
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Tạo hồ sơ
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Các công ty hàng đầu
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Cẩm nang nghề nghiệp
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Cho nhà tuyển dụng</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Đăng tin tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Tìm ứng viên
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Giải pháp tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Báo cáo thị trường
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Trợ giúp & Hỗ trợ
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 HireDev. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer> */}
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, position, avatar }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <p className="mb-4 italic">"{quote}"</p>
      <div className="flex items-center">
        <Image src={avatar || "/placeholder.svg"} alt={author} width={50} height={50} className="rounded-full mr-4" />
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-600">{position}</p>
        </div>
      </div>
    </div>
  )
}

