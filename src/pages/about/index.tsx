import { Image, Rate } from "antd";
import {
  UserIcon as UserGroupIcon,
  BuildingIcon as BuildingOfficeIcon,
  BriefcaseIcon,
} from "lucide-react";
import { CTACard } from "./CTACard";
import { StatsCard } from "./StatsCard";

export default function AboutPage() {
  const arrayData = [
    {
      name: "amazon",
      sourceUrl: "src/assets/company/amazon.webp",
    },
    {
      name: "google",
      sourceUrl: "src/assets/company/google.webp",
    },
    {
      name: "facebook",
      sourceUrl: "src/assets/company/face.webp",
    },
    {
      name: "nio",
      sourceUrl: "src/assets/company/NIO_logo.svg.png",
    },
    {
      name: "ieee",
      sourceUrl: "src/assets/company/ieee-logo.png",
    },
  ];
  const teams = [
    {
      name: "Minh Duy",
      sourceUrl: "src/assets/avatars/team_3.jpg",
      role: "Frontend Developer",
    },
    {
      name: "John",
      sourceUrl: "src/assets/avatars/team_1.webp",
      role: "Backend Developer",
    },
    {
      name: "KrasKa",
      sourceUrl: "src/assets/avatars/team_7.jpg",
      role: "CTO",
    },
    {
      name: "Dennis",
      sourceUrl: "src/assets/avatars/team_4.jpg",
      role: "Frontend Developer",
    },
    {
      name: "Kroaske",
      sourceUrl: "src/assets/avatars/team_5.jpg",
      role: "Design Analyst",
    },
    {
      name: "Celine",
      sourceUrl: "src/assets/avatars/team_6.jpg",
      role: "Tester",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-[12px]">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 font-medium">Chúng tôi là ai</span>
            <h1 className="text-4xl font-bold">
              Chúng tôi là một đội ngũ chuyên nghiệp và có kỹ năng cao.
            </h1>
            <p className="text-gray-600">
              Praesent non sem facilisis, hendrerit nisi vitae, vivamus quam.
              Aliquam metus elit, ultrices eu justo sed, dignissim tristique
              metus. Vestibulum maximus nec ante eget maximus.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatsCard
              icon={<BriefcaseIcon className="w-6 h-6 text-blue-600" />}
              number="175,324"
              label="Việc làm đang mở"
            />
            <StatsCard
              icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-600" />}
              number="97,354"
              label="Công ty"
            />
            <StatsCard
              icon={<UserGroupIcon className="w-6 h-6 text-blue-600" />}
              number="38,47,154"
              label="Ứng viên"
            />
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="container mx-auto px-4 py-12 border-y text-[12px]">
        <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
          {arrayData?.map((logo, idx) => (
            <Image
              preview={false}
              key={idx}
              src={`${logo?.sourceUrl}`}
              alt={logo?.name}
              width={120}
              height={40}
              className="h-8 object-contain"
            />
          ))}
        </div>
      </section>

      {/* Image Grid Section */}
      <section className="container mx-auto px-4 py-12 text-[12px]">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden flex flex-col"
            >
              <Image
                preview={false}
                src={`${team.sourceUrl}`}
                alt={`Thành viên ${index}`}
                width={"100%"}
                height={"100%"}
                className="w-full h-[300px] object-cover"
              />
              <div className="flex flex-col items-center justify-center">
                <div className="font-bold text-[20px]">{team?.name}</div>
                <div>{team?.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-12 text-[12px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 font-medium">
              Sứ mệnh của chúng tôi
            </span>
            <h2 className="text-3xl font-bold">
              Sứ mệnh của chúng tôi là giúp mọi người tìm kiếm công việc hoàn
              hảo.
            </h2>
            <p className="text-gray-600">
              Praesent non sem facilisis, hendrerit nisi vitae, vivamus quam.
              Aliquam metus elit, ultrices eu justo sed, dignissim tristique
              metus. Vestibulum maximus nec ante eget maximus.
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              preview={false}
              src={`src/assets/avatars/hiring.avif`}
              alt="Mission illustration"
              width={500}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-12 bg-gray-50 text-[12px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Image
            preview={false}
            src="src/assets/avatars/johnwick.jpg"
            alt="Testimonial"
            style={{ objectFit: "contain" }}
            width={500}
            height={400}
            className="rounded-lg object-cover"
          />
          <div className="space-y-6">
            <span className="text-blue-600 font-medium">Chứng thực</span>
            <h2 className="text-3xl font-bold">Những gì mọi người nói</h2>
            <Rate defaultValue={5} disabled className="text-blue-600" />
            <blockquote className="text-gray-600 italic">
              "Curabitur non tortor nisi. Mauris quis vehicula elit, sed commodo
              ipsum. Praesent tempor orci at dolor elementum, ut vestibulum
              felis commodo. Integer facilisis portitor vehicula. Maecenas
              venenatis dictum ligula. Quis vitae ultrices efficitur anteullam."
            </blockquote>
            <div className="font-medium">
              <p className="text-gray-900">John Wick</p>
              <p className="text-gray-500">Kỹ sư cao cấp</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 text-[12px]">
        <div className="grid md:grid-cols-2 gap-8">
          <CTACard
            title="Trở thành ứng viên"
            description="Tìm những công việc thú vị nhất từ các nhà tuyển dụng hàng đầu. Đăng ký ngay!"
            buttonText="Đăng ký ngay"
            imageSrc="src/assets/avatars/candidate.png"
          />
          <CTACard
            title="Trở thành nhà tuyển dụng"
            description="Tìm kiếm nhân tài tốt nhất cho công ty của bạn. Đăng ký ngay!"
            buttonText="Đăng ký ngay"
            imageSrc="src/assets/avatars/employer.png"
            variant="primary"
          />
        </div>
      </section>
    </main>
  );
}
